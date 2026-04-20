import { User, UserDTO } from "./user.types";

export type RepositoryVisibility = "public" | "private" | "internal";

export interface RepositoryDTO {
    id: number;
    node_id: string;
    name: string;
    full_name: string;
    private: boolean;
    owner: UserDTO;
    html_url: string;
    description: string | null;
    fork: boolean;
    url: string;
    stargazers_count: number;
    watchers_count: number;
    forks_count: number;
    open_issues_count: number;
    language: string | null;
    default_branch: string;
    created_at: string;
    updated_at: string;
    pushed_at: string;
    size: number;
    topics?: string[];
    visibility: RepositoryVisibility;
}

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

export interface CreateRepositoryParams {
    name: string;
    description?: string;
    homepage?: string;
    privateRepo: boolean;
    visibility?: 'public' | 'private';
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
    squashMergeCommitTitle?: 'PR_TITLE' | 'COMMIT_OR_PR_TITLE';
    squashMergeCommitMessage?: 'PR_BODY' | 'COMMIT_MESSAGES' | 'BLANK';
    mergeCommitTitle?: 'PR_TITLE' | 'COMMIT_OR_PR_TITLE';
    mergeCommitMessage?: 'PR_BODY' | 'COMMIT_MESSAGES' | 'BLANK';
}

export interface CreateRepositoryPayload {
    name: string;
    description?: string;
    homepage?: string;
    private: boolean;
    visibility?: 'public' | 'private';
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
    squash_merge_commit_title?: 'PR_TITLE' | 'COMMIT_OR_PR_TITLE';
    squash_merge_commit_message?: 'PR_BODY' | 'COMMIT_MESSAGES' | 'BLANK';
    merge_commit_title?: 'PR_TITLE' | 'COMMIT_OR_PR_TITLE';
    merge_commit_message?: 'PR_BODY' | 'COMMIT_MESSAGES' | 'BLANK';
}

export interface UpdateRepositoryParams extends Omit<CreateRepositoryParams, 'teamId'> {
    pullNumber: number;
    defaultBranch?: string;
    archived?: boolean;
    allowForking?: boolean;
}

export interface UpdateRepositoryPayload extends Omit<CreateRepositoryPayload, 'team_id'> {
    default_branch?: string;
    archived?: boolean;
    allow_forking?: boolean;
}
