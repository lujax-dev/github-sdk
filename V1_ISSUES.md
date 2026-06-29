# @lujax/github-sdk — v1 Issue Tracker

> When every issue in this file is closed, the SDK is ready to publish to npm as `@lujax/github-sdk` v1.
>
> Create these as GitHub Issues on the repo. Close each one with a PR into `dev`, then merge `dev` → `main` for the release.

---

## Foundation

### #1 — Fix package.json
**Labels:** `bug`, `infrastructure`

- Change `"name"` from `"github-sdk"` to `"@lujax/github-sdk"`
- Change `"license"` from `"ISC"` to `"MIT"`
- Remove `"type": "module"` (conflicts with `tsconfig.json` `"module": "commonjs"`)
- Add scripts: `"test"`, `"test:watch"`, `"test:coverage"`

**Done when:** `npm publish --dry-run` shows the correct package name; no ESM/CJS conflict.

---

### #2 — Set up Jest + ts-jest
**Labels:** `infrastructure`, `testing`

- Install `jest`, `ts-jest`, `@types/jest` as dev dependencies
- Create `jest.config.ts` with `ts-jest` preset, `testEnvironment: "node"`, roots at `tests/`
- Create empty `tests/unit/` and `tests/integration/` directories with `.gitkeep`

**Done when:** `npm test` runs without error (zero test suites is fine at this point).

---

## Bug Fixes

### #3 — Fix UserService path bugs
**Labels:** `bug`

Three methods have wrong API paths:
1. `updateAuthenticated()` — sends `PATCH /users` but should be `PATCH /user`
2. `list()` — calls `GET /user` but should be `GET /users`
3. `getByUsername()` — calls `GET /user/:username` but should be `GET /users/:username`

**Done when:** unit tests mock `GithubClient.request` and assert the correct paths are called for all three methods.

---

### #4 — Fix PullRequestService.isMerged()
**Labels:** `bug`

`isMerged()` calls `GET /repos/:owner/:repo/pulls/:number/merge`. GitHub returns:
- `204` if merged
- `404` if not merged

Currently, `request()` throws `GithubApiError` on 404, so `isMerged()` throws instead of returning `false` for unmerged PRs. Fix with a try/catch on `GithubApiError` with status 404.

**Done when:** unit test verifies `isMerged()` returns `false` on 404 and `true` on 204.

---

### #5 — Fix RepositoryService.listByUsername()
**Labels:** `bug`

`listByUsername()` has two problems:
1. Return type is `Promise<Repository>` — should be `Promise<Repository[]>`
2. Calls `mapRepository` (single) instead of `mapRepositories` (array)

**Done when:** unit test verifies the correct array mapper is called and the return type is an array.

---

## HTTP Layer

### #6 — Add rate limiting to request.utils.ts
**Labels:** `enhancement`, `infrastructure`

Read `x-ratelimit-remaining` and `x-ratelimit-reset` headers from every GitHub response. When `x-ratelimit-remaining` hits 0, queue subsequent requests until the reset time passes rather than letting them fail with 403.

**Done when:** unit test mocks fetch returning low `x-ratelimit-remaining` and verifies requests are queued rather than sent immediately.

---

### #7 — Add retry logic to request.utils.ts
**Labels:** `enhancement`, `infrastructure`

Exponential backoff on `5xx` responses and `429 Too Many Requests`:
- 3 attempts total
- Delays: 1s → 2s → 4s
- Do not retry on `4xx` (except 429)

**Done when:** unit test mocks fetch returning 503 then 200 and verifies the request succeeds on the second attempt.

---

### #8 — Add ETag caching to request.utils.ts
**Labels:** `enhancement`, `infrastructure`

Cache `ETag` response headers per URL. On repeat `GET` requests to the same URL, send `If-None-Match: <cached-etag>`. On `304 Not Modified`, return the cached response body. 304s don't count against the rate limit.

**Done when:** unit test verifies `If-None-Match` is sent on a repeat request, and that a 304 response returns the cached data.

---

## Auth

