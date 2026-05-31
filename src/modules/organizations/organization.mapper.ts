import { OrganizationDto, SimpleOrganizationDto } from "./organization.dto";
import { Organization, SimpleOrganization } from "./organization.types";

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
