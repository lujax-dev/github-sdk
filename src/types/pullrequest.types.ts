import { UserDTO, User } from "./user.types";

export type PullRequestState = 'open' | 'closed';
export type PullRequestFileStatus =
    | "added"
    | "removed"
    | "modified"
    | "renamed"
    | "copied"
    | "changed"
    | "unchanged";
export type PullRequestMergeMethod = 'merge' | 'squash' | 'rebase'

export interface BranchRefDTO {
    ref : string;
    sha: string;
} 

export interface PullRequestDTO {
    id: number;
    node_id: string;
    number: number;
    state: PullRequestState;
    locked: boolean;
    draft: boolean;
    title: string;
    body: string | null;
    user: UserDTO;
    html_url: string;
    url: string;
    comments: number;
    commits: number;
    additions: number;
    deletions: number;
    changed_files: number;
    created_at: string;
    updated_at: string;
    closed_at: string | null;
    merged_at: string | null;
    merged: boolean;
    head: BranchRefDTO;
    base: BranchRefDTO;
}

export interface BranchRef {
    ref: string;
    sha: string;
}

export interface PullRequestFileDTO {
    sha: string;
    filename: string;
    status: PullRequestFileStatus;
    additions: number;
    deletions: number;
    changes: number;
    blob_url: string;
    raw_url: string;
    contents_url: string;
    patch: string | null;
}

export interface PullRequest {
    id: number;
    nodeId: string;
    number: number;
    state: PullRequestState;
    isLocked: boolean;
    isDraft: boolean;
    title: string;
    body: string | null;
    user: User;
    url: string;
    apiUrl: string;
    comments: number;
    commits: number;
    additions: number;
    deletions: number;
    changedFiles: number;
    createdAt: string;
    updatedAt: string;
    closedAt: string | null;
    mergedAt: string | null;
    isMerged: boolean;
    head: BranchRef;
    base: BranchRef;
}

export interface PullRequestFile {
    sha: string;
    name: string;
    status: PullRequestFileStatus;
    additions: number;
    deletions: number;
    changes: number;
    blobUrl: string;
    rawUrl: string;
    patch: string | null;
}

export interface CreatePullRequestParams {
    head: string;
    base: string;
    title?: string;
    headRepo?: string;
    body?: string;
    maintainerCanModify?: boolean;
    draft?: boolean;
    issue?: number;
}

export interface CreatePullRequestPayload {
    head: string;
    base: string;
    title?: string;
    head_repo?: string;
    body?: string;
    maintainer_can_modify?: boolean;
    draft?: boolean;
    issue?: number;
}

export interface UpdatePullRequestParams {
    pullNumber: number,
    title?: string,
    body?: string,
    state?: PullRequestState,
    base?: string,
    maintainerCanModify?: boolean
}

export interface UpdatePullRequestPayload {
    title?: string;
    body?: string;
    state?: PullRequestState;
    base?: string;
    maintainer_can_modify?: boolean;
}

export interface MergePullRequestParams {
    pullNumber: number;
    commitTitle?: string;
    commitMessage?: string;
    sha?: string;
    mergeMethod?: PullRequestMergeMethod;
}

export interface MergePullRequestPayload {
    commit_title?: string;
    commit_message?: string;
    sha?: string;
    merge_method?: PullRequestMergeMethod;
}

export interface MergePullRequestResponse {
    sha: string;
    merged: boolean;
    message: string;
}

export interface UpdatePullRequestBranchResponse {
    message: string;
    url: string;
}