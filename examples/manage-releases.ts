/**
 * Create a release, update it, then delete it.
 * Run with: npx tsx examples/manage-releases.ts
 *
 * Note: this actually creates and deletes a release on the configured repo —
 * point GITHUB_REPO at a throwaway/test repo before running it.
 */
import { GithubClient } from "@lujax/github-sdk";

async function main() {
    const github = new GithubClient({
        token: process.env.GITHUB_TOKEN,
        owner: process.env.GITHUB_OWNER,
        repo: process.env.GITHUB_REPO,
    });

    const release = await github.releases.create({
        tagName: `example-${Date.now()}`,
        name: "Example release",
        body: "Created by examples/manage-releases.ts",
        draft: true,
    });
    console.log(`Created release ${release.id} (${release.tagName})`);

    const updated = await github.releases.update({
        releaseId: release.id,
        body: "Updated by examples/manage-releases.ts",
    });
    console.log(`Updated release ${updated.id}: ${updated.body}`);

    await github.releases.delete(release.id);
    console.log(`Deleted release ${release.id}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
