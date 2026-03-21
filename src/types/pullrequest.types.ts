import { UserDTO, User } from "./user.types";

export type State = 'open' | 'closed';

export interface BranchRefDTO {
    ref : string;
    sha: string;
} 

export interface PullRequestDTO {
    id: number;
    node_id: string;
    number: number;
    state: State;
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

export interface PullRequest {
    id: number;
    nodeId: string;
    number: number;
    state: State;
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