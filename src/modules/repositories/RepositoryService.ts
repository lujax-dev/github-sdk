import { GithubClient } from "../../client/GithubClient";
import {
    mapCreateRepositoryFromTemplateParams,
    mapCreateRepositoryParams,
    mapImmutableReleasesStatus,
    mapRepositories,
    mapRepository,
    mapRepositoryActivities,
    mapRepositoryTags,
    mapTeams,
    mapTransferRepositoryParams,
    mapUpdateRepositoryParams,
} from "./repository.mapper";
import { mapContributers } from "../users/user.mapper";
import {
    Repository,
    CreateRepositoryParams,
    UpdateRepositoryParams,
    RepositoryActivity,
    DependabotSecurityUpdatesStatus,
    CodeownersError,
    CodeownersErrorsResponse,
    ImmutableReleasesStatus,
    RepositoryLanguages,
    Status,
    RepositoryTag,
    Team,
    RepositoryTopicsResponse,
    TransferRepositoryParams,
    CreateRepositoryFromTemplateParams,
} from "./repository.types";
import {
    RepositoryDTO,
    RepositoryActivityDTO,
    ImmutableReleasesStatusDTO,
    RepositoryTagDTO,
    TeamDTO,
} from "./repository.dto";
import { Contributer } from "../users/user.types";
import { ContributerDTO } from "../users/user.dto";
import { assertConfig } from "../../shared/utils/config.utils";

export class RepositoryService {
    private readonly path: string;
    private readonly orgPath: string;
    private readonly authPath: string;

