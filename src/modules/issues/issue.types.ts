import { User } from "../users/user.types";

export type IssueState = "open" | "closed";
export type IssueStateReason = "completed" | "reopened" | "not_planned" | null;

export interface Label {
    id: number;
    nodeId: string;
    name: string;
    description: string | null;
    color: string;
    isDefault: boolean;
}

export interface Milestone {
    id: number;
    nodeId: string;
    number: number;
    title: string;
    description: string | null;
    state: "open" | "closed";
    createdAt: string;
    updatedAt: string;
    closedAt: string | null;
    dueOn: string | null;
}

export interface Issue {
    id: number;
    nodeId: string;
    number: number;
    title: string;
    body: string | null;
    state: IssueState;
    stateReason: IssueStateReason;
    user: User;
    labels: Label[];
    assignee: User | null;
    assignees: User[];
    milestone: Milestone | null;
    comments: number;
    isLocked: boolean;
    url: string;
    apiUrl: string;
    createdAt: string;
    updatedAt: string;
    closedAt: string | null;
    /** True if this issue is actually a pull request (GitHub models PRs as issues). */
    isPullRequest: boolean;
}

export interface IssueComment {
    id: number;
    nodeId: string;
    user: User;
    body: string;
    url: string;
    apiUrl: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateIssueParams {
    title: string;
    body?: string;
    labels?: string[];
    assignees?: string[];
    milestone?: number;
}

export interface CreateIssuePayload {
    title: string;
    body?: string;
    labels?: string[];
    assignees?: string[];
    milestone?: number;
}

export interface UpdateIssueParams {
    issueNumber: number;
    title?: string;
    body?: string;
    state?: IssueState;
    stateReason?: IssueStateReason;
    labels?: string[];
    assignees?: string[];
    milestone?: number | null;
}

export interface UpdateIssuePayload {
    title?: string;
    body?: string;
    state?: IssueState;
    state_reason?: IssueStateReason;
    labels?: string[];
    assignees?: string[];
    milestone?: number | null;
}
