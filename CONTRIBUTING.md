# Contributing to @lujax/github-sdk

Thanks for taking a look. This project favours small, consistent, well-tested changes over clever ones — the notes below explain the conventions so a PR doesn't need a design discussion before it can be reviewed.

By participating you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md).

## Setup

```bash
git clone https://github.com/lujax-dev/github-sdk.git
cd github-sdk
npm install
```

Useful scripts:

```bash
npm run build          # tsc -> dist/
npm test               # Jest unit + integration tests
npm run test:coverage  # coverage report
npm run format          # prettier --write
npm run format:check    # prettier --check (what CI runs)
```

Integration tests hit the real GitHub API and are skipped automatically unless `GITHUB_TEST_TOKEN`, `GITHUB_TEST_OWNER`, and `GITHUB_TEST_REPO` are set (see `.env.example`). You don't need these to work on unit tests, mappers, or docs.

## The four-file module pattern

Every domain module under `src/modules/<name>/` follows the same four files:

| File               | Purpose                                                                      |
| ------------------ | ---------------------------------------------------------------------------- |
| `<name>.types.ts`  | Clean, camelCase TypeScript interfaces exposed to consumers                  |
| `<name>.dto.ts`    | Raw GitHub API response shapes — snake_case, mirrors the JSON exactly        |
| `<name>.mapper.ts` | Pure functions mapping DTO → type (and, for mutations, `Params` → `Payload`) |
| `<Name>Service.ts` | Public service class with JSDoc'd methods, wired into `GithubClient`         |

For mutating endpoints (POST/PATCH/PUT), `types.ts` also has a `Payload` interface for the snake_case request body, and the mapper converts the camelCase `Params` a caller passes into it. Never send a `Params` object straight to `fetch` — always go through the mapper.

Look at `src/modules/issues/` for a complete, uncomplicated example of the pattern before starting a new module.

## Conventions

- **TypeScript strict mode, no `any`.** Use `unknown` and narrow, or define a real type.
- **camelCase types, snake_case DTOs.** Don't let snake_case leak into a `.types.ts` file, and don't let camelCase leak into a `.dto.ts` file.
- **JSDoc every public method** with a one-line summary, `@param` for each parameter, `@returns`, and a runnable `@example`. Copy-paste the example and make sure it would actually compile — a broken example is worse than no example.
- **Errors, not raw responses.** All non-2xx API responses already throw `GithubApiError` via `request.utils.ts` — don't add ad-hoc error handling in a service unless you're deliberately catching a specific status (see `PullRequestService.isMerged()` for the 404-to-`false` pattern).
- **`assertConfig`** — if a service needs `owner`, `repo`, or `org`, call `assertConfig(this.client, [...])` at the top of the constructor (or the method, for methods that need a different key than the rest of the service — see `RepositoryService`'s org-scoped methods).

## Tests

Write tests alongside the code, not after it. For a new module:

- `tests/unit/modules/<name>/<name>.mapper.test.ts` — given a raw DTO fixture, assert the mapped type's fields are correct
- `tests/unit/modules/<name>/<Name>Service.test.ts` — mock `GithubClient.request`, assert the correct path, HTTP method, and body are sent

Never mock the GitHub API in `tests/integration/` — those tests exist specifically to prove the SDK works against real responses. Mock `GithubClient.request` in unit tests instead.

## Pull requests

- Work happens on `dev`; `main` only updates via a `dev` → `main` PR.
- Keep a PR scoped to one issue (or a small, genuinely coupled group). Don't bundle unrelated changes.
- Reference the issue it closes (`closes #NN`) in the PR description.
- Before opening a PR: `npm run build`, `npm test`, and `npm run format:check` should all be clean.

## Reporting bugs / requesting features

Open a GitHub issue. For a bug, include the method called, the params passed, and what you expected vs. what happened. For a feature request, a real use case helps more than a spec — this SDK grows based on what its actual consumers (the Lujax MCP server, CLI, and Hub, plus outside users) need, not speculative API surface.
