import { InvalidTokenError } from "../../../../src/shared/errors/InvalidTokenError";
import { GithubSdkError } from "../../../../src/shared/errors/GithubSdkError";

describe("InvalidTokenError", () => {
    it("has a fixed message", () => {
        const error = new InvalidTokenError();
        expect(error.message).toBe("@lujax/github-sdk: Invalid GitHub Token");
    });

    it("sets name to InvalidTokenError", () => {
        const error = new InvalidTokenError();
        expect(error.name).toBe("InvalidTokenError");
    });

    it("is an instance of GithubSdkError", () => {
        const error = new InvalidTokenError();
        expect(error).toBeInstanceOf(GithubSdkError);
    });
});
