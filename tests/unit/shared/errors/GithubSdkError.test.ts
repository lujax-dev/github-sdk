import { GithubSdkError } from "../../../../src/shared/errors/GithubSdkError";

describe("GithubSdkError", () => {
    it("prefixes the message with the package name", () => {
        const error = new GithubSdkError("something went wrong");
        expect(error.message).toBe("@lujax/github-sdk: something went wrong");
    });

    it("defaults exitCode to 1", () => {
        const error = new GithubSdkError("something went wrong");
        expect(error.exitCode).toBe(1);
    });

    it("accepts a custom exitCode", () => {
        const error = new GithubSdkError("something went wrong", 2);
        expect(error.exitCode).toBe(2);
    });

    it("sets name to GithubSdkError", () => {
        const error = new GithubSdkError("something went wrong");
        expect(error.name).toBe("GithubSdkError");
    });

    it("is an instance of Error", () => {
        const error = new GithubSdkError("something went wrong");
        expect(error).toBeInstanceOf(Error);
    });
});
