import { RepositoryDTO, Repository, CreateRepositoryParams, CreateRepositoryPayload, UpdateRepositoryParams, UpdateRepositoryPayload } from "../types/repository.types";
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

export function mapCreateRepositoryParams(params: CreateRepositoryParams): CreateRepositoryPayload {
    return {
        name: params.name,
        description: params.description,
        homepage: params.homepage,
        private: params.privateRepo,
        visibility: params.visibility,
        has_issues: params.hasIssues,
        has_projects: params.hasProjects,
        has_wiki: params.hasWiki,
        has_downloads: params.hasDownloads,
        is_template: params.isTemplate,
        team_id: params.teamId,
        auto_init: params.autoInit,
        gitignore_template: params.gitignoreTemplate,
        license_template: params.licenseTemplate,
        allow_squash_merge: params.allowSquashMerge,
        allow_merge_commit: params.allowMergeCommit,
        allow_rebase_merge: params.allowRebaseMerge,
        allow_auto_merge: params.allowAutoMerge,
        delete_branch_on_merge: params.deleteBranchOnMerge,
        squash_merge_commit_title: params.squashMergeCommitTitle,
        squash_merge_commit_message: params.squashMergeCommitMessage,
        merge_commit_title: params.mergeCommitTitle,
        merge_commit_message: params.mergeCommitMessage,
    }
}

export function mapUpdateRepositoryParams(params: UpdateRepositoryParams): UpdateRepositoryPayload {
    return {
        name: params.name,
        description: params.description,
        homepage: params.homepage,
        private: params.privateRepo,
        visibility: params.visibility,
        has_issues: params.hasIssues,
        has_projects: params.hasProjects,
        has_wiki: params.hasWiki,
        has_downloads: params.hasDownloads,
        is_template: params.isTemplate,
        auto_init: params.autoInit,
        gitignore_template: params.gitignoreTemplate,
        license_template: params.licenseTemplate,
        allow_squash_merge: params.allowSquashMerge,
        allow_merge_commit: params.allowMergeCommit,
        allow_rebase_merge: params.allowRebaseMerge,
        allow_auto_merge: params.allowAutoMerge,
        delete_branch_on_merge: params.deleteBranchOnMerge,
        squash_merge_commit_title: params.squashMergeCommitTitle,
        squash_merge_commit_message: params.squashMergeCommitMessage,
        merge_commit_title: params.mergeCommitTitle,
        merge_commit_message: params.mergeCommitMessage,
        default_branch: params.defaultBranch,
        archived: params.archived,
        allow_forking: params.allowForking,
    }
}