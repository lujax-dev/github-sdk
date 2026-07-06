import { MissingConfigError } from "../../../../src/shared/errors/MissingConfigError";
import { GithubSdkError } from "../../../../src/shared/errors/GithubSdkError";

describe("MissingConfigError", () => {
    it("lists the missing properties in the message", () => {
        const error = new MissingConfigError(["owner", "repo"]);
        expect(error.message).toBe(
            "@lujax/github-sdk: GithubClient is missing service dependent config properties: owner,repo",
        );
    });

    it("sets name to MissingConfigError", () => {
        const error = new MissingConfigError(["owner"]);
        expect(error.name).toBe("MissingConfigError");
    });

    it("is an instance of GithubSdkError", () => {
        const error = new MissingConfigError(["owner"]);
        expect(error).toBeInstanceOf(GithubSdkError);
    });
});
