import { GithubClient } from "../client/GithubClient";
import { MissingConfigError } from "../errors/errors";
import { Commit, CommitDTO } from "../types/commit.types";
import {
    PullRequest,
    PullRequestDTO, 
    PullRequestFile, 
    PullRequestFileDTO, 
    PullRequestState,
    PullRequestMergeMethod
} from "../types/pullrequest.types";
import { 
    mapPullRequest, 
    mapPullRequestFiles, 
    mapPullRequests 
} from "../mappers/pullrequest.mapper";
import { mapCommits } from "../mappers/commit.mapper";

interface CreatePullRequestParams {
    head: string;
    base: string;
    title?: string;
    headRepo?: string;
    body?: string;
    maintainerCanModify?: boolean;
    draft?: boolean;
    issue?: number;
}

interface UpdatePullRequestParams {
    pullNumber: number,
    title?: string,
    body?: string,
    state?: PullRequestState,
    base?: string,
    maintainerCanModify?: boolean
}

interface MergePullRequestParams {
    pullNumber: number,
    commitTitle?: string,
    commitMessage?: string,
    sha?: string,
    mergeMethod?: PullRequestMergeMethod    
}

export class PullRequestService {
    private readonly path: string;

    constructor(private readonly client: GithubClient) {
        if (!client.config.owner || !client.config.repo) {
            throw new MissingConfigError(['owner: string', 'repo: string']) 
        }

        this.path = `/repos/${this.client.config.owner}/${this.client.config.repo}/pulls`;
    }

    /**
     * List pull requests of a repository 
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
     * @param params Create pull request params object
     * @param params.title The title of the new pull request. Required unless issue is specified
     * @param params.head The name of the branch where your changes are implemented
     * @param params.headRepo The name of the repository where the changes in the pull request were made 
     * @param params.base The name of the branch you want the changes pulled into
     * @param params.body The contents of the pull request
     * @param params.maintainerCanModify Indicates whether maintainers can modify the pull request
     * @param params.draft Indicates whether the pull request is a draft
     * @param params.issue An issue in the repository to convet to a pull request
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
    public create(params: CreatePullRequestParams) {
        const {
            title,
            head,
            base,
            headRepo,
            body,
            maintainerCanModify,
            draft,
            issue
        } = params;
        return this.client.request(this.path, {
            method: 'POST',
            body: JSON.stringify({
                title: title,
                head: head,
                head_repo: headRepo,
                base: base,
                body: body,
                maintainer_can_modify: maintainerCanModify,
                draft: draft,
                issue: issue
            })
        })
    }

    /**
     * List details of a pull request by providing its number
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
     * @param params Update pull request params object
     * @param params.pullNumber The number that identifies the pull request
     * @param params.title The title of the pull request
     * @param params.body The contents of the pull request
     * @param params.state State of this pull request. Either 'open' or 'closed'
     * @param params.base The name of the branch you want your changes pulled into
     * @param params.maintainerCanModify Indicates whether maintainers can modify the pull request
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
    public update(params: UpdatePullRequestParams) {
        const {
            pullNumber,
            title,
            body,
            state,
            base,
            maintainerCanModify
        } = params
        return this.client.request(`${this.path}/${pullNumber}`, {
            method: 'PATCH',
            body: JSON.stringify({
                title: title,
                body: body,
                state: state,
                base: base,
                maintainer_can_modify: maintainerCanModify
            })
        });
    } 
    
    /**
     * List commits on a pull request
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
     * @param params Merge pull request params object 
     * @param params.pullNumber The number that identifies the pull requests
     * @param params.commitTitle Title for the automatic commit message 
     * @param params.commitMessage Extra Detail to append the automatic commit message
     * @param params.sha SHA that pull request head must match to allow merge
     * @param params.mergeMethod The merge method to use. 'merge', 'squash' or 'rebase'
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
    public merge(params: MergePullRequestParams) {
        const {
            pullNumber,
            commitTitle,
            commitMessage,
            sha,
            mergeMethod
        } = params
        return this.client.request(`${this.path}/${pullNumber}/merge`, {
            method: 'PUT',
            body: JSON.stringify({
                commit_title: commitTitle,
                commit_message: commitMessage,
                sha: sha,
                merge_method: mergeMethod
            })
        });
    }

    /**
     * Updates the pull request with the latest upstream changes 
     * @param pullNumber The number that identifies the pull request
     * @param expectedHeadSha The expected SHA of the pull requests HEAD ref. This is the most recent commit of the pull request's branch
     *  
     * @example 
     * ```ts  
     * await github.pullRequests.updateBranch(8, 6dcb09b5b57875f334f61aebed695e2e4193db5e)
     * ```
     */
    public updateBranch(pullNumber: number, expectedHeadSha?: string) {
        return this.client.request(`${this.path}/${pullNumber}/update-branch`, {
            method: 'PUT',
            body: JSON.stringify({
                expected_head_sha: expectedHeadSha
            })
        })
    }
}
