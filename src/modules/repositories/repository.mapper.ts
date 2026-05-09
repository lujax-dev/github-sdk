import { 
    Repository,
    CreateRepositoryParams, 
    CreateRepositoryPayload, 
    UpdateRepositoryParams, 
    UpdateRepositoryPayload, 
    RepositoryActivity, 
    RepositoryActivityType,
    ImmutableReleasesStatus,
    RepositoryTag,
    Team,
    TeamParent,
    TeamPermissions
} from "./repository.types";
import { 
    RepositoryDTO,
    RepositoryActivityTypeDTO,
    RepositoryActivityDTO,
    ImmutableReleasesStatusDTO,
    RepositoryTagDTO,
    TeamPermissionsDTO,
    TeamParentDTO,
    TeamDTO
} from "./repository.dto";
import { mapUser } from "../users/user.mapper";

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

export function mapActivityType(dto: RepositoryActivityTypeDTO): RepositoryActivityType  {
    switch (dto) {
        case "push":
            return "push";
        case "force_push":
            return "forcePush";
        case "branch_deletion":
            return "branchDeletion";
        case "branch_creation":
            return "branchCreation";
        case "pr_merge":
            return "prMerge";
        case "merge_queue_merge":
            return "mergeQueueMerge";
    }
}

export function mapRepositoryActivity(dto: RepositoryActivityDTO): RepositoryActivity {
    return {
        id: dto.id,
        nodeId: dto.node_id,
        before: dto.before,
        after: dto.after,
        ref: dto.ref,
        timestamp: new Date(dto.timestamp),
        activityType: mapActivityType(dto.activity_type),
        actor: dto.actor ? mapUser(dto.actor) : null,
    }
}

export function mapRepositoryActivities(dtos: RepositoryActivityDTO[]): RepositoryActivity[] {
    return dtos.map(dto => mapRepositoryActivity(dto));
}

export function mapImmutableReleasesStatus(dto: ImmutableReleasesStatusDTO): ImmutableReleasesStatus {
    return {
        enabled: dto.enabled,
        enforcedByOwner: dto.enforced_by_owner
    }
}

export function mapRepositoryTag(dto: RepositoryTagDTO): RepositoryTag {
    return {
        name: dto.name,
        nodeId: dto.node_id,
        zipballUrl: dto.zipball_url,
        tarballUrl: dto.tarball_url,
        commit: dto.commit
    }
}

export function mapRepositoryTags(dtos: RepositoryTagDTO[]): RepositoryTag[] {
    return dtos.map(dto => mapRepositoryTag(dto));
}

export function mapTeamPermissions(dto: TeamPermissionsDTO): TeamPermissions {
    return {
        pull: dto.pull,
        triage: dto.triage,
        push: dto.push,
        maintain: dto.maintain,
        admin: dto.admin,
    };
}

export function mapTeamParent(dto: TeamParentDTO): TeamParent {
    return {
        id: dto.id,
        nodeId: dto.node_id,
        url: dto.url,
        membersUrl: dto.members_url,
        name: dto.name,
        description: dto.description,
        permission: dto.permission,
        privacy: dto.privacy,
        notificationSetting: dto.notification_setting,
        htmlUrl: dto.html_url,
        repositoriesUrl: dto.repositories_url,
        slug: dto.slug,
        ldapDn: dto.ldap_dn,
        type: dto.type,
        organizationId: dto.organization_id,
        enterpriseId: dto.enterprise_id,
    };
}

export function mapTeam(dto: TeamDTO): Team {
    return {
        id: dto.id,
        nodeId: dto.node_id,

        name: dto.name,
        slug: dto.slug,

        description: dto.description,

        privacy: dto.privacy,
        notificationSetting: dto.notification_setting,

        permission: dto.permission,

        permissions: dto.permissions
        ? mapTeamPermissions(dto.permissions)
        : undefined,

        url: dto.url,
        htmlUrl: dto.html_url,
        membersUrl: dto.members_url,
        repositoriesUrl: dto.repositories_url,

        type: dto.type,

        organizationId: dto.organization_id,
        enterpriseId: dto.enterprise_id,

        parent: dto.parent
        ? mapTeamParent(dto.parent)
        : null,
    };
}

export function mapTeams(dtos: TeamDTO[],): Team[] {
    return dtos.map(dto => mapTeam(dto));
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