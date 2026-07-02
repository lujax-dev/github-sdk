import { GithubClient } from "../../client/GithubClient";
import {
    Release,
    CreateReleaseParams,
    UpdateReleaseParams,
} from "./release.types";
import { ReleaseDTO } from "./release.dto";
import {
    mapCreateReleaseParams,
    mapRelease,
    mapReleases,
    mapUpdateReleaseParams,
} from "./release.mapper";
import { assertConfig } from "../../shared/utils/config.utils";

export class ReleaseService {
    private readonly path: string;

    constructor(private readonly client: GithubClient) {
        assertConfig(this.client, ["owner", "repo"]);
        this.path = `/repos/${this.client.config.owner}/${this.client.config.repo}/releases`;
    }

    /**
     * List releases of a repository
     *
     * @returns Array of releases
     *
     * @example
     * ```ts
     * const releases = await github.releases.list();
     * ```
     */
    public async list(): Promise<Release[]> {
        const response = await this.client.request<ReleaseDTO[]>(this.path);
        return mapReleases(response.data);
    }

    /**
     * Get a release by its ID
     *
     * @param releaseId The ID that identifies the release
     * @returns Data of a release
     *
     * @example
     * ```ts
     * const release = await github.releases.get(12345);
     * ```
     */
    public async get(releaseId: number): Promise<Release> {
        const response = await this.client.request<ReleaseDTO>(
            `${this.path}/${releaseId}`,
        );
        return mapRelease(response.data);
    }

    /**
     * Get the latest published release, ignoring drafts and prereleases
     *
     * @returns Data of the latest release
     *
     * @example
     * ```ts
     * const latest = await github.releases.getLatest();
     * ```
     */
    public async getLatest(): Promise<Release> {
        const response = await this.client.request<ReleaseDTO>(
            `${this.path}/latest`,
        );
        return mapRelease(response.data);
    }

    /**
     * Get a release by its tag name
     *
     * @param tag The tag name that identifies the release
     * @returns Data of a release
     *
     * @example
     * ```ts
     * const release = await github.releases.getByTag('v1.0.0');
     * ```
     */
    public async getByTag(tag: string): Promise<Release> {
        const response = await this.client.request<ReleaseDTO>(
            `${this.path}/tags/${tag}`,
        );
        return mapRelease(response.data);
    }

    /**
     * Create a release
     *
     * @param params Configuration for the release
     * @returns Data of the created release
     *
     * @example
     * ```ts
     * github.releases.create({
     *     tagName: 'v1.0.0',
     *     name: 'v1.0.0',
     *     body: 'Initial release',
     * });
     * ```
     */
    public async create(params: CreateReleaseParams): Promise<Release> {
        const body = mapCreateReleaseParams(params);
        const response = await this.client.request<ReleaseDTO>(this.path, {
            method: "POST",
            body: JSON.stringify(body),
        });
        return mapRelease(response.data);
    }

    /**
     * Update a release
     *
     * @param params Configuration for the release to update
     * @returns Data of the updated release
     *
     * @example
     * ```ts
     * github.releases.update({
     *     releaseId: 12345,
     *     body: 'Updated release notes',
     * });
     * ```
     */
    public async update(params: UpdateReleaseParams): Promise<Release> {
        const body = mapUpdateReleaseParams(params);
        const response = await this.client.request<ReleaseDTO>(
            `${this.path}/${params.releaseId}`,
            {
                method: "PATCH",
                body: JSON.stringify(body),
            },
        );
        return mapRelease(response.data);
    }

    /**
     * Delete a release
     *
     * @param releaseId The ID that identifies the release
     *
     * @example
     * ```ts
     * await github.releases.delete(12345);
     * ```
     */
    public async delete(releaseId: number): Promise<void> {
        await this.client.request<null>(`${this.path}/${releaseId}`, {
            method: "DELETE",
        });
    }
}
