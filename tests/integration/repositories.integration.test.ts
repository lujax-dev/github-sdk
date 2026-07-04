import { GithubClient } from "../../src/client/GithubClient";
import { createIntegrationClient, runIntegration } from "./helpers";

const describeIntegration = runIntegration ? describe : describe.skip;

describeIntegration("RepositoryService integration", () => {
    let github: GithubClient;

    beforeAll(() => {
        github = createIntegrationClient();
    });

    it("gets the configured repository", async () => {
        const repository = await github.repositories.get();

        expect(repository.name).toBe(process.env.GITHUB_TEST_REPO);
        expect(repository.fullName).toBe(
            `${process.env.GITHUB_TEST_OWNER}/${process.env.GITHUB_TEST_REPO}`,
        );
        expect(typeof repository.id).toBe("number");
    });
});
