import { GithubClient } from "../../src/client/GithubClient";

/**
 * Integration tests hit the real GitHub API and are skipped entirely when
 * `GITHUB_TEST_TOKEN` isn't set (e.g. in local dev or forked-repo CI runs
 * without secrets).
 */
export const runIntegration = !!process.env.GITHUB_TEST_TOKEN;

export function createIntegrationClient(): GithubClient {
    return new GithubClient({
        token: process.env.GITHUB_TEST_TOKEN,
        owner: process.env.GITHUB_TEST_OWNER,
        repo: process.env.GITHUB_TEST_REPO,
    });
}
