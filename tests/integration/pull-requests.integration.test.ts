import { GithubClient } from "../../src/client/GithubClient";
import { createIntegrationClient, runIntegration } from "./helpers";

const describeIntegration = runIntegration ? describe : describe.skip;

describeIntegration("PullRequestService integration", () => {
    let github: GithubClient;

    beforeAll(() => {
        github = createIntegrationClient();
    });

    it("lists pull requests for the configured repo", async () => {
        const pullRequests = await github.pullRequests.list();

        expect(Array.isArray(pullRequests)).toBe(true);
        if (pullRequests.length > 0) {
            const [pullRequest] = pullRequests;
            expect(typeof pullRequest.number).toBe("number");
            expect(typeof pullRequest.title).toBe("string");
            expect(["open", "closed"]).toContain(pullRequest.state);
        }
    });
});