### #9 — GitHub App auth
**Labels:** `enhancement`, `auth`

Add support for authenticating as a GitHub App using JWT + installation access tokens:
- Generate JWT from App ID + private key using `jose`
- Exchange JWT for an installation access token via `POST /app/installations/:id/access_tokens`
- Rotate token before expiry (tokens last 1 hour)
- Surface as an alternative to PAT in `GithubClientConfig`

**Done when:** a `GithubApp` auth helper can be passed to `GithubClient` and requests succeed using the installation token.

---

## New Modules

### #10 — Issues module
**Labels:** `enhancement`, `module`

Follow the four-file pattern: `issue.types.ts`, `issue.dto.ts`, `issue.mapper.ts`, `IssueService.ts`.

Minimum methods for v1:
- `list()` — list issues for the configured repo
- `get(issueNumber)` — get a single issue
- `create(params)` — create an issue
- `update(params)` — update title, body, state, labels, assignees
- `listComments(issueNumber)` — list comments on an issue
- `addComment(issueNumber, body)` — add a comment

Wire `IssueService` into `GithubClient` as `github.issues`.

**Done when:** service is exported from `index.ts` and has unit tests for each method.

---

### #11 — Releases module
**Labels:** `enhancement`, `module`

Follow the four-file pattern: `release.types.ts`, `release.dto.ts`, `release.mapper.ts`, `ReleaseService.ts`.

Minimum methods for v1:
- `list()` — list releases
- `get(releaseId)` — get a release by ID
- `getLatest()` — get the latest release
- `getByTag(tag)` — get a release by tag name
- `create(params)` — create a release
- `update(params)` — update a release
- `delete(releaseId)` — delete a release

Wire `ReleaseService` into `GithubClient` as `github.releases`.

**Done when:** service is exported from `index.ts` and has unit tests for each method.

---

### #12 — Workflows module
**Labels:** `enhancement`, `module`

Follow the four-file pattern: `workflow.types.ts`, `workflow.dto.ts`, `workflow.mapper.ts`, `WorkflowService.ts`.

Minimum methods for v1:
- `list()` — list workflows in the configured repo
- `get(workflowId)` — get a workflow
- `listRuns(workflowId)` — list runs for a workflow
- `getRun(runId)` — get a specific run
- `triggerDispatch(workflowId, params)` — trigger a `workflow_dispatch` event
- `cancelRun(runId)` — cancel a run
- `reRunFailedJobs(runId)` — re-run failed jobs

Wire `WorkflowService` into `GithubClient` as `github.workflows`.

**Done when:** service is exported from `index.ts` and has unit tests for each method.

---

## Missing Methods on Existing Modules

### #13 — PullRequestService.reviews()
**Labels:** `enhancement`

Add `reviews(pullNumber: number)` to `PullRequestService`:
- Calls `GET /repos/:owner/:repo/pulls/:number/reviews`
- Returns a typed `PullRequestReview[]`
- Add `PullRequestReview` type + DTO + mapper functions

**Done when:** method is on the service, types are exported from `index.ts`, unit test passes.

---

### #14 — PullRequestService.cycleTime()
**Labels:** `enhancement`

Add `cycleTime(pullNumber: number)` to `PullRequestService`. Critical for Lujax Hub.

Returns a `PullRequestCycleTime` object with:
- `openedAt: string` — when the PR was opened
- `mergedAt: string | null` — when it was merged (null if not merged)
- `totalMs: number | null` — total ms from open to merge
- `totalHours: number | null` — convenience in hours

Derived from data already in `PullRequest` (no extra API call needed — just calculate from `createdAt` and `mergedAt`).

**Done when:** method is on the service, types are exported from `index.ts`, unit test covers merged and unmerged cases.

---

## Testing

### #15 — Unit tests for all modules
**Labels:** `testing`

