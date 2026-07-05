import { GithubClient } from "../../client/GithubClient";
import { GithubApiError } from "../../shared/errors/GithubApiError";
import { assertConfig } from "../../shared/utils/config.utils";
import {
    Organization,
    SimpleOrganization,
    UpdateOrganizationParams,
    OrgMembership,
    UpdateOrgMembershipParams,
} from "./organization.types";
import {
    OrganizationDto,
    SimpleOrganizationDto,
    OrgMembershipDto,
} from "./organization.dto";
import {
    mapOrganization,
    mapSimpleOrganizations,
    mapUpdateOrganizationParams,
    mapOrgMembership,
    mapUpdateOrgMembershipParams,
} from "./organization.mapper";
import { User } from "../users/user.types";
import { UserDTO } from "../users/user.dto";
import { mapUsers } from "../users/user.mapper";

export class OrganizationService {
    private readonly path: string;

    constructor(private readonly client: GithubClient) {
        this.path = `/orgs/${this.client.config.org}`;
    }

    /**
     * Get the configured organisation
     *
     * @returns Data of the organisation
     *
     * @example
     * ```ts
     * const org = await github.organizations.get();
     * ```
     */
    public async get(): Promise<Organization> {
        assertConfig(this.client, ["org"]);
        const response = await this.client.request<OrganizationDto>(this.path);
        return mapOrganization(response.data);
    }

    /**
     * Update the configured organisation
     *
     * @param params Configuration for the organisation to update
     * @returns Data of the updated organisation
     *
     * @example
     * ```ts
     * github.organizations.update({
     *     description: 'Developer tools, done right',
     *     email: 'hello@lujax.dev',
     * });
     * ```
     */
    public async update(
        params: UpdateOrganizationParams,
    ): Promise<Organization> {
        assertConfig(this.client, ["org"]);
        const body = mapUpdateOrganizationParams(params);
        const response = await this.client.request<OrganizationDto>(this.path, {
            method: "PATCH",
            body: JSON.stringify(body),
        });
        return mapOrganization(response.data);
    }

    /**
     * List all organisations, in the order that they were created
     *
     * @returns Array of organisations
     *
     * @example
     * ```ts
     * const organizations = await github.organizations.list();
     * ```
     */
    public async list(): Promise<SimpleOrganization[]> {
        const response =
            await this.client.request<SimpleOrganizationDto[]>(
                "/organizations",
            );
        return mapSimpleOrganizations(response.data);
    }

    /**
     * List organisations for a user by their username
     *
     * @param username The handle for the GitHub user account
     * @returns Array of organisations
     *
     * @example
     * ```ts
     * const organizations = await github.organizations.listForUser('LewieJ08');
     * ```
     */
    public async listForUser(username: string): Promise<SimpleOrganization[]> {
        const response = await this.client.request<SimpleOrganizationDto[]>(
            `/users/${username}/orgs`,
        );
        return mapSimpleOrganizations(response.data);
    }

    /**
     * List organisations for the authenticated user
     *
     * @returns Array of organisations
     *
     * @example
     * ```ts
     * const organizations = await github.organizations.listForAuthenticatedUser();
     * ```
     */
    public async listForAuthenticatedUser(): Promise<SimpleOrganization[]> {
        const response =
            await this.client.request<SimpleOrganizationDto[]>("/user/orgs");
        return mapSimpleOrganizations(response.data);
    }

    /**
     * List members of the configured organisation
     *
     * @returns Array of users
     *
     * @example
     * ```ts
     * const members = await github.organizations.listMembers();
     * ```
     */
    public async listMembers(): Promise<User[]> {
        assertConfig(this.client, ["org"]);
        const response = await this.client.request<UserDTO[]>(
            `${this.path}/members`,
        );
        return mapUsers(response.data);
    }

    /**
     * Check if a user is a member of the configured organisation
     *
     * @param username The handle for the GitHub user account
     * @returns Boolean value that determines if the user is a member
     *
     * @example
     * ```ts
     * const isMember = await github.organizations.checkMembership('LewieJ08');
     * ```
     */
    public async checkMembership(username: string): Promise<boolean> {
        assertConfig(this.client, ["org"]);
        try {
            const response = await this.client.request<null>(
                `${this.path}/members/${username}`,
            );
            return response.status === 204;
        } catch (error) {
            if (error instanceof GithubApiError && error.status === 404) {
                return false;
            }
            throw error;
        }
    }

    /**
     * Remove a member from the configured organisation
     *
     * @param username The handle for the GitHub user account
     * @returns Boolean value that determines if the member was removed
     *
     * @example
     * ```ts
     * github.organizations.removeMember('LewieJ08');
     * ```
     */
    public async removeMember(username: string): Promise<boolean> {
        assertConfig(this.client, ["org"]);
        const response = await this.client.request<null>(
            `${this.path}/members/${username}`,
            { method: "DELETE" },
        );
        return response.status === 204;
    }

    /**
     * Get organisation membership details for a user
     *
     * @param username The handle for the GitHub user account
     * @returns Data of the organisation membership
     *
     * @example
     * ```ts
     * const membership = await github.organizations.getMembershipForUser('LewieJ08');
     * ```
     */
    public async getMembershipForUser(
        username: string,
    ): Promise<OrgMembership> {
        assertConfig(this.client, ["org"]);
        const response = await this.client.request<OrgMembershipDto>(
            `${this.path}/memberships/${username}`,
        );
        return mapOrgMembership(response.data);
    }

    /**
     * Update organisation membership for a user (e.g. change their role)
     *
     * @param username The handle for the GitHub user account
     * @param params Configuration for the membership to update
     * @returns Data of the updated organisation membership
     *
     * @example
     * ```ts
     * github.organizations.updateMembershipForUser('LewieJ08', { role: 'admin' });
     * ```
     */
    public async updateMembershipForUser(
        username: string,
        params: UpdateOrgMembershipParams,
    ): Promise<OrgMembership> {
        assertConfig(this.client, ["org"]);
        const body = mapUpdateOrgMembershipParams(params);
        const response = await this.client.request<OrgMembershipDto>(
            `${this.path}/memberships/${username}`,
            {
                method: "PUT",
                body: JSON.stringify(body),
            },
        );
        return mapOrgMembership(response.data);
    }

    /**
     * Remove organisation membership for a user
     *
     * @param username The handle for the GitHub user account
     * @returns Boolean value that determines if the membership was removed
     *
     * @example
     * ```ts
     * github.organizations.removeMembershipForUser('LewieJ08');
     * ```
     */
    public async removeMembershipForUser(username: string): Promise<boolean> {
        assertConfig(this.client, ["org"]);
        const response = await this.client.request<null>(
            `${this.path}/memberships/${username}`,
            { method: "DELETE" },
        );
        return response.status === 204;
    }
}
