import { RepositoryDTO, Repository } from "../types/repository.types";
import { mapUser } from "./user.mapper";

export function mapRepository(dto: RepositoryDTO): Repository {
    return {
        id: dto.id,
        nodeId: dto.node_id,
        name: dto.name,
        fullName: dto.full_name,
        private: dto.private,
        owner: mapUser(dto.owner),
        url: dto.html_url,
        description: dto.description,
        fork: dto.fork,
        apiUrl: dto.url,
        stargazersCount: dto.stargazers_count,
        watchersCount: dto.watchers_count,
        forksCount: dto.forks_count,
        openIssuesCount: dto.open_issues_count,
        language: dto.language,
        defaultBranch: dto.default_branch,
        createdAt: dto.created_at,
        updatedAt: dto.updated_at,
        pushedAt: dto.pushed_at,
        size: dto.size,
        topics: dto.topics,
        visibility: dto.visibility
    }
}

export function mapRepositories(dtos: RepositoryDTO[]): Repository[] {
    return dtos.map(dto => mapRepository(dto));
}