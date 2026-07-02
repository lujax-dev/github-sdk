import { GithubClient } from "../../client/GithubClient";
import {
    Issue,
    IssueComment,
    CreateIssueParams,
    UpdateIssueParams,
} from "./issue.types";
import { IssueDTO, IssueCommentDTO } from "./issue.dto";
import {
    mapCreateIssueParams,
    mapIssue,
    mapIssueComment,
    mapIssueComments,
    mapIssues,
    mapUpdateIssueParams,
} from "./issue.mapper";
import { assertConfig } from "../../shared/utils/config.utils";

export class IssueService {
    private readonly path: string;

    constructor(private readonly client: GithubClient) {
        assertConfig(this.client, ["owner", "repo"]);
        this.path = `/repos/${this.client.config.owner}/${this.client.config.repo}/issues`;
    }

    /**
     * List issues of a repository. Note: GitHub models pull requests as
     * issues, so this may include them — check `isPullRequest` on each
     * result to filter them out if needed.
     *
     * @returns Array of issues
     *
     * @example
     * ```ts
     * const issues = await github.issues.list();
     * ```
     */
    public async list(): Promise<Issue[]> {
        const response = await this.client.request<IssueDTO[]>(this.path);
        return mapIssues(response.data);
    }

    /**
     * Get details of an issue by providing its number
     *
     * @param issueNumber The number that identifies the issue
     * @returns Data of an issue
     *
     * @example
     * ```ts
     * const issue = await github.issues.get(12);
     * ```
     */
    public async get(issueNumber: number): Promise<Issue> {
        const response = await this.client.request<IssueDTO>(
            `${this.path}/${issueNumber}`,
        );
        return mapIssue(response.data);
    }

    /**
     * Create an issue
     *
     * @param params Configuration for the issue
     * @returns Data of the created issue
     *
     * @example
     * ```ts
     * github.issues.create({
     *     title: 'Bug: build fails on Node 22',
     *     body: 'Steps to reproduce...',
     *     labels: ['bug'],
     * });
     * ```
     */
    public async create(params: CreateIssueParams): Promise<Issue> {
        const body = mapCreateIssueParams(params);
        const response = await this.client.request<IssueDTO>(this.path, {
            method: "POST",
            body: JSON.stringify(body),
        });
        return mapIssue(response.data);
    }

    /**
     * Update an issue
     *
     * @param params Configuration for the issue to update
     * @returns Data of the updated issue
     *
     * @example
     * ```ts
     * github.issues.update({
     *     issueNumber: 12,
     *     state: 'closed',
     *     stateReason: 'completed',
     * });
     * ```
     */
    public async update(params: UpdateIssueParams): Promise<Issue> {
        const body = mapUpdateIssueParams(params);
        const response = await this.client.request<IssueDTO>(
            `${this.path}/${params.issueNumber}`,
            {
                method: "PATCH",
                body: JSON.stringify(body),
            },
        );
        return mapIssue(response.data);
    }

    /**
     * List comments on an issue
     *
     * @param issueNumber The number that identifies the issue
     * @returns Array of issue comments
     *
     * @example
     * ```ts
     * const comments = await github.issues.listComments(12);
     * ```
     */
    public async listComments(issueNumber: number): Promise<IssueComment[]> {
        const response = await this.client.request<IssueCommentDTO[]>(
            `${this.path}/${issueNumber}/comments`,
        );
        return mapIssueComments(response.data);
    }

    /**
     * Add a comment to an issue
     *
     * @param issueNumber The number that identifies the issue
     * @param body The comment text
     * @returns Data of the created comment
     *
     * @example
     * ```ts
     * github.issues.addComment(12, 'Thanks for the report!');
     * ```
     */
    public async addComment(
        issueNumber: number,
        body: string,
    ): Promise<IssueComment> {
        const response = await this.client.request<IssueCommentDTO>(
            `${this.path}/${issueNumber}/comments`,
            {
                method: "POST",
                body: JSON.stringify({ body }),
            },
        );
        return mapIssueComment(response.data);
    }
}
