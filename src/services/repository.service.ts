import { GithubClient } from "../client/GithubClient";
import { mapCreateRepositoryParams, mapRepository, mapUpdateRepositoryParams } from "../mappers/repository.mapper";
import { 
    Repository, 
    RepositoryDTO,
    CreateRepositoryParams, 
    UpdateRepositoryParams
} from "../types/repository.types";
import { assertConfig } from "../utils/config.utils";

export class RepositoryService {
    private readonly path: string;
    private readonly orgPath: string;

    constructor(private readonly client: GithubClient) { 
        this.path = `repos/${client.config.owner}/${client.config.repo}`;
        this.orgPath = `/orgs/${client.config.org}/repos`;
    }

    /**
     * List repositories for the specified organisation
     * 
     * @returns Data of repository
     * 
     * @example
     * ```ts 
     * const repository = await github.repositories.listOrg();
     * ```
     */
    public async listOrg(): Promise<Repository> {
        assertConfig(this.client, ['org']);
        const response = await this.client.request<RepositoryDTO>(this.orgPath);
        return mapRepository(response.data);
    }

    /**
     * Create new repository for an organisation
     * 
     * @param params Configuration for the repository to create
     * @returns Data of created repository
     * 
     * @example
     * ```ts
     * await github.repositories.createOrg({
     *     name: 'new-org-repo',
     *     description: 'this project is very cool'
     * });
     * ```
     */
    public async createOrg(params: CreateRepositoryParams): Promise<Repository> {
        assertConfig(this.client, ['org']);
        const body = mapCreateRepositoryParams(params);
        const response =  await this.client.request<RepositoryDTO>(this.orgPath, {
            method: 'POST',
            body: JSON.stringify(body)
        });
        return mapRepository(response.data);
    }

    /**
     * Get a repository
     * 
     * @returns Data of the repository
     * 
     * @example 
     * ```ts 
     * const repo = await github.repositories.get();
     * ```
     */
    public async get(): Promise<Repository> {
        assertConfig(this.client, ['owner', 'repo']);
        const response = await this.client.request<RepositoryDTO>(this.path);    
        return mapRepository(response.data);
    }

    /**
     * Update a repository
     * 
     * @param params Configuration for the repository to update
     * @returns Data of the updated repository
     * 
     * @example 
     * ```ts
     * github.repositories.update({
     *     pullNumber: 8,
     *     name: 'new-repo-name',
     *     description: 'this description is now better'
     * });
     * ```
     */
    public async update(params: UpdateRepositoryParams): Promise<Repository> {
        assertConfig(this.client, ['owner', 'repo']);
        const body = mapUpdateRepositoryParams(params);
        const response = await this.client.request<RepositoryDTO>(`${this.path}/${params.pullNumber}`, {
            method: 'PATCH',
            body: JSON.stringify(body)
        });
        return mapRepository(response.data);
    }
}