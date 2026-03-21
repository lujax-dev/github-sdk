import { PullRequestService } from "../services/pullrequest.service";
import { request } from "../utils/request.utils";

interface GithubClientConfig {
    token: string,
    owner?: string, 
    repo?: string
}

export class GithubClient {
    public readonly pullRequests: PullRequestService;
    public readonly baseUrl: string;

    constructor(public readonly config: GithubClientConfig) {
        this.pullRequests = new PullRequestService(this);
        this.baseUrl = 'https://api.github.com';
    }

    public request<T>(path: string, options?: RequestInit): Promise<T> {
        return request<T>(this.baseUrl, path, options, this.config.token)
    }
}