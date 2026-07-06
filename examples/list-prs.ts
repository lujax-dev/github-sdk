/**
 * List pull requests and print each one's cycle time (open -> merge duration).
 * Run with: npx tsx examples/list-prs.ts
 */
import { GithubClient } from "@lujax/github-sdk";

async function main() {
    const github = new GithubClient({
        token: process.env.GITHUB_TOKEN,
        owner: process.env.GITHUB_OWNER,
        repo: process.env.GITHUB_REPO,
    });

    const pullRequests = await github.pullRequests.list();

    for (const pr of pullRequests) {
        const cycleTime = await github.pullRequests.cycleTime(pr.number);
        const status = pr.isMerged
            ? `merged in ${cycleTime.totalHours?.toFixed(1)}h`
            : "still open";

        console.log(`#${pr.number} ${pr.title} — ${status}`);
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
