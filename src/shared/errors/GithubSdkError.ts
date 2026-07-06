export class GithubSdkError extends Error {
    public readonly exitCode: number;

    constructor(message: string, exitCode: number = 1) {
        super(`@lujax/github-sdk: ${message}`);
        this.exitCode = exitCode;
        this.name = "GithubSdkError";
    }
}
