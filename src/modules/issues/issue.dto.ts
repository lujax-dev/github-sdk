import { IssueState, IssueStateReason } from "./issue.types";
import { UserDTO } from "../users/user.dto";

export interface LabelDTO {
    id: number;
    node_id: string;
    name: string;
    description: string | null;
    color: string;
    default: boolean;
}

export interface MilestoneDTO {
    id: number;
    node_id: string;
    number: number;
    title: string;
    description: string | null;
    state: "open" | "closed";
    created_at: string;
    updated_at: string;
    closed_at: string | null;
    due_on: string | null;
}

export interface IssuePullRequestRefDTO {
    url: string;
    html_url: string;
    diff_url: string | null;
    patch_url: string | null;
}

export interface IssueDTO {
    id: number;
    node_id: string;
    number: number;
    title: string;
    body: string | null;
    state: IssueState;
    state_reason: IssueStateReason;
    user: UserDTO;
    labels: LabelDTO[];
    assignee: UserDTO | null;
    assignees: UserDTO[];
    milestone: MilestoneDTO | null;
    comments: number;
    locked: boolean;
    html_url: string;
    url: string;
    created_at: string;
    updated_at: string;
    closed_at: string | null;
    pull_request?: IssuePullRequestRefDTO;
}

export interface IssueCommentDTO {
    id: number;
    node_id: string;
    user: UserDTO;
    body: string;
    html_url: string;
    url: string;
    created_at: string;
    updated_at: string;
}
