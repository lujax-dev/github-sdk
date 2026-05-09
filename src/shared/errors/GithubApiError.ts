import { GithubSdkError } from "./GithubSdkError";

export class GithubApiError extends GithubSdkError {
    public readonly status: number;
    public readonly documentationUrl?: string;
    public readonly details?: unknown

    constructor(
        status: number,
        message: string,
        documentationUrl?: string,
        details?: unknown
    ) {
        super(`GitHub API error (${status}): ${message}`);
        this.name = 'GithubApiError';
        this.status = status;
        this.documentationUrl = documentationUrl;
        this.details = details;
    }
}