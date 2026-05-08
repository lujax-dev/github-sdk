import { GithubClient } from "../client/GithubClient";
import { 
    mapCreateRepositoryParams,
    mapImmutableReleasesStatus,
    mapRepositories, 
    mapRepository, 
    mapRepositoryActivities, 
    mapRepositoryTags, 
    mapTeams, 
    mapUpdateRepositoryParams 
} from "../mappers/repository.mapper";
import { mapContributers} from "../mappers/user.mapper";
import { 
    Repository, 
    RepositoryDTO,
    CreateRepositoryParams, 
    UpdateRepositoryParams,
    RepositoryActivityDTO,
    RepositoryActivity,
    DependabotSecurityUpdatesStatus,
    CodeownersError,
    CodeownersErrorsResponse,
    ImmutableReleasesStatus,
    ImmutableReleasesStatusDTO,
    RepositoryLanguages,
    Status,
    RepositoryTag,
    RepositoryTagDTO,
    Team,
    TeamDTO
} from "../types/repository.types";
import { Contributer, ContributerDTO } from "../types/user.types";
import { assertConfig } from "../utils/config.utils";

export class RepositoryService {
    private readonly path: string;
    private readonly orgPath: string;

    constructor(private readonly client: GithubClient) { 
        this.path = `/repos/${client.config.owner}/${client.config.repo}`;
        this.orgPath = `/orgs/${client.config.org}/repos`;
    }

    /**
     * List repositories for the configured organisation
     * 
     * @returns Array of repositories
     * 
     * @example
     * ```ts 
     * const repository = await github.repositories.listForOrg();
     * ```
     */
    public async listForOrg(): Promise<Repository[]> {
        assertConfig(this.client, ['org']);
        const response = await this.client.request<RepositoryDTO[]>(this.orgPath);
        return mapRepositories(response.data);
    }

    /**
     * Create new repository for the configured organisation
     * 
     * @param params Configuration for the repository to create
     * @returns Data of created repository
     * 
     * @example
     * ```ts
     * await github.repositories.createForOrg({
     *     name: 'new-org-repo',
     *     description: 'this project is very cool'
     * });
     * ```
     */
    public async createForOrg(params: CreateRepositoryParams): Promise<Repository> {
        assertConfig(this.client, ['org']);
        const body = mapCreateRepositoryParams(params);
        const response =  await this.client.request<RepositoryDTO>(this.orgPath, {
            method: 'POST',
            body: JSON.stringify(body)
        });
        return mapRepository(response.data);
    }

    /**
     * Get the configured repository
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
     * Update the configured repository
     * 
     * @param params Configuration for the repository to update
     * @returns Data of the updated repository
     * 
     * @example 
     * ```ts
     * github.repositories.update({
     *     name: 'new-repo-name',
     *     description: 'this description is now better'
     * });
     * ```
     */
    public async update(params: UpdateRepositoryParams): Promise<Repository> {
        assertConfig(this.client, ['owner', 'repo']);
        const body = mapUpdateRepositoryParams(params);
        const response = await this.client.request<RepositoryDTO>(this.path, {
            method: 'PATCH',
            body: JSON.stringify(body)
        });
        return mapRepository(response.data);
    }

    /**
     * Delete the configured repository
     * 
     * @returns Boolean value that determines if repo was deleted
     * 
     * @example 
     * ```ts 
     * github.repositories.delete();
     * ```
     */
    public async delete(): Promise<boolean> {
        assertConfig(this.client, ['owner', 'repo']);
        const response = await this.client.request<null>(this.path, {
            method: 'DELETE'
        });
        return response.status === 204;
    }   
    
    /**
     * List activities of the configured repository
     * 
     * @returns Array of repository activities
     * 
     * @example 
     * ```ts
     * const activities = await github.repositories.listActivities();
     * ```
     */
    public async listActivities(): Promise<RepositoryActivity[]> {
        assertConfig(this.client, ['owner', 'repo']);
        const response = await this.client.request<RepositoryActivityDTO[]>(`${this.path}/activity`);
        return mapRepositoryActivities(response.data);
    }

