import {
    OrganizationDto,
    SimpleOrganizationDto,
    OrgMembershipDto,
} from "./organization.dto";
import {
    Organization,
    SimpleOrganization,
    UpdateOrganizationParams,
    UpdateOrganizationPayload,
    OrgMembership,
    UpdateOrgMembershipParams,
    UpdateOrgMembershipPayload,
} from "./organization.types";
import { mapUser } from "../users/user.mapper";

export function mapSimpleOrganization(
    dto: SimpleOrganizationDto,
): SimpleOrganization {
    return {
        id: dto.id,
        login: dto.login,
        avatarUrl: dto.avatar_url,
        description: dto.description,
        url: dto.url,
    };
}

export function mapOrganization(dto: OrganizationDto): Organization {
    return {
        id: dto.id,
        login: dto.login,
        nodeId: dto.node_id,
        avatarUrl: dto.avatar_url,
        description: dto.description,
        url: dto.url,
        name: dto.name,
        company: dto.company,
        blog: dto.blog,
        location: dto.location,
        email: dto.email,
        twitterUsername: dto.twitter_username,
        isVerified: dto.is_verified,
        publicRepos: dto.public_repos,
        publicGists: dto.public_gists,
        followers: dto.followers,
        following: dto.following,
        htmlUrl: dto.html_url,
        createdAt: dto.created_at,
        updatedAt: dto.updated_at,
        archivedAt: dto.archived_at,
    };
}

export function mapSimpleOrganizations(
    dtos: SimpleOrganizationDto[],
): SimpleOrganization[] {
    return dtos.map(mapSimpleOrganization);
}

export function mapUpdateOrganizationParams(
    params: UpdateOrganizationParams,
): UpdateOrganizationPayload {
    return {
        billing_email: params.billingEmail,
        company: params.company,
        email: params.email,
        twitter_username: params.twitterUsername,
        location: params.location,
        name: params.name,
        description: params.description,
        blog: params.blog,
        has_organization_projects: params.hasOrganizationProjects,
        has_repository_projects: params.hasRepositoryProjects,
        default_repository_permission: params.defaultRepositoryPermission,
        members_can_create_repositories: params.membersCanCreateRepositories,
    };
}

export function mapOrgMembership(dto: OrgMembershipDto): OrgMembership {
    return {
        url: dto.url,
        state: dto.state,
        role: dto.role,
        organizationUrl: dto.organization_url,
        organization: mapSimpleOrganization(dto.organization),
        user: mapUser(dto.user),
    };
}

export function mapUpdateOrgMembershipParams(
    params: UpdateOrgMembershipParams,
): UpdateOrgMembershipPayload {
    return {
        role: params.role,
    };
}
