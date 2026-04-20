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