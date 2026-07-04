import { GitHubAuth } from "../auth/GitHubAuth";
import { IssueService } from "../modules/issues/IssueService";
import { PullRequestService } from "../modules/pull-requests/PullRequestService";
import { ReleaseService } from "../modules/releases/ReleaseService";
import { RepositoryService } from "../modules/repositories/RepositoryService";
import { UserService } from "../modules/users/UserService";
import { WorkflowService } from "../modules/workflows/WorkflowService";
import { InvalidTokenError } from "../shared/errors/InvalidTokenError";
import {
    ApiResponse,
    createRequestClient,
    RequestClient,
} from "../shared/utils/request.utils";

export interface GithubClientConfig {
    /** A Personal Access Token. Ignored if `auth` is also set. */
    token?: string;
    /** A {@link GitHubAuth} strategy, e.g. `new GitHubAppAuth(...)`. Takes precedence over `token`. */
    auth?: GitHubAuth;
    owner?: string;
    repo?: string;
    org?: string;
}

/**
 * Client for interacting with the GitHub API
 *
 * @public
 */
export class GithubClient {
    public readonly pullRequests: PullRequestService;
    public readonly users: UserService;
    public readonly repositories: RepositoryService;
    public readonly issues: IssueService;
    public readonly releases: ReleaseService;
    public readonly workflows: WorkflowService;
    public readonly baseUrl: string;
    private readonly requestClient: RequestClient;

    /**
     * @param config GithubClient configuration
     *
     * @example
     * ```ts
     * import { GithubClient } from "@lujax/github-sdk";
     *
     * const github = new GithubClient({
     *     token: process.env.GITHUB_TOKEN,
     *     owner: 'lujax-dev',
     *     repo: 'github-sdk'
     * });
     * ```
     *
     * @example Authenticating as a GitHub App instead of a PAT
     * ```ts
     * import { GithubClient, GitHubAppAuth } from "@lujax/github-sdk";
     *
     * const github = new GithubClient({
     *     auth: new GitHubAppAuth({
     *         appId: process.env.GITHUB_APP_ID,
     *         privateKey: process.env.GITHUB_APP_PRIVATE_KEY,
     *         installationId: process.env.GITHUB_APP_INSTALLATION_ID,
     *     }),
     *     owner: 'lujax-dev',
     *     repo: 'github-sdk'
     * });
     * ```
     */
    constructor(public readonly config: GithubClientConfig) {
        this.baseUrl = "https://api.github.com";
        const auth = config.auth ?? config.token;
        if (!auth) {
            throw new InvalidTokenError();
        }
        this.requestClient = createRequestClient(this.baseUrl, auth);
        this.pullRequests = new PullRequestService(this);
        this.users = new UserService(this);
        this.repositories = new RepositoryService(this);
        this.issues = new IssueService(this);
        this.releases = new ReleaseService(this);
        this.workflows = new WorkflowService(this);
    }

    /**
     * Send a direct http request to the GitHub API
     *
     * @param path Following https://api.github.com
     * @param options Request options
     * @returns Value based on path
     *
     * @example
     * ```ts
     * github.request('/user') // Gets the authorized user
     * ```
     */
    public request<T>(
        path: string,
        options?: RequestInit,
    ): Promise<ApiResponse<T>> {
        return this.requestClient<T>(path, options);
    }
}
