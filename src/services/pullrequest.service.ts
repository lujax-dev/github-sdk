import { GithubClient } from "../client/GithubClient";
import { MissingConfigError } from "../errors/errors";
import { Commit, CommitDTO } from "../types/commit.types";
import {
    PullRequest,
    PullRequestDTO, 
    PullRequestFile, 
    PullRequestFileDTO, 
    PullRequestState 
} from "../types/pullrequest.types";
import { 
    mapPullRequest, 
    mapPullRequestFiles, 
    mapPullRequests 
} from "../mappers/pullrequest.mapper";
import { mapCommits } from "../mappers/commit.mapper";

export class PullRequestService {
    private readonly path: string;

    constructor(private readonly client: GithubClient) {
        if (!this.client.config.owner || !this.client.config.repo) {
            throw new MissingConfigError(['owner: string', 'repo: string']) 
        }

        this.path = `/repos/${this.client.config.owner}/${this.client.config.repo}/pulls`;
    }

    public async list(): Promise<PullRequest[]> {
        const response = await this.client.request<PullRequestDTO[]>(this.path);
        return mapPullRequests(response.data)
    }

    public create(
        head: string,
        base: string,
        title?: string,
        headRepo?: string,
        body?: string,
        maintainerCanModify?: boolean,
        draft?: boolean,
        issue?: number,
    ) {
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

    public async get(pullNumber: number): Promise<PullRequest> {
        const response = await this.client.request<PullRequestDTO>(`${this.path}/${pullNumber}`);
        return mapPullRequest(response.data);
    }

    public update(
        pullNumber: number,
        title?: string,
        body?: string,
        state?: PullRequestState,
        base?: string,
        maintainerCanModify?: boolean
    ) {
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
    
    public async listCommits(pullNumber: number): Promise<Commit[]> {
        const response = await this.client.request<CommitDTO[]>(`${this.path}/${pullNumber}/commits`);
        return mapCommits(response.data);
    }

    public async listFiles(pullNumber: number): Promise<PullRequestFile[]> {
        const response = await this.client.request<PullRequestFileDTO[]>(`${this.path}/${pullNumber}/files`);
        return mapPullRequestFiles(response.data)
    }
 
    public async isMerged(pullNumber: number): Promise<boolean> {
        const response = await this.client.request<null>(`${this.path}/${pullNumber}/merge`);

        if (response.status === 204) {
            return true;
        }

        return false
    }
 }