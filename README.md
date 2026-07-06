# @lujax/github-sdk

A TypeScript-first, ergonomic wrapper around the [GitHub REST API](https://docs.github.com/en/rest). Calls `api.github.com` directly using native `fetch` — no Octokit, no third-party HTTP library.

- **Clean TypeScript domain types** — camelCase interfaces instead of raw snake_case API responses
- **Typed errors** — `GithubApiError`, `InvalidTokenError`, `MissingConfigError` instead of guessing at response shapes
- **Service-based API** — `github.pullRequests.list()` instead of hand-building fetch calls
- **Built-in rate limiting, retries, and ETag caching** — no extra config required
- **PAT or GitHub App auth**, swappable behind one interface
- **Near-zero dependencies** — `jose` for GitHub App JWT signing is the only runtime dependency

## Installation

```bash
npm install @lujax/github-sdk
```

Requires Node.js 18 or later (uses native `fetch`).

## Quick start

```ts
import { GithubClient } from "@lujax/github-sdk";

const github = new GithubClient({
    token: process.env.GITHUB_TOKEN,
    owner: "lujax-dev",
    repo: "github-sdk",
});

const pullRequests = await github.pullRequests.list();
const repo = await github.repositories.get();
```

`owner`, `repo`, and `org` are all optional on `GithubClientConfig` — each service asserts the config it actually needs at construction time, throwing `MissingConfigError` immediately if something's missing rather than failing later on a request. A `GithubClient` instance is scoped to one `owner`/`repo` pair; to work with multiple repositories, create multiple clients.

## Authentication

### Personal Access Token (PAT)

The simplest option — pass a token string directly:

```ts
const github = new GithubClient({
    token: process.env.GITHUB_TOKEN,
    owner: "lujax-dev",
    repo: "github-sdk",
});
```

### GitHub App

For production use as a GitHub App, pass a `GitHubAppAuth` instance via `auth` instead of `token`. It signs a JWT from your App's private key, exchanges it for an installation access token, and refreshes it automatically as it nears expiry — no extra code required:

```ts
import { GithubClient, GitHubAppAuth } from "@lujax/github-sdk";

const github = new GithubClient({
    auth: new GitHubAppAuth({
        appId: process.env.GITHUB_APP_ID,
        privateKey: process.env.GITHUB_APP_PRIVATE_KEY,
        installationId: process.env.GITHUB_APP_INSTALLATION_ID,
    }),
    owner: "lujax-dev",
    repo: "github-sdk",
});
```

`token` and `auth` are both optional individually, but at least one is required — `GithubClient` throws `InvalidTokenError` otherwise. If both are set, `auth` takes precedence.

Both strategies implement the same `GitHubAuth` interface (`{ getToken(): Promise<string> }`), so you can switch between them — e.g. PAT locally, GitHub App in production — without changing any other code. `PatAuth` (also exported) wraps a token identically to passing `token` directly; use `auth: new PatAuth(token)` if you'd rather keep every strategy behind the same `auth` field.

## Services

Each service is scoped to the `owner`/`repo`/`org` set on the client and exposed as a property:

| Service       | Access                 | Requires                                          | What it covers                                                                                  |
| ------------- | ---------------------- | ------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Pull Requests | `github.pullRequests`  | `owner`, `repo`                                   | list/get/create/update/merge, commits, files, reviews, `cycleTime()`, `isMerged()`              |
| Repositories  | `github.repositories`  | `owner`, `repo` (some methods need `org` instead) | get/update/delete, topics, tags, languages, contributors, security settings, org-scoped listing |
| Issues        | `github.issues`        | `owner`, `repo`                                   | list/get/create/update, comments                                                                |
| Releases      | `github.releases`      | `owner`, `repo`                                   | list/get/getLatest/getByTag/create/update/delete                                                |
| Workflows     | `github.workflows`     | `owner`, `repo`                                   | list/get workflows, list/get/cancel/re-run runs, trigger dispatch                               |
| Organizations | `github.organizations` | `org`                                             | get/update, listings, membership management                                                     |
| Users         | `github.users`         | —                                                 | authenticated user, lookup by username/ID, list                                                 |

There's no standalone commits service — list commits on a PR via `github.pullRequests.listCommits(pullNumber)`.

Every public method has JSDoc with a runnable example — full signatures are in the source, e.g. [`PullRequestService.ts`](src/modules/pull-requests/PullRequestService.ts), [`RepositoryService.ts`](src/modules/repositories/RepositoryService.ts).

## Error handling

All non-2xx API responses throw typed errors instead of returning a raw error shape:

```ts
import {
    GithubApiError,
    InvalidTokenError,
    MissingConfigError,
} from "@lujax/github-sdk";

try {
    await github.pullRequests.get(9999);
} catch (err) {
    if (err instanceof GithubApiError) {
        console.error(err.status, err.message, err.documentationUrl);
    }
}
```

- `GithubSdkError` — base class for every error the SDK throws
- `GithubApiError` — thrown on any non-ok GitHub API response; carries `.status`, `.documentationUrl`, and `.details`
- `InvalidTokenError` — thrown when a `GithubClient` is constructed without `token` or `auth`
- `MissingConfigError` — thrown when a service is constructed without the `owner`/`repo`/`org` it needs

## HTTP behaviour

Built into every request, with no configuration needed:

- **Rate limiting** — proactively waits out the reset window when `x-ratelimit-remaining` hits 0, instead of letting requests fail with a 403
- **Retries** — 3 attempts with 1s/2s/4s backoff on `5xx` and `429` responses
- **ETag caching** — repeat `GET`s send `If-None-Match`; a `304` returns the cached body for free and doesn't count against your rate limit

## License

MIT
