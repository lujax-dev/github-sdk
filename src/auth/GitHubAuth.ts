/**
 * Shared interface for GitHub authentication strategies. Both {@link PatAuth}
 * and {@link GitHubAppAuth} implement this so `GithubClient` can accept
 * either without changing how requests are made.
 */
export interface GitHubAuth {
    /**
     * Resolve the current bearer token to send with a request. Implementations
     * that hold a rotating credential (e.g. a GitHub App installation token)
     * should refresh internally here rather than requiring the caller to.
     */
    getToken(): Promise<string>;
}
