import { assertConfig } from "../../../../src/shared/utils/config.utils";
import {
    GithubClient,
    GithubClientConfig,
} from "../../../../src/client/GithubClient";
import { MissingConfigError } from "../../../../src/shared/errors/MissingConfigError";

function fakeClient(config: GithubClientConfig): GithubClient {
    return { config } as GithubClient;
}

describe("assertConfig", () => {
    it("does not throw when all required keys are present", () => {
        const client = fakeClient({ owner: "lujax-dev", repo: "github-sdk" });
        expect(() => assertConfig(client, ["owner", "repo"])).not.toThrow();
    });

    it("throws MissingConfigError when a required key is absent", () => {
        const client = fakeClient({});
        expect(() => assertConfig(client, ["owner", "repo"])).toThrow(
            MissingConfigError,
        );
    });

    it("throws MissingConfigError when a required key is an empty string", () => {
        const client = fakeClient({ owner: "" });
        expect(() => assertConfig(client, ["owner"])).toThrow(
            MissingConfigError,
        );
    });
});
