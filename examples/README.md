# Examples

Real-world usage scripts. Each one is a standalone `.ts` file you can run directly.

## Running

These scripts import from `@lujax/github-sdk` as if it were installed from npm — they aren't wired into this repo's own build. To run one:

```bash
npm install @lujax/github-sdk
npx tsx examples/basic-usage.ts
```

(`npx tsx` runs a TypeScript file directly without a separate compile step and without adding a permanent dependency to your project. `ts-node examples/basic-usage.ts` works the same way if you already use it.)

Set these environment variables first (a Personal Access Token is the quickest way to try these out — see the main [README](../README.md#authentication) for GitHub App auth):

```bash
export GITHUB_TOKEN=ghp_xxxxxxxxxxxx
export GITHUB_OWNER=your-username-or-org
export GITHUB_REPO=your-repo-name
```

## Scripts

| File                                       | What it shows                                                   |
| ------------------------------------------ | --------------------------------------------------------------- |
| [`basic-usage.ts`](basic-usage.ts)         | Constructing a client and calling a couple of read-only methods |
| [`list-prs.ts`](list-prs.ts)               | Listing pull requests and printing their cycle time             |
| [`manage-releases.ts`](manage-releases.ts) | Creating a release, then updating and deleting it               |
