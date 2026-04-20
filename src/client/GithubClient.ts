import { PullRequestService } from "../services/pullrequest.service";
import { RepositoryService } from "../services/repository.service";
import { UserService } from "../services/user.service";
import { ApiResponse, request } from "../utils/request.utils";

export interface GithubClientConfig {
    token: string,
    owner?: string, 
    repo?: string,
    org?: string
}

/**
 * Client for interacting with the GitHub API 
 * @public
 */
export class GithubClient {
    public readonly pullRequests: PullRequestService;
    public readonly users: UserService;
    public readonly repositories: RepositoryService;
    public readonly baseUrl: string; 

    /**
     * @param config GithubClient configuration
     *  
     * @example
     * ```ts
     * import { GithubClient } from "github-sdk";
     * 
     * const github = new GithubClient({
     *     token: process.env.GITHUB_TOKEN,
     *     owner: 'LewieJ08',
     *     repo: 'github-sdk'
     * });
     * ```
     */
    constructor(public readonly config: GithubClientConfig) {
        this.pullRequests = new PullRequestService(this);
        this.users = new UserService(this);
        this.repositories = new RepositoryService(this);
        this.baseUrl = 'https://api.github.com';
    }

    /**
     * Send a direct http request to the GitHub API
     * @param path Following https://api.github.com
     * @param options Request options
     * @returns Value based on path
     * 
     * @example
     * ```ts 
     * github.request('/user') // Gets the authorized user
     * ``` 
     */
    public request<T>(path: string, options?: RequestInit): Promise<ApiResponse<T>> {
        return request<T>(this.baseUrl, path, options, this.config.token)
    }
}