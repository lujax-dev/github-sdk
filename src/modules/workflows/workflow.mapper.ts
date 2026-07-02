import {
    Workflow,
    WorkflowRun,
    TriggerWorkflowDispatchParams,
    TriggerWorkflowDispatchPayload,
} from "./workflow.types";
import { WorkflowDTO, WorkflowRunDTO } from "./workflow.dto";
import { mapUser } from "../users/user.mapper";

export function mapWorkflow(dto: WorkflowDTO): Workflow {
    return {
        id: dto.id,
        nodeId: dto.node_id,
        name: dto.name,
        path: dto.path,
        state: dto.state,
        createdAt: dto.created_at,
        updatedAt: dto.updated_at,
        url: dto.html_url,
        apiUrl: dto.url,
        badgeUrl: dto.badge_url,
    };
}

export function mapWorkflows(dtos: WorkflowDTO[]): Workflow[] {
    return dtos.map((dto) => mapWorkflow(dto));
}

export function mapWorkflowRun(dto: WorkflowRunDTO): WorkflowRun {
    return {
        id: dto.id,
        nodeId: dto.node_id,
        name: dto.name,
        headBranch: dto.head_branch,
        headSha: dto.head_sha,
        path: dto.path,
        runNumber: dto.run_number,
        runAttempt: dto.run_attempt,
        event: dto.event,
        status: dto.status,
        conclusion: dto.conclusion,
        workflowId: dto.workflow_id,
        url: dto.html_url,
        apiUrl: dto.url,
        createdAt: dto.created_at,
        updatedAt: dto.updated_at,
        runStartedAt: dto.run_started_at,
        actor: dto.actor ? mapUser(dto.actor) : null,
    };
}

export function mapWorkflowRuns(dtos: WorkflowRunDTO[]): WorkflowRun[] {
    return dtos.map((dto) => mapWorkflowRun(dto));
}

export function mapTriggerWorkflowDispatchParams(
    params: TriggerWorkflowDispatchParams,
): TriggerWorkflowDispatchPayload {
    return {
        ref: params.ref,
        inputs: params.inputs,
    };
}
