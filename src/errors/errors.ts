import { GithubClientConfig } from "../client/GithubClient";

type ConfigKeys = keyof GithubClientConfig;

export class GithubSdkError extends Error {
    public readonly exitCode: number;

    constructor(message: string, exitCode: number = 1) {
        super(`github-sdk: ${message}`);
        this.exitCode = exitCode;
        this.name = 'GithubSDKError';
    }
} 

export class GithubApiError extends GithubSdkError {
    constructor(status: number, message: string) {
        super(`Github API returned ${status} ${message}`);
        this.name = 'GithubApiError';
    }
}

export class InvalidTokenError extends GithubSdkError {
    constructor() {
        super('Invalid GitHub Token');
        this.name = 'InvalidTokenError';
    }
}

export class MissingConfigError extends GithubSdkError {
    constructor(properties: ConfigKeys[]) {
        super(`GithubClient is missing service dependent config properties: ${properties}`);
        this.name = 'MissingConfigError';
    }
}