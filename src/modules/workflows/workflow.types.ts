import { User } from "../users/user.types";

export type WorkflowState =
    | "active"
    | "deleted"
    | "disabled_fork"
    | "disabled_inactivity"
    | "disabled_manually";

export type WorkflowRunStatus =
    | "queued"
    | "in_progress"
    | "completed"
    | "waiting"
    | "requested"
    | "pending";

export type WorkflowRunConclusion =
    | "success"
    | "failure"
    | "neutral"
    | "cancelled"
    | "skipped"
    | "timed_out"
    | "action_required"
    | "stale"
    | null;

export interface Workflow {
    id: number;
    nodeId: string;
    name: string;
    path: string;
    state: WorkflowState;
    createdAt: string;
    updatedAt: string;
    url: string;
    apiUrl: string;
    badgeUrl: string;
}

export interface WorkflowRun {
    id: number;
    nodeId: string;
    name: string | null;
    headBranch: string | null;
    headSha: string;
    path: string;
    runNumber: number;
    runAttempt: number;
    event: string;
    status: WorkflowRunStatus | null;
    conclusion: WorkflowRunConclusion;
    workflowId: number;
    url: string;
    apiUrl: string;
    createdAt: string;
    updatedAt: string;
    runStartedAt: string | null;
    actor: User | null;
}

export interface TriggerWorkflowDispatchParams {
    workflowId: number | string;
    ref: string;
    inputs?: Record<string, string>;
}

export interface TriggerWorkflowDispatchPayload {
    ref: string;
    inputs?: Record<string, string>;
}
