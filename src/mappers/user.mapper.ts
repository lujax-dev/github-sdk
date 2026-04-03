import { User, UserDTO } from "../types/user.types"

export function mapUser(dto: UserDTO): User {
    return {
        username: dto.login,
        id: dto.id,
        nodeId: dto.node_id,
        avatarUrl: dto.avatar_url,
        url: dto.html_url,
        apiUrl: dto.url,
        type: dto.type,
        isSiteAdmin: dto.site_admin,
        name: dto.name,
        company: dto.company,
        blog: dto.blog,
        email: dto.email,
        bio: dto.bio,
        twitterUsername: dto.twitter_username,
        publicRepos: dto.public_repos,
        publicGists: dto.public_gists,
        followers: dto.followers,
        following: dto.following,
        createdAt: dto.created_at,
        updatedAt: dto.updated_at,
    }
}

export function mapUsers(dtos: UserDTO[]): User[] {
    return dtos.map(dto => mapUser(dto));
}