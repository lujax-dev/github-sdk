import { GithubClient } from "../../../src/client/GithubClient";
import { InvalidTokenError } from "../../../src/shared/errors/InvalidTokenError";
import { GitHubAuth } from "../../../src/auth/GitHubAuth";

function mockResponse(status: number, body: unknown): Response {
    return {
        status,
        ok: status >= 200 && status < 300,
        headers: new Headers(),
        text: async () => (body === null ? "" : JSON.stringify(body)),
    } as unknown as Response;
}

describe("GithubClient", () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("throws InvalidTokenError when neither token nor auth is provided", () => {
        expect(() => new GithubClient({})).toThrow(InvalidTokenError);
    });

    it("authenticates with a plain PAT string", async () => {
        const fetchMock = jest
            .fn()
            .mockResolvedValue(mockResponse(200, { login: "octocat" }));
        global.fetch = fetchMock;

        const github = new GithubClient({
            token: "pat-token",
            owner: "lujax-dev",
            repo: "github-sdk",
        });
        await github.request("/user");

        const headers = (
            fetchMock.mock.calls[0][1] as { headers: Record<string, string> }
        ).headers;
        expect(headers.Authorization).toBe("Bearer pat-token");
    });

    it("authenticates with a custom GitHubAuth strategy, which takes precedence over token", async () => {
        const fetchMock = jest
            .fn()
            .mockResolvedValue(mockResponse(200, { login: "octocat" }));
        global.fetch = fetchMock;

        const auth: GitHubAuth = { getToken: async () => "auth-token" };
        const github = new GithubClient({
            token: "pat-token",
            auth,
            owner: "lujax-dev",
            repo: "github-sdk",
        });
        await github.request("/user");

        const headers = (
            fetchMock.mock.calls[0][1] as { headers: Record<string, string> }
        ).headers;
        expect(headers.Authorization).toBe("Bearer auth-token");
    });
});
