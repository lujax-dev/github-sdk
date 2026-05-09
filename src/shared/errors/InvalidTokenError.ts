import { GithubSdkError } from "./GithubSdkError";

export class InvalidTokenError extends GithubSdkError {
    constructor() {
        super('Invalid GitHub Token');
        this.name = 'InvalidTokenError';
    }
}