Write unit tests for every mapper function and every service method across all modules:
- Each mapper: given a raw DTO fixture, assert the mapped type fields are correct
- Each service method: mock `GithubClient.request`, assert correct path + HTTP method + body
- Error classes: correct inheritance, message format, `.status` / `.exitCode` fields
- `assertConfig`: throws `MissingConfigError` when keys are missing
- `request.utils`: mock fetch, test error throwing, header injection, rate limit/retry/ETag (once #6–#8 are done)

Coverage target: 80% minimum on `src/**/*.ts`.

**Done when:** `npm run test:coverage` reports ≥80% coverage and all tests pass.

---

### #16 — Integration tests
**Labels:** `testing`

Write integration tests that hit the real GitHub API using a `lujax-test` org with a dedicated PAT (minimal permissions).

- Controlled via env vars: `GITHUB_TEST_TOKEN`, `GITHUB_TEST_OWNER`, `GITHUB_TEST_REPO`
- Skip gracefully if env vars are absent: `const runIntegration = !!process.env.GITHUB_TEST_TOKEN`
- Never mock the API — the point is proving real responses map correctly

Cover at minimum: `pullRequests.list()`, `repositories.get()`, `users.getAuthenticated()`.

**Done when:** tests pass against the real API in CI when secrets are present.

---

## Docs & Publishing

### #17 — README with quick start and auth guide
**Labels:** `docs`

- Installation (`npm install @lujax/github-sdk`)
- Quick start example (create client, call a method)
- PAT auth guide
- GitHub App auth guide (once #9 is done)
- Links to full API reference

**Done when:** a developer unfamiliar with the SDK can get started in under 5 minutes using only the README.

---

### #18 — GitHub Actions CI + npm publish workflow
**Labels:** `infrastructure`

Two workflows:
1. **CI** (`ci.yml`) — runs on every PR into `main`: `npm run build`, `npm test`, `npm run format:check`
2. **Publish** (`publish.yml`) — runs on tag push `v*`: builds then publishes to npm using `NPM_TOKEN` secret

**Done when:** a push to `main` triggers CI; creating a `v1.0.0` tag publishes the package.

---

### #19 — JSDoc audit, examples, and CONTRIBUTING.md
**Labels:** `docs`

- Audit all public methods for complete JSDoc (`@param`, `@returns`, `@example`)
- Fill gaps (e.g. `getTopics` example in RepositoryService is empty)
- Create `examples/` with at least: basic-usage, list-prs, manage-releases
- Create `CONTRIBUTING.md` with: setup, code patterns, four-file module guide, PR process

**Done when:** no public method is missing JSDoc and `examples/` has at least 3 runnable scripts.

---

## Before Publishing

### #20 — Decide error message prefix
**Labels:** `decision`

`GithubSdkError` currently prefixes messages with `"github-sdk: ..."`. Decide before v1 whether this should change to `"@lujax/github-sdk: ..."` to match the npm package name. Update all error classes and tests if changed.

**Done when:** decision is logged in `_notes/decisions.md` and implemented consistently.

---

## Issue Summary

| # | Title | Category |
|---|-------|----------|
| 1 | Fix package.json | Foundation |
| 2 | Set up Jest + ts-jest | Foundation |
| 3 | Fix UserService path bugs | Bug Fix |
| 4 | Fix PullRequestService.isMerged() | Bug Fix |
| 5 | Fix RepositoryService.listByUsername() | Bug Fix |
| 6 | Add rate limiting | HTTP Layer |
| 7 | Add retry logic | HTTP Layer |
| 8 | Add ETag caching | HTTP Layer |
| 9 | GitHub App auth | Auth |
| 10 | Issues module | New Module |
| 11 | Releases module | New Module |
| 12 | Workflows module | New Module |
| 13 | PullRequestService.reviews() | Missing Method |
| 14 | PullRequestService.cycleTime() | Missing Method |
| 15 | Unit tests for all modules | Testing |
| 16 | Integration tests | Testing |
| 17 | README + auth guide | Docs |
| 18 | GitHub Actions CI + publish | Infra |
| 19 | JSDoc audit + examples + CONTRIBUTING.md | Docs |
| 20 | Decide error message prefix | Decision |

**20 issues. All closed = v1 published.**