    /**
     * Get the Dependabot security updates status for the configured repository
     * 
     * @returns The current Dependabot security updates status
     * 
     * @example 
     * ```ts
     * const securityUpdatesEnabled = await github.repositories.getDependabotSecurityUpdatesStatus();
     * ```
     */
    public async getDependabotSecurityUpdatesStatus(): Promise<DependabotSecurityUpdatesStatus> {
        assertConfig(this.client, ['owner', 'repo']);
        const response = await this.client.request<DependabotSecurityUpdatesStatus>(`${this.path}/automated-security-fixes`);
        return response.data
    }   
    
    /**
     * Enable Dependabot security updates for the configured repository
     * 
     * @returns Boolean value that determines if security updates were enabled
     * 
     * @example
     * ```ts
     * github.repositories.enableDependabotSecurityUpdates();
     * ```
     */
    public async enableDependabotSecurityUpdates(): Promise<boolean> {
        assertConfig(this.client, ['owner', 'repo']);
        const response = await this.client.request<null>(`${this.path}/automated-security-fixes`, {
            method: 'PUT'
        });
        return response.status === 204
    }

    /**
     * Disable Dependabot security updates for the configured repository
     * 
     * @returns Boolean value that determines if security updates were disabled
     * 
     * @example 
     * ```ts
     * github.repositories.disableDependabotSecurityUpdates();
     * ```
     */
    public async disableDependabotSecurityUpdates(): Promise<boolean> {
        assertConfig(this.client, ['owner', 'repo']);
        const response = await this.client.request<null>(`${this.path}/automated-security-fixes`, {
            method: 'DELETE'
        });
        return response.status === 204;
    }

    /**
     * List any syntax errors that are detected in the CODEOWNERS file,
     * within the configured repository
     * 
     * @returns Array of CODEOWNERS errors
     * 
     * @example
     * ```ts
     * const codeownersErrors = await github.repositories.getCodeownersErrors();
     * ```
     */
    public async getCodeownersErrors(): Promise<CodeownersError[]> {
        assertConfig(this.client, ['owner', 'repo']);
        const response = await this.client.request<CodeownersErrorsResponse>(`${this.path}/codeowners/errors`);
        return response.data.errors;
    }

    /**
     * Get all contributers of the configured repository
     * 
     * @returns Array of contributors
     * 
     * @example 
     * ```ts
     * const contributers = await github.repositories.getContributers();
     * ```
     */
    public async getContributers(): Promise<Contributer[]> {
        assertConfig(this.client, ['owner', 'repo']);
        const response = await this.client.request<ContributerDTO[]>(`${this.path}/contributors`);
        return mapContributers(response.data);
    }

    /**
     * Create a dispatch event for the configured repository
     * 
     * @param eventType A custom webhook event name. Must be 100 characters or less
     * @returns Boolean value that determines if dispatch event was created
     * 
     * @example
     * ```ts
     * github.repositories.createDispatchEvent('on-demand-test');
     * ```
     */
    public async createDispatchEvent(eventType: string): Promise<boolean> {
        assertConfig(this.client, ['owner', 'repo']);
        const response = await this.client.request<null>(`${this.path}/dispatches`, {
            method: 'POST',
            body: JSON.stringify({ event_type: eventType })
        });
        return response.status === 204;
    }

    /**
     * Check if immutable releases are enabled for the configured repository
     * 
     * @returns The current immutable releases status
     * 
     * @example 
     * ```ts
     * const immutableReleasesStatus = github.repositories.getImmutableReleasesStatus();
     * ```
     */
    public async getImmutableReleasesStatus(): Promise<ImmutableReleasesStatus> {
        assertConfig(this.client, ['owner', 'repo']);
        const response = await this.client.request<ImmutableReleasesStatusDTO>(`${this.path}/immutable-releases`);
        return mapImmutableReleasesStatus(response.data);
    }