    constructor(private readonly client: GithubClient) {
        this.path = `/repos/${client.config.owner}/${client.config.repo}`;
        this.orgPath = `/orgs/${client.config.org}/repos`;
        this.authPath = "/user/repos";
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
        assertConfig(this.client, ["org"]);
        const response = await this.client.request<RepositoryDTO[]>(
            this.orgPath,
        );
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
    public async createForOrg(
        params: CreateRepositoryParams,
    ): Promise<Repository> {
        assertConfig(this.client, ["org"]);
        const body = mapCreateRepositoryParams(params);
        const response = await this.client.request<RepositoryDTO>(
            this.orgPath,
            {
                method: "POST",
                body: JSON.stringify(body),
            },
        );
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
        assertConfig(this.client, ["owner", "repo"]);
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
        assertConfig(this.client, ["owner", "repo"]);
        const body = mapUpdateRepositoryParams(params);
        const response = await this.client.request<RepositoryDTO>(this.path, {
            method: "PATCH",
            body: JSON.stringify(body),
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
        assertConfig(this.client, ["owner", "repo"]);
        const response = await this.client.request<null>(this.path, {
            method: "DELETE",
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
        assertConfig(this.client, ["owner", "repo"]);
        const response = await this.client.request<RepositoryActivityDTO[]>(
            `${this.path}/activity`,
        );
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
        assertConfig(this.client, ["owner", "repo"]);
        const response =
            await this.client.request<DependabotSecurityUpdatesStatus>(
                `${this.path}/automated-security-fixes`,
            );
        return response.data;
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
        assertConfig(this.client, ["owner", "repo"]);
        const response = await this.client.request<null>(
            `${this.path}/automated-security-fixes`,
            {
                method: "PUT",
            },
        );
        return response.status === 204;
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
        assertConfig(this.client, ["owner", "repo"]);
        const response = await this.client.request<null>(
            `${this.path}/automated-security-fixes`,
            {
                method: "DELETE",
            },
        );
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
        assertConfig(this.client, ["owner", "repo"]);
        const response = await this.client.request<CodeownersErrorsResponse>(
            `${this.path}/codeowners/errors`,
        );
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
        assertConfig(this.client, ["owner", "repo"]);
        const response = await this.client.request<ContributerDTO[]>(
            `${this.path}/contributors`,
        );
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
        assertConfig(this.client, ["owner", "repo"]);
        const response = await this.client.request<null>(
            `${this.path}/dispatches`,
            {
                method: "POST",
                body: JSON.stringify({ event_type: eventType }),
            },
        );
        return response.status === 204;
    }

    /**
     * Check if immutable releases are enabled for the configured repository
     *
     * @returns The current immutable releases status
     *
     * @example
     * ```ts
     * const immutableReleasesStatus = await github.repositories.getImmutableReleasesStatus();
     * ```
     */
    public async getImmutableReleasesStatus(): Promise<ImmutableReleasesStatus> {
        assertConfig(this.client, ["owner", "repo"]);
        const response = await this.client.request<ImmutableReleasesStatusDTO>(
            `${this.path}/immutable-releases`,
        );
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
        assertConfig(this.client, ["owner", "repo"]);
        const response = await this.client.request<null>(
            `${this.path}/immutable-releases`,
            {
                method: "PUT",
            },
        );
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
        assertConfig(this.client, ["owner", "repo"]);
        const response = await this.client.request<null>(
            `${this.path}/immutable-releases`,
            {
                method: "DELETE",
            },
        );
        return response.status === 204;
    }

    /**
     * List languages for the configured repository
     *
     * @returns Object containing all languages
     *
     * @example
     * ```ts
     * const languages = await github.repositories.listLanguages();
     * ```
     */
    public async listLanguages(): Promise<RepositoryLanguages> {
        assertConfig(this.client, ["owner", "repo"]);
        const response = await this.client.request<RepositoryLanguages>(
            `${this.path}/languages`,
        );
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
        assertConfig(this.client, ["owner", "repo"]);
        const response = await this.client.request<Status>(
            `${this.path}/private-vulnerability-reporting`,
        );
        return response.data.enabled === true;
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
        assertConfig(this.client, ["owner", "repo"]);
        const response = await this.client.request<null>(
            `${this.path}/private-vulnerability-reporting`,
            {
                method: "PUT",
            },
        );
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
        assertConfig(this.client, ["owner", "repo"]);
        const response = await this.client.request(
            `${this.path}/private-vulnerability-reporting`,
            {
                method: "DELETE",
            },
        );
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
        assertConfig(this.client, ["owner", "repo"]);
        const response = await this.client.request<RepositoryTagDTO[]>(
            `${this.path}/tags`,
        );
        return mapRepositoryTags(response.data);
    }

    /**
     * List all teams with access to the configured repository
     *
     * @returns Array of teams
     *
     * @example
     * ```ts
     * const teams = await github.repositories.listTeams();
     * ```
     */
    public async listTeams(): Promise<Team[]> {
        assertConfig(this.client, ["owner", "repo"]);
        const response = await this.client.request<TeamDTO[]>(
            `${this.path}/teams`,
        );
        return mapTeams(response.data);
    }

    /**
     * Get all topics of the configured repository
     *
     * @returns Array of topics
     *
     * @example
     * ```ts
     * const topics = await github.repositories.
     * ```
     */
    public async getTopics(): Promise<string[]> {
        assertConfig(this.client, ["owner", "repo"]);
        const response = await this.client.request<RepositoryTopicsResponse>(
            `${this.path}/topics`,
        );
        return response.data.names;
    }

    /**
     * Replace all topics of the configured repository
     *
     * @param topics An array of topics to add to the repository.
     * An empty array will clear all topics
     * @returns Array of new topics
     *
     * @example
     * ```ts
     * github.repositories.replaceTopics(['api', 'github']);
     * ```
     */
    public async replaceTopics(topics: string[]): Promise<string[]> {
        assertConfig(this.client, ["owner", "repo"]);
        const response = await this.client.request<RepositoryTopicsResponse>(
            `${this.path}/topics`,
            {
                method: "PUT",
                body: JSON.stringify({ names: topics }),
            },
        );
        return response.data.names;
    }

    /**
     * Transfer the configured repository to a new owner
     *
     * @param params Repository transfer options
     * @returns Data of the transfered repository
     *
     * @example
     * ```ts
     * github.repositories.transfer({
     *     newOwner: 'Bob123'
     * });
     * ```
     */
    public async transfer(
        params: TransferRepositoryParams,
    ): Promise<Repository> {
        assertConfig(this.client, ["owner", "repo"]);
        const body = mapTransferRepositoryParams(params);
        const response = await this.client.request<RepositoryDTO>(
            `${this.path}/transfer`,
            {
                method: "POST",
                body: JSON.stringify(body),
            },
        );
        return mapRepository(response.data);
    }

    /**
     * Check if vulnerability alerts are enabled for the configured repository
     *
     * @returns Boolean value that determines if vulnerability alerts are enabled
     *
     * @example
     * ```ts
     * const vulnerabilityAlerts = await github.repositories.getVulnerabilityAlertsStatus();
     * ```
     */
    public async getVulnerabilityAlertsStatus(): Promise<boolean> {
        assertConfig(this.client, ["owner", "repo"]);
        const response = await this.client.request<null>(
            `${this.path}/vulnerability-alerts`,
        );
        return response.status === 204;
    }

    /**
     * Enable vulnerability alerts for the configured repository
     *
     * @returns Boolean value that determines if vulnerability alerts were enabled
     *
     * @example
     * ```ts
     * github.repositories.enableVulnerabilityAlerts();
     * ```
     */
    public async enableVulnerabilityAlerts() {
        assertConfig(this.client, ["owner", "repo"]);
        const response = await this.client.request<null>(
            `${this.path}/vulnerability-alerts`,
            {
                method: "PUT",
            },
        );
        return response.status === 204;
    }

    /**
     * Disable vulnerability alerts for the configured repository
     *
     * @returns Boolean that determines if vulnerability alerts were disabled
     *
     * @example
     * ```ts
     * github.repositories.disableVulnerbilityAlerts();
     * ```
     */
    public async disableVulnerbilityAlerts(): Promise<boolean> {
        assertConfig(this.client, ["owner", "repo"]);
        const response = await this.client.request(
            `${this.path}/vulnerability-alerts`,
            {
                method: "DELETE",
            },
        );
        return response.status === 204;
    }

    /**
     * Create a repository using a template
     *
     * @param params Configuration for the new repository
     * @returns Data of the new repository
     *
     * @example
     * ```ts
     * github.repositories.createFromTemplate({
     *     templateOwner: TEMPLATE_OWNER,
     *     templateRepo: TEMPLATE_REPO,
     *     owner: 'lujax-dev',
     *     options: {
     *         name: 'new-repo',
     *         description: 'new repo using template'
     *     }
     * })
     * ```
     */
    public async createFromTemplate(
        params: CreateRepositoryFromTemplateParams,
    ): Promise<Repository> {
        const body = mapCreateRepositoryFromTemplateParams(params);
        const response = await this.client.request<RepositoryDTO>(
            `/repos/${params.templateOwner}/${params.templateRepo}/generate`,
            {
                method: "POST",
                body: JSON.stringify(body),
            },
        );
        return mapRepository(response.data);
    }

    /**
     * Lists all public repositories in the order that they were created
     *
     * @returns Array of public repositories
     *
     * @example
     * ```ts
     * const repositories = await github.repositories.listPublic();
     * ```
     */
    public async listPublic(): Promise<Repository[]> {
        const response =
            await this.client.request<RepositoryDTO[]>("/repositories");
        return mapRepositories(response.data);
    }

    /**
     * List repositories for the authenticated user
     *
     * @returns List of users repositories
     *
     * @example
     * ```ts
     * const repos = await github.repositories.list();
     * ```
     */
    public async list(): Promise<Repository[]> {
        const repsonse = await this.client.request<RepositoryDTO[]>(
            this.authPath,
        );
        return mapRepositories(repsonse.data);
    }

    /**
     * Create a repository for the authenticated user
     *
     * @param params Configuration for the new repository
     * @returns Data of created repository
     *
     * @example
     * ```ts
     * github.repositories.create({
     *     name: 'new-repo',
     *     description: 'this repo is cool'
     * });
     * ```
     */
    public async create(params: CreateRepositoryParams): Promise<Repository> {
        const body = mapCreateRepositoryParams(params);
        const response = await this.client.request<RepositoryDTO>(
            this.authPath,
            {
                method: "POST",
                body: JSON.stringify(body),
            },
        );
        return mapRepository(response.data);
    }

    /**
     * List repositories for a user by their username
     *
     * @param username
     * @returns Array of repositories
     *
     * @example
     * ```ts
     * const repos = await github.repositories.listForUser('LewieJ08');
     * ```
     */
    public async listByUsername(username: string): Promise<Repository> {
        const response = await this.client.request<RepositoryDTO>(
            `/users/${username}/repos`,
        );
        return mapRepository(response.data);
    }
}
