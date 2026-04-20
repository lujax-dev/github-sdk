import { GithubClient, GithubClientConfig } from "../client/GithubClient";
import { MissingConfigError } from "../errors/errors";

export function assertConfig<K extends keyof GithubClientConfig>(
    client: GithubClient,
    keys: K[]
): void {
    for (const key of keys) {
        if (!client.config[key]) {
            throw new MissingConfigError(keys)
        }
    }    
}