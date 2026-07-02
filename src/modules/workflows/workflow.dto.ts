import {
    WorkflowState,
    WorkflowRunStatus,
    WorkflowRunConclusion,
} from "./workflow.types";
import { UserDTO } from "../users/user.dto";

export interface WorkflowDTO {
    id: number;
    node_id: string;
    name: string;
    path: string;
    state: WorkflowState;
    created_at: string;
    updated_at: string;
    url: string;
    html_url: string;
    badge_url: string;
}

export interface WorkflowsResponseDTO {
    total_count: number;
    workflows: WorkflowDTO[];
}

export interface WorkflowRunDTO {
    id: number;
    node_id: string;
    name: string | null;
    head_branch: string | null;
    head_sha: string;
    path: string;
    run_number: number;
    run_attempt: number;
    event: string;
    status: WorkflowRunStatus | null;
    conclusion: WorkflowRunConclusion;
    workflow_id: number;
    url: string;
    html_url: string;
    created_at: string;
    updated_at: string;
    run_started_at: string | null;
    actor: UserDTO | null;
}

export interface WorkflowRunsResponseDTO {
    total_count: number;
    workflow_runs: WorkflowRunDTO[];
}
