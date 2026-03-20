import { 
    BranchRef,
    BranchRefDTO,
    PullRequest, 
    PullRequestDTO 
} from "../types/pullrequest.types";
import { User, UserDTO } from "../types/user.types";

export function mapBranchRef(dto: BranchRefDTO): BranchRef {
    return {
        ref: dto.ref,
        sha: dto.sha
    }
}

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

export function mapPullRequest(dto: PullRequestDTO): PullRequest {
    return {
        id: dto.id,
        nodeId: dto.node_id,
        number: dto.number,
        state: dto.state,
        isLocked: dto.locked,
        isDraft: dto.draft,
        title: dto.title,
        body: dto.body,
        user: mapUser(dto.user),
        url: dto.html_url,
        apiUrl: dto.url,
        comments:dto.comments,
        commits:dto.commits,
        additions: dto.additions,
        deletions: dto.deletions,
        changedFiles: dto.changed_files,
        createdAt: dto.created_at,
        updatedAt: dto.updated_at,
        closedAt: dto.closed_at,
        mergedAt: dto.merged_at,
        isMerged: dto.merged,
        head: mapBranchRef(dto.head),
        base: mapBranchRef(dto.base)
    }   
}

export function mapPullRequests(dtos: PullRequestDTO[]): PullRequest[] {
    return dtos.map((dto) => mapPullRequest(dto))
}