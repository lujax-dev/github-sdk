/**
 * Construct a client and call a couple of read-only methods.
 * Run with: npx tsx examples/basic-usage.ts
 */
import { GithubClient } from "@lujax/github-sdk";

async function main() {
    const github = new GithubClient({
        token: process.env.GITHUB_TOKEN,
        owner: process.env.GITHUB_OWNER,
        repo: process.env.GITHUB_REPO,
    });

    const repo = await github.repositories.get();
    console.log(`${repo.fullName}: ${repo.description ?? "(no description)"}`);
    console.log(
        `Stars: ${repo.stargazersCount} · Open issues: ${repo.openIssuesCount}`,
    );

    const user = await github.users.getAuthenticated();
    console.log(`Authenticated as: ${user.username}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