    /**
     * Enable immutable releases for the configured
     * 
     * @returns Boolean value that determines if immutable releases were enabled
     * 
     * @example
     * ```ts
     * github.repositories.enableImmutableReleases();
     * ```
     */
    public async enableImmutableReleases(): Promise<boolean> {
        assertConfig(this.client, ['owner', 'repo']);
        const response = await this.client.request<null>(`${this.path}/immutable-releases`, {
            method: 'PUT'
        });
        return response.status === 204;
    }

    /**
     * Disable immutable releases for the configured
     * 
     * @returns Boolean value that determines if immutable releases were disabled
     * 
     * @example
     * ```ts
     * github.repositories.disableImmutableReleases();
     * ```
     */
    public async disableImmutableReleases(): Promise<boolean> {
        assertConfig(this.client, ['owner', 'repo']);
        const response = await this.client.request<null>(`${this.path}/immutable-releases`, {
            method: 'DELETE'
        });
        return response.status === 204;
    }

    /**
     * List languages for the configured repository
     * 
     * @returns Object containing all languages 
     * 
     * @example 
     * ```ts
     * const languages = github.repositories.listLanguages();
     * ```
     */
    public async listLanguages(): Promise<RepositoryLanguages> {
        assertConfig(this.client, ['owner', 'repo']);
        const response = await this.client.request<RepositoryLanguages>(`${this.path}/languages`);
        return response.data;
    }

    /**
     * Check if private vulnerability reporting is enabled
     * for the configured repository
     * 
     * @returns Boolean that determines if private vulnerability reporting is enabled
     * 
     * @example
     * ```ts
     * const privateVulnerabilityReporting = await github.repositories.getPrivateVulnerabilityReportingStatus();
     * ```
     */
    public async getPrivateVulnerabilityReportingStatus(): Promise<boolean> {
        assertConfig(this.client, ['owner', 'repo']);
        const response = await this.client.request<Status>(`${this.path}/private-vulnerability-reporting`);
        return response.data.enabled === true
    }

    /**
     * Enable private vulnerability reporting for the configured repository
     * 
     * @returns Boolean that determines if private vulnerability reporting 
     * 
     * @example 
     * ```ts
     * github.repositories.enablePrivateVulnerabilityReporting();
     * ```
     */
    public async enablePrivateVulnerabilityReporting(): Promise<boolean> {
        assertConfig(this.client, ['owner', 'repo']);
        const response = await this.client.request(`${this.path}/private-vulnerability-reporting`, {
            method: 'PUT'
        });
        return response.status === 204;
    }

    /**
     * Disable private vulnerability reporting for the configured repository
     * 
     * @returns Boolean that determines if private vulnerability reporting 
     * 
     * @example 
     * ```ts
     * github.repositories.disablePrivateVulnerabilityReporting();
     * ```
     */
    public async disablePrivateVulnerabilityReporting(): Promise<boolean> {
        assertConfig(this.client, ['owner', 'repo']);
        const response = await this.client.request(`${this.path}/private-vulnerability-reporting`, {
            method: 'DELETE'
        });
        return response.status === 204;
    }

    /**
     * List all tags of the configured repository
     * 
     * @returns Array of all repository tags
     * 
     * @example
     * ```ts 
     * const repositoryTags = await github.repositories.listTags();
     * ```
     */
    public async listTags(): Promise<RepositoryTag[]> {
        assertConfig(this.client, ['owner', 'repo']);
        const response = await this.client.request<RepositoryTagDTO[]>(`${this.path}/tags`);
        return mapRepositoryTags(response.data);
    }

    /**
     * List all teams with access to the configured repository
     * 
     * @returns Array of teams
     * 
     * @example
     * ```ts
     * const teams = github.repositories.listTeams();
     * ```
     */
    public async listTeams(): Promise<Team[]> {
        assertConfig(this.client, ['owner', 'repo']);
        const response = await this.client.request<TeamDTO[]>(`${this.path}/teams`);
        return mapTeams(response.data);
    }
}