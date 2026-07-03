import { GitHubAuth } from "./GitHubAuth";

/**
 * Wraps a static Personal Access Token as a {@link GitHubAuth} strategy.
 *
 * @example
 * ```ts
 * const github = new GithubClient({ auth: new PatAuth(process.env.GITHUB_TOKEN) });
 * ```
 */
export class PatAuth implements GitHubAuth {
    constructor(private readonly token: string) {}

    async getToken(): Promise<string> {
        return this.token;
    }
}
