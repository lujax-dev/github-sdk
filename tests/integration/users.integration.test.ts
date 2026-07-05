import { GithubClient } from "../../src/client/GithubClient";
import { createIntegrationClient, runIntegration } from "./helpers";

const describeIntegration = runIntegration ? describe : describe.skip;

describeIntegration("UserService integration", () => {
    let github: GithubClient;

    beforeAll(() => {
        github = createIntegrationClient();
    });

    it("gets the authenticated user", async () => {
        const user = await github.users.getAuthenticated();

        expect(typeof user.username).toBe("string");
        expect(user.username.length).toBeGreaterThan(0);
        expect(typeof user.id).toBe("number");
    });
});
