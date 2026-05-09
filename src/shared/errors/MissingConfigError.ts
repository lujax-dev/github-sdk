import { GithubSdkError } from "./GithubSdkError";
import { GithubClientConfig } from "../../client/GithubClient";

type ConfigKeys = keyof GithubClientConfig;

export class MissingConfigError extends GithubSdkError {
    constructor(properties: ConfigKeys[]) {
        super(`GithubClient is missing service dependent config properties: ${properties}`);
        this.name = 'MissingConfigError';
    }
}