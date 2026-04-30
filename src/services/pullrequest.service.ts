import { GithubClient } from "../client/GithubClient";
import { Commit, CommitDTO } from "../types/commit.types";
import {
    CreatePullRequestParams,
    MergePullRequestParams,
    PullRequest,
    PullRequestDTO, 
    PullRequestFile, 
    PullRequestFileDTO,
    UpdatePullRequestParams,
    MergePullRequestResponse,
    UpdatePullRequestBranchResponse
} from "../types/pullrequest.types";
import { 
    mapCreatePullRequestParams,
    mapMergePullRequestParams,
    mapPullRequest, 
    mapPullRequestFiles, 
    mapPullRequests, 
    mapUpdatePullRequestParams,
} from "../mappers/pullrequest.mapper";
import { mapCommits } from "../mappers/commit.mapper";
import { assertConfig } from "../utils/config.utils";

export class PullRequestService {
    private readonly path: string;

    constructor(private readonly client: GithubClient) {
        assertConfig(this.client, ['owner', 'repo']);
        this.path = `/repos/${this.client.config.owner}/${this.client.config.repo}/pulls`;
    }

    /**
     * List pull requests of a repository
     *  
     * @returns Array of pull requests 
     * 
     * @example
     * ```ts 
     * const pullRequests = await github.pullRequests.list();
     * ```
     */
    public async list(): Promise<PullRequest[]> {
        const response = await this.client.request<PullRequestDTO[]>(this.path);
        return mapPullRequests(response.data)
    }

    /**
     * Create a pull request
     * 
     * @param params Configuration for the pull request
     * @returns Data of the created pull request
     *       
     * @example 
     * ```ts
     * await github.pullRequests.create({
     *     title: 'Cool new feature',
     *     body: 'This feature is very helpful and needs pulling',
     *     head: 'LewieJ08:dev',
     *     base: 'main' 
     * });
     * ```
     */
    public async create(params: CreatePullRequestParams): Promise<PullRequest> {
        const body = mapCreatePullRequestParams(params);
        const response = await this.client.request<PullRequestDTO>(this.path, {
            method: 'POST',
            body: JSON.stringify(body)
        });
        return mapPullRequest(response.data);
    }

    /**
     * List details of a pull request by providing its number
     * 
     * @param pullNumber The number that identifies the pull request
     * @returns Data of a pull request
     * 
     * @example
     * ```ts
     * const pullRequest = await github.pullRequests.get(8);
     * ```
     */
    public async get(pullNumber: number): Promise<PullRequest> {
        const response = await this.client.request<PullRequestDTO>(`${this.path}/${pullNumber}`);
        return mapPullRequest(response.data);
    }

    /**
     * Update a pull request 
     * 
     * @param params Configuration for the pull request to update
     * @returns Data of the updated pull request
     * 
     * @example
     * ```ts
     * await github.pullRequests.update({
     *     pullNumber: 8,
     *     title: 'new title',
     *     body: 'updated body',
     *     state: 'open'
     *     base: 'main'
     * });
     * ```
     */
    public async update(params: UpdatePullRequestParams): Promise<PullRequest> {
        const body = mapUpdatePullRequestParams(params)
        const response = await this.client.request<PullRequestDTO>(`${this.path}/${params.pullNumber}`, {
            method: 'PATCH',
            body: JSON.stringify(body)
        });
        return mapPullRequest(response.data);
    } 
    
    /**
     * List commits on a pull request
     * 
     * @param pullNumber The number that identifies the pull request
     * @returns Array of commits 
     * 
     * @example 
     * ```ts 
     * const commits = await github.pullRequests.listCommits(8);
     * ```
     */
    public async listCommits(pullNumber: number): Promise<Commit[]> {
        const response = await this.client.request<CommitDTO[]>(`${this.path}/${pullNumber}/commits`);
        return mapCommits(response.data);
    }

    /**
     * List the files in a specified pull request
     * 
     * @param pullNumber The number that identifies the pull request
     * @returns Array of pull request files 
     * 
     * @example 
     * ```ts 
     * const pullRequestFiles = await github.pullRequests.listFiles(8);
     * ```
     */
    public async listFiles(pullNumber: number): Promise<PullRequestFile[]> {
        const response = await this.client.request<PullRequestFileDTO[]>(`${this.path}/${pullNumber}/files`);
        return mapPullRequestFiles(response.data)
    }
 
    /**
     * Check if a pull request has been merged
     * 
     * @param pullNumber The number that identifies the pull request
     * @returns boolean value that determines if the pull request is merged
     * 
     * @example
     * ```ts 
     * const isMerged = await github.pullRequests.isMerged(8);
     * ``` 
     */
    public async isMerged(pullNumber: number): Promise<boolean> {
        const response = await this.client.request<null>(`${this.path}/${pullNumber}/merge`);

        if (response.status === 204) {
            return true;
        }

        return false
    }

    /**
     * Merge a pull request into the base branch
     * 
     * @param params Configuration for the pull request to merge
     * @returns Confirmation of merge with SHA of merge commit
     * 
     * @example
     * ```ts 
     * await github.pullRequests.merge({
     *     pullNumber: 8,
     *     commitTitle: 'Expand docs',
     *     commitMessage: 'Add docs for new methods'
     * });
     * ```
     */
    public async merge(params: MergePullRequestParams): Promise<MergePullRequestResponse> {
        const body = mapMergePullRequestParams(params);
        const response = await this.client.request<MergePullRequestResponse>(`${this.path}/${params.pullNumber}/merge`, {
            method: 'PUT',
            body: JSON.stringify(body)
        });
        return response.data;
    }

    /**
     * Updates the pull request with the latest upstream changes 
     * 
     * @param pullNumber The number that identifies the pull request
     * @param expectedHeadSha The expected SHA of the pull requests HEAD ref. 
     * This is the most recent commit of the pull request's branch
     * @returns Message and URL of pull request
     *  
     * @example 
     * ```ts  
     * await github.pullRequests.updateBranch(8, 6dcb09b5b57875f334f61aebed695e2e4193db5e)
     * ```
     */
    public async updateBranch(pullNumber: number, expectedHeadSha?: string): Promise<UpdatePullRequestBranchResponse> {
        const response = await this.client.request<UpdatePullRequestBranchResponse>(`${this.path}/${pullNumber}/update-branch`, {
            method: 'PUT',
            body: JSON.stringify({
                expected_head_sha: expectedHeadSha
            })
        });
        return response.data;
    }
}
