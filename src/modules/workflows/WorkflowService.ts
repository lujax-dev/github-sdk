import { GithubClient } from "../../client/GithubClient";
import {
    Workflow,
    WorkflowRun,
    TriggerWorkflowDispatchParams,
} from "./workflow.types";
import {
    WorkflowDTO,
    WorkflowRunDTO,
    WorkflowsResponseDTO,
    WorkflowRunsResponseDTO,
} from "./workflow.dto";
import {
    mapTriggerWorkflowDispatchParams,
    mapWorkflow,
    mapWorkflowRun,
    mapWorkflowRuns,
    mapWorkflows,
} from "./workflow.mapper";
import { assertConfig } from "../../shared/utils/config.utils";

export class WorkflowService {
    private readonly workflowsPath: string;
    private readonly runsPath: string;

    constructor(private readonly client: GithubClient) {
        assertConfig(this.client, ["owner", "repo"]);
        const repoPath = `/repos/${this.client.config.owner}/${this.client.config.repo}`;
        this.workflowsPath = `${repoPath}/actions/workflows`;
        this.runsPath = `${repoPath}/actions/runs`;
    }

    /**
     * List workflows in the configured repository
     *
     * @returns Array of workflows
     *
     * @example
     * ```ts
     * const workflows = await github.workflows.list();
     * ```
     */
    public async list(): Promise<Workflow[]> {
        const response = await this.client.request<WorkflowsResponseDTO>(
            this.workflowsPath,
        );
        return mapWorkflows(response.data.workflows);
    }

    /**
     * Get a workflow by its ID or file name
     *
     * @param workflowId The ID or file name that identifies the workflow
     * @returns Data of a workflow
     *
     * @example
     * ```ts
     * const workflow = await github.workflows.get('ci.yml');
     * ```
     */
    public async get(workflowId: number | string): Promise<Workflow> {
        const response = await this.client.request<WorkflowDTO>(
            `${this.workflowsPath}/${workflowId}`,
        );
        return mapWorkflow(response.data);
    }

    /**
     * List runs for a workflow
     *
     * @param workflowId The ID or file name that identifies the workflow
     * @returns Array of workflow runs
     *
     * @example
     * ```ts
     * const runs = await github.workflows.listRuns('ci.yml');
     * ```
     */
    public async listRuns(workflowId: number | string): Promise<WorkflowRun[]> {
        const response = await this.client.request<WorkflowRunsResponseDTO>(
            `${this.workflowsPath}/${workflowId}/runs`,
        );
        return mapWorkflowRuns(response.data.workflow_runs);
    }

    /**
     * Get a specific workflow run
     *
     * @param runId The ID that identifies the workflow run
     * @returns Data of a workflow run
     *
     * @example
     * ```ts
     * const run = await github.workflows.getRun(123456);
     * ```
     */
    public async getRun(runId: number): Promise<WorkflowRun> {
        const response = await this.client.request<WorkflowRunDTO>(
            `${this.runsPath}/${runId}`,
        );
        return mapWorkflowRun(response.data);
    }

    /**
     * Trigger a workflow_dispatch event on a workflow
     *
     * @param params Configuration for the dispatch
     *
     * @example
     * ```ts
     * await github.workflows.triggerDispatch({
     *     workflowId: 'ci.yml',
     *     ref: 'main',
     *     inputs: { environment: 'production' },
     * });
     * ```
     */
    public async triggerDispatch(
        params: TriggerWorkflowDispatchParams,
    ): Promise<void> {
        const body = mapTriggerWorkflowDispatchParams(params);
        await this.client.request<null>(
            `${this.workflowsPath}/${params.workflowId}/dispatches`,
            {
                method: "POST",
                body: JSON.stringify(body),
            },
        );
    }

    /**
     * Cancel a workflow run
     *
     * @param runId The ID that identifies the workflow run
     *
     * @example
     * ```ts
     * await github.workflows.cancelRun(123456);
     * ```
     */
    public async cancelRun(runId: number): Promise<void> {
        await this.client.request<null>(`${this.runsPath}/${runId}/cancel`, {
            method: "POST",
        });
    }

    /**
     * Re-run the failed jobs in a workflow run
     *
     * @param runId The ID that identifies the workflow run
     *
     * @example
     * ```ts
     * await github.workflows.reRunFailedJobs(123456);
     * ```
     */
    public async reRunFailedJobs(runId: number): Promise<void> {
        await this.client.request<null>(
            `${this.runsPath}/${runId}/rerun-failed-jobs`,
            { method: "POST" },
        );
    }
}
