import {
    PullRequestFileStatus,
    PullRequestReviewState,
    PullRequestState,
} from "./pull-request.types";
import { UserDTO } from "../users/user.dto";

export interface BranchRefDTO {
    ref: string;
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

export interface PullRequestReviewDTO {
    id: number;
    node_id: string;
    user: UserDTO;
    body: string;
    state: PullRequestReviewState;
    html_url: string;
    pull_request_url: string;
    submitted_at?: string;
    commit_id: string;
}
