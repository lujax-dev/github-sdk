import { generateKeyPairSync } from "crypto";
import { GitHubAppAuth } from "../../../src/auth/GitHubAppAuth";

function generateTestPrivateKeyPem(): string {
    const { privateKey } = generateKeyPairSync("rsa", {
        modulusLength: 2048,
        publicKeyEncoding: { type: "spki", format: "pem" },
        privateKeyEncoding: { type: "pkcs8", format: "pem" },
    });
    return privateKey as unknown as string;
}

function mockResponse(status: number, body: unknown): Response {
    return {
        status,
        ok: status >= 200 && status < 300,
        text: async () => (body === null ? "" : JSON.stringify(body)),
    } as unknown as Response;
}

describe("GitHubAppAuth", () => {
    const privateKey = generateTestPrivateKeyPem();

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("signs a JWT and exchanges it for an installation access token", async () => {
        const fetchMock = jest.fn().mockResolvedValue(
            mockResponse(201, {
                token: "installation-token-1",
                expires_at: new Date(Date.now() + 3600_000).toISOString(),
            }),
        );
        global.fetch = fetchMock;

        const auth = new GitHubAppAuth({
            appId: "12345",
            privateKey,
            installationId: "67890",
        });

        await expect(auth.getToken()).resolves.toBe("installation-token-1");

        expect(fetchMock).toHaveBeenCalledWith(
            "https://api.github.com/app/installations/67890/access_tokens",
            expect.objectContaining({
                method: "POST",
                headers: expect.objectContaining({
                    Accept: "application/vnd.github+json",
                    "X-GitHub-Api-Version": "2022-11-28",
                }),
            }),
        );
        const authHeader = (
            fetchMock.mock.calls[0][1] as { headers: Record<string, string> }
        ).headers.Authorization;
        expect(authHeader).toMatch(/^Bearer ey/);
    });

    it("caches the installation token and does not re-exchange while it's still valid", async () => {
        const fetchMock = jest.fn().mockResolvedValue(
            mockResponse(201, {
                token: "installation-token-1",
                expires_at: new Date(Date.now() + 3600_000).toISOString(),
            }),
        );
        global.fetch = fetchMock;

        const auth = new GitHubAppAuth({
            appId: "12345",
            privateKey,
            installationId: "67890",
        });

        await auth.getToken();
        await auth.getToken();

        expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it("re-exchanges once the cached token is within the refresh margin of expiry", async () => {
        const fetchMock = jest
            .fn()
            .mockResolvedValueOnce(
                mockResponse(201, {
                    token: "installation-token-1",
                    expires_at: new Date(Date.now() + 30_000).toISOString(),
                }),
            )
            .mockResolvedValueOnce(
                mockResponse(201, {
                    token: "installation-token-2",
                    expires_at: new Date(Date.now() + 3600_000).toISOString(),
                }),
            );
        global.fetch = fetchMock;

        const auth = new GitHubAppAuth({
            appId: "12345",
            privateKey,
            installationId: "67890",
        });

        await expect(auth.getToken()).resolves.toBe("installation-token-1");
        await expect(auth.getToken()).resolves.toBe("installation-token-2");
        expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it("throws GithubApiError when the token exchange fails", async () => {
        global.fetch = jest.fn().mockResolvedValue(
            mockResponse(404, {
                message: "Not Found",
                documentation_url: "https://docs.github.com/errors",
            }),
        );

        const auth = new GitHubAppAuth({
            appId: "12345",
            privateKey,
            installationId: "does-not-exist",
        });

        await expect(auth.getToken()).rejects.toMatchObject({
            status: 404,
            documentationUrl: "https://docs.github.com/errors",
        });
    });
});
