import { GithubClient } from "../client/GithubClient";
import { MissingConfigError } from "../errors/errors";
import { PullRequest, PullRequestDTO, State } from "../types/pullrequest.types";
import { mapPullRequest, mapPullRequests } from "../utils/mapper.utils";

export class PullRequestService {
    private readonly path: string;

    constructor(private readonly client: GithubClient) {
        if (!this.client.config.owner || !this.client.config.repo) {
            throw new MissingConfigError(['owner: string', 'repo: string']) 
        }

        this.path = `/repos/${this.client.config.owner}/${this.client.config.repo}/pulls`;
    }

    public async list(): Promise<PullRequest[]> {
        const data = await this.client.request<PullRequestDTO[]>(this.path);
        return mapPullRequests(data)
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
        const data = await this.client.request<PullRequestDTO>(`${this.path}/${pullNumber}`);
        return mapPullRequest(data);
    }

    public update(
        pullNumber: number,
        title?: string,
        body?: string,
        state?: State,
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
}