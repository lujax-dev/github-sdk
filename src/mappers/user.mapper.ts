import { 
    UpdateUserParams, 
    UpdateUserPayload, 
    User, 
    UserDTO,
    Contributer,
    ContributerDTO
} from "../types/user.types"

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

export function mapContributer(dto: ContributerDTO): Contributer {
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
        contributions: dto.contributions
    }
}

export function mapContributers(dtos: ContributerDTO[]): Contributer[] {
    return dtos.map(dto => mapContributer(dto));
}

export function mapUpdateUserParams(params: UpdateUserParams): UpdateUserPayload {
    return {
        name: params.name,
        email: params.email,
        blog: params.blog,
        twitter_username: params.twitterUsername,
        company: params.company,
        location: params.location,
        hireable: params.hireable,
        bio: params.bio
    }
}