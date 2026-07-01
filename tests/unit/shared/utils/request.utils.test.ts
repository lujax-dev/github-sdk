import { createRequestClient } from "../../../../src/shared/utils/request.utils";
import { GithubApiError } from "../../../../src/shared/errors/GithubApiError";

function mockResponse(
    status: number,
    body: unknown,
    headers: Record<string, string> = {},
): Response {
    return {
        status,
        ok: status >= 200 && status < 300,
        headers: new Headers(headers),
        text: async () => (body === null ? "" : JSON.stringify(body)),
    } as unknown as Response;
}

describe("createRequestClient", () => {
    afterEach(() => {
        jest.restoreAllMocks();
        jest.useRealTimers();
    });

    it("sets the correct GitHub API headers", async () => {
        const fetchMock = jest
            .fn()
            .mockResolvedValue(mockResponse(200, { ok: true }));
        global.fetch = fetchMock;

        const client = createRequestClient(
            "https://api.github.com",
            "test-token",
        );
        await client("/some/path");

        expect(fetchMock).toHaveBeenCalledWith(
            "https://api.github.com/some/path",
            expect.objectContaining({
                headers: expect.objectContaining({
                    "X-GitHub-Api-Version": "2022-11-28",
                    Authorization: "Bearer test-token",
                    Accept: "application/vnd.github+json",
                }),
            }),
        );
    });

    it("throws GithubApiError with documentationUrl and details on a non-ok response", async () => {
        global.fetch = jest.fn().mockResolvedValue(
            mockResponse(422, {
                message: "Validation Failed",
                documentation_url: "https://docs.github.com/errors",
                details: [{ field: "title" }],
            }),
        );

        const client = createRequestClient(
            "https://api.github.com",
            "test-token",
        );

        await expect(client("/repos/owner/repo")).rejects.toMatchObject({
            status: 422,
            documentationUrl: "https://docs.github.com/errors",
            details: [{ field: "title" }],
        });
    });

    it("returns null data for empty-body responses (e.g. 204)", async () => {
        global.fetch = jest.fn().mockResolvedValue(mockResponse(204, null));

        const client = createRequestClient(
            "https://api.github.com",
            "test-token",
        );
        const result = await client("/repos/owner/repo/pulls/1/merge");

        expect(result.status).toBe(204);
        expect(result.data).toBeNull();
    });

    describe("retry logic", () => {
        it("retries on 503 and succeeds on the second attempt", async () => {
            jest.useFakeTimers();
            const fetchMock = jest
                .fn()
                .mockResolvedValueOnce(
                    mockResponse(503, { message: "Service Unavailable" }),
                )
                .mockResolvedValueOnce(mockResponse(200, { ok: true }));
            global.fetch = fetchMock;

            const client = createRequestClient(
                "https://api.github.com",
                "test-token",
            );

            const promise = client("/repos/owner/repo");
            await jest.advanceTimersByTimeAsync(1000);
            const result = await promise;

            expect(fetchMock).toHaveBeenCalledTimes(2);
            expect(result.status).toBe(200);
        });

        it("retries on 429 the same as 5xx", async () => {
            jest.useFakeTimers();
            const fetchMock = jest
                .fn()
                .mockResolvedValueOnce(
                    mockResponse(429, { message: "Too Many Requests" }),
                )
                .mockResolvedValueOnce(mockResponse(200, { ok: true }));
            global.fetch = fetchMock;

            const client = createRequestClient(
                "https://api.github.com",
                "test-token",
            );

            const promise = client("/repos/owner/repo");
            await jest.advanceTimersByTimeAsync(1000);
            const result = await promise;

            expect(fetchMock).toHaveBeenCalledTimes(2);
            expect(result.status).toBe(200);
        });

        it("does not retry on a non-retryable 4xx", async () => {
            const fetchMock = jest
                .fn()
                .mockResolvedValue(mockResponse(404, { message: "Not Found" }));
            global.fetch = fetchMock;

            const client = createRequestClient(
                "https://api.github.com",
                "test-token",
            );

            await expect(client("/repos/owner/repo")).rejects.toThrow(
                GithubApiError,
            );
            expect(fetchMock).toHaveBeenCalledTimes(1);
        });

        it("throws after exhausting all 3 attempts", async () => {
            jest.useFakeTimers();
            const fetchMock = jest
                .fn()
                .mockResolvedValue(
                    mockResponse(503, { message: "Service Unavailable" }),
                );
            global.fetch = fetchMock;

            const client = createRequestClient(
                "https://api.github.com",
                "test-token",
            );

            const promise = client("/repos/owner/repo");
            const assertion = expect(promise).rejects.toThrow(GithubApiError);
            await jest.advanceTimersByTimeAsync(1000);
            await jest.advanceTimersByTimeAsync(2000);
            await assertion;

            expect(fetchMock).toHaveBeenCalledTimes(3);
        });
    });

    describe("rate limiting", () => {
        it("queues the next request until x-ratelimit-reset when remaining hits 0", async () => {
            jest.useFakeTimers();
            const resetEpochSeconds = Math.floor(Date.now() / 1000) + 5;
            const fetchMock = jest
                .fn()
                .mockResolvedValueOnce(
                    mockResponse(
                        200,
                        { ok: true },
                        {
                            "x-ratelimit-remaining": "0",
                            "x-ratelimit-reset": String(resetEpochSeconds),
                        },
                    ),
                )
                .mockResolvedValueOnce(mockResponse(200, { ok: true }));
            global.fetch = fetchMock;

            const client = createRequestClient(
                "https://api.github.com",
                "test-token",
            );

            await client("/repos/owner/repo");

            let secondResolved = false;
            const secondPromise = client("/repos/owner/repo").then((r) => {
                secondResolved = true;
                return r;
            });

            await Promise.resolve();
            expect(secondResolved).toBe(false);
            expect(fetchMock).toHaveBeenCalledTimes(1);

            await jest.advanceTimersByTimeAsync(5000);
            await secondPromise;

            expect(secondResolved).toBe(true);
            expect(fetchMock).toHaveBeenCalledTimes(2);
        });

        it("does not wait when rate limit remaining is above 0", async () => {
            const fetchMock = jest.fn().mockResolvedValue(
                mockResponse(
                    200,
                    { ok: true },
                    {
                        "x-ratelimit-remaining": "10",
                        "x-ratelimit-reset": String(
                            Math.floor(Date.now() / 1000) + 3600,
                        ),
                    },
                ),
            );
            global.fetch = fetchMock;

            const client = createRequestClient(
                "https://api.github.com",
                "test-token",
            );

            await client("/repos/owner/repo");
            await client("/repos/owner/repo");

            expect(fetchMock).toHaveBeenCalledTimes(2);
        });
    });

    describe("ETag caching", () => {
        it("sends If-None-Match on a repeat GET and returns cached data on 304", async () => {
            const fetchMock = jest
                .fn()
                .mockResolvedValueOnce(
                    mockResponse(200, { id: 1 }, { etag: "abc123" }),
                )
                .mockResolvedValueOnce(mockResponse(304, null));
            global.fetch = fetchMock;

            const client = createRequestClient(
                "https://api.github.com",
                "test-token",
            );

            const first = await client("/repos/owner/repo");
            expect(first.data).toEqual({ id: 1 });

            const second = await client("/repos/owner/repo");
            expect(second.status).toBe(304);
            expect(second.data).toEqual({ id: 1 });

            const secondCallHeaders = (
                fetchMock.mock.calls[1][1] as {
                    headers: Record<string, string>;
                }
            ).headers;
            expect(secondCallHeaders["If-None-Match"]).toBe("abc123");
        });

        it("does not send If-None-Match for a POST request", async () => {
            const fetchMock = jest
                .fn()
                .mockResolvedValueOnce(
                    mockResponse(200, { id: 1 }, { etag: "abc123" }),
                )
                .mockResolvedValueOnce(mockResponse(201, { id: 2 }));
            global.fetch = fetchMock;

            const client = createRequestClient(
                "https://api.github.com",
                "test-token",
            );

            await client("/repos/owner/repo");
            await client("/repos/owner/repo", { method: "POST" });

            const secondCallHeaders = (
                fetchMock.mock.calls[1][1] as {
                    headers: Record<string, string>;
                }
            ).headers;
            expect(secondCallHeaders["If-None-Match"]).toBeUndefined();
        });
    });
});
