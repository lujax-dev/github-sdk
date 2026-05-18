import { User } from "../users/user.types";

export type RepositoryVisibility = "public" | "private" | "internal";

export type RepositoryActivityType =
    | "push"
    | "forcePush"
    | "branchDeletion"
    | "branchCreation"
    | "prMerge"
    | "mergeQueueMerge";

export interface Repository {
    id: number;
    nodeId: string;
    name: string;
    fullName: string;
    private: boolean;
    owner: User;
    url: string;
    description: string | null;
    fork: boolean;
    apiUrl: string;
    stargazersCount: number;
    watchersCount: number;
    forksCount: number;
    openIssuesCount: number;
    language: string | null;
    defaultBranch: string;
    createdAt: string;
    updatedAt: string;
    pushedAt: string;
    size: number;
    topics?: string[];
    visibility: RepositoryVisibility;
}

export interface RepositoryActivity {
    id: number;
    nodeId: string;
    before: string;
    after: string;
    ref: string;
    timestamp: Date;
    activityType: RepositoryActivityType;
    actor: User | null;
}

export interface Status {
    enabled: boolean;
}

export interface DependabotSecurityUpdatesStatus extends Status {
    paused: boolean;
}

export interface ImmutableReleasesStatus extends Status {
    enforcedByOwner: boolean;
}

export interface CodeownersError {
    line: number;
    column: number;
    kind: string;
    message: string;
    path: string;
    source?: string;
    suggestion?: string | null;
}

export interface CodeownersErrorsResponse {
    errors: CodeownersError[];
}

export interface RepositoryLanguages {
    [language: string]: number;
}

export interface RepositoryTagCommit {
    sha: string;
    url: string;
}

export interface RepositoryTag {
    name: string;
    nodeId: string;
    zipballUrl: string;
    tarballUrl: string;
    commit: RepositoryTagCommit;
}

export interface TeamPermissions {
    pull: boolean;
    triage: boolean;
    push: boolean;
    maintain: boolean;
    admin: boolean;
}

export interface TeamParent {
    id: number;
    nodeId: string;
    url: string;
    membersUrl: string;
    name: string;
    description: string | null;
    permission: string;
    privacy?: string;
    notificationSetting?: string;
    htmlUrl: string;
    repositoriesUrl: string;
    slug: string;
    ldapDn?: string;
    type: "enterprise" | "organization";
    organizationId?: number;
    enterpriseId?: number;
}

export interface Team {
    id: number;
    nodeId: string;
    name: string;
    slug: string;
    description: string | null;
    privacy?: string;
    notificationSetting?: string;
    permission: string;
    permissions?: TeamPermissions;
    url: string;
    htmlUrl: string;
    membersUrl: string;
    repositoriesUrl: string;
    type: "enterprise" | "organization";
    organizationId?: number;
    enterpriseId?: number;
    parent: TeamParent | null;
}

export interface RepositoryTopicsResponse {
    names: string[];
}

export interface CreateRepositoryParams {
    name: string;
    description?: string;
    homepage?: string;
    privateRepo: boolean;
    visibility?: "public" | "private";
    hasIssues?: boolean;
    hasProjects?: boolean;
    hasWiki?: boolean;
    hasDownloads?: boolean;
    isTemplate?: boolean;
    teamId?: number;
    autoInit?: boolean;
    gitignoreTemplate?: string;
    licenseTemplate?: string;
    allowSquashMerge?: boolean;
    allowMergeCommit?: boolean;
    allowRebaseMerge?: boolean;
    allowAutoMerge?: boolean;
    deleteBranchOnMerge?: boolean;
    squashMergeCommitTitle?: "PR_TITLE" | "COMMIT_OR_PR_TITLE";
    squashMergeCommitMessage?: "PR_BODY" | "COMMIT_MESSAGES" | "BLANK";
    mergeCommitTitle?: "PR_TITLE" | "COMMIT_OR_PR_TITLE";
    mergeCommitMessage?: "PR_BODY" | "COMMIT_MESSAGES" | "BLANK";
}

export interface CreateRepositoryPayload {
    name: string;
    description?: string;
    homepage?: string;
    private: boolean;
    visibility?: "public" | "private";
    has_issues?: boolean;
    has_projects?: boolean;
    has_wiki?: boolean;
    has_downloads?: boolean;
    is_template?: boolean;
    team_id?: number;
    auto_init?: boolean;
    gitignore_template?: string;
    license_template?: string;
    allow_squash_merge?: boolean;
    allow_merge_commit?: boolean;
    allow_rebase_merge?: boolean;
    allow_auto_merge?: boolean;
    delete_branch_on_merge?: boolean;
    squash_merge_commit_title?: "PR_TITLE" | "COMMIT_OR_PR_TITLE";
    squash_merge_commit_message?: "PR_BODY" | "COMMIT_MESSAGES" | "BLANK";
    merge_commit_title?: "PR_TITLE" | "COMMIT_OR_PR_TITLE";
    merge_commit_message?: "PR_BODY" | "COMMIT_MESSAGES" | "BLANK";
}

export interface UpdateRepositoryParams extends Omit<
    CreateRepositoryParams,
    "teamId"
> {
    defaultBranch?: string;
    archived?: boolean;
    allowForking?: boolean;
}

export interface UpdateRepositoryPayload extends Omit<
    CreateRepositoryPayload,
    "team_id"
> {
    default_branch?: string;
    archived?: boolean;
    allow_forking?: boolean;
}

export interface TransferRepositoryParams {
    newOwner: string;
    newName?: string;
    teamsIds?: number[];
}

export interface TransferRepositoryPayload {
    new_owner: string;
    new_name?: string;
    team_ids?: number[];
}

export interface CreateRepositoryFromTemplateParams {
    templateOwner: string;
    templateRepo: string;
    owner?: string;
    options: {
        name: string;
        description?: string;
        includeAllBranches?: boolean;
        private?: boolean;
    };
}

export interface CreateRepositoryFromTemplatePayload {
    name: string;
    owner?: string;
    description?: string;
    include_all_branches?: boolean;
    private?: boolean;
}
