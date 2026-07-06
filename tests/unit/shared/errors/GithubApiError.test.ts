import { GithubApiError } from "../../../../src/shared/errors/GithubApiError";
import { GithubSdkError } from "../../../../src/shared/errors/GithubSdkError";

describe("GithubApiError", () => {
    it("includes the status and message", () => {
        const error = new GithubApiError(404, "Not Found");
        expect(error.message).toBe(
            "@lujax/github-sdk: GitHub API error (404): Not Found",
        );
        expect(error.status).toBe(404);
    });

    it("sets name to GithubApiError", () => {
        const error = new GithubApiError(404, "Not Found");
        expect(error.name).toBe("GithubApiError");
    });

    it("carries documentationUrl and details when provided", () => {
        const error = new GithubApiError(
            422,
            "Validation Failed",
            "https://docs.github.com/rest",
            {
                field: "name",
            },
        );
        expect(error.documentationUrl).toBe("https://docs.github.com/rest");
        expect(error.details).toEqual({ field: "name" });
    });

    it("leaves documentationUrl and details undefined when omitted", () => {
        const error = new GithubApiError(500, "Server Error");
        expect(error.documentationUrl).toBeUndefined();
        expect(error.details).toBeUndefined();
    });

    it("is an instance of GithubSdkError", () => {
        const error = new GithubApiError(404, "Not Found");
        expect(error).toBeInstanceOf(GithubSdkError);
    });
});
