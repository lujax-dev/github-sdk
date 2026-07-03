import { GithubClient } from "../../../../src/client/GithubClient";
import { WorkflowService } from "../../../../src/modules/workflows/WorkflowService";
import {
    WorkflowDTO,
    WorkflowRunDTO,
    WorkflowsResponseDTO,
    WorkflowRunsResponseDTO,
} from "../../../../src/modules/workflows/workflow.dto";

const mockWorkflowDto: WorkflowDTO = {
    id: 1,
    node_id: "W_1",
    name: "CI",
    path: ".github/workflows/ci.yml",
    state: "active",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    url: "https://api.github.com/repos/owner/repo/actions/workflows/1",
    html_url: "https://github.com/owner/repo/actions/workflows/ci.yml",
    badge_url: "https://github.com/owner/repo/workflows/CI/badge.svg",
};

const mockWorkflowRunDto: WorkflowRunDTO = {
    id: 100,
    node_id: "WR_1",
    name: "CI",
    head_branch: "main",
    head_sha: "abc123",
    path: ".github/workflows/ci.yml",
    run_number: 42,
    run_attempt: 1,
    event: "push",
    status: "completed",
    conclusion: "success",
    workflow_id: 1,
    url: "https://api.github.com/repos/owner/repo/actions/runs/100",
    html_url: "https://github.com/owner/repo/actions/runs/100",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:05:00Z",
    run_started_at: "2024-01-01T00:00:30Z",
    actor: null,
};

function makeService() {
    const mockRequest = jest.fn();
    const client = {
        config: { token: "test-token", owner: "test-owner", repo: "test-repo" },
        request: mockRequest,
        baseUrl: "https://api.github.com",
    } as unknown as GithubClient;
    return { service: new WorkflowService(client), mockRequest };
}

describe("WorkflowService", () => {
    describe("list", () => {
        it("calls GET /repos/:owner/:repo/actions/workflows and unwraps workflows", async () => {
            const { service, mockRequest } = makeService();
            const responseData: WorkflowsResponseDTO = {
                total_count: 1,
                workflows: [mockWorkflowDto],
            };
            mockRequest.mockResolvedValue({ data: responseData, status: 200 });
            const result = await service.list();
            expect(mockRequest).toHaveBeenCalledWith(
                "/repos/test-owner/test-repo/actions/workflows",
            );
            expect(result).toHaveLength(1);
            expect(result[0].name).toBe("CI");
        });
    });

    describe("get", () => {
        it("calls GET /repos/:owner/:repo/actions/workflows/:id", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({
                data: mockWorkflowDto,
                status: 200,
            });
            await service.get("ci.yml");
            expect(mockRequest).toHaveBeenCalledWith(
                "/repos/test-owner/test-repo/actions/workflows/ci.yml",
            );
        });
    });

    describe("listRuns", () => {
        it("calls GET /repos/:owner/:repo/actions/workflows/:id/runs and unwraps runs", async () => {
            const { service, mockRequest } = makeService();
            const responseData: WorkflowRunsResponseDTO = {
                total_count: 1,
                workflow_runs: [mockWorkflowRunDto],
            };
            mockRequest.mockResolvedValue({ data: responseData, status: 200 });
            const result = await service.listRuns(1);
            expect(mockRequest).toHaveBeenCalledWith(
                "/repos/test-owner/test-repo/actions/workflows/1/runs",
            );
            expect(result).toHaveLength(1);
            expect(result[0].runNumber).toBe(42);
        });
    });

    describe("getRun", () => {
        it("calls GET /repos/:owner/:repo/actions/runs/:id", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({
                data: mockWorkflowRunDto,
                status: 200,
            });
            await service.getRun(100);
            expect(mockRequest).toHaveBeenCalledWith(
                "/repos/test-owner/test-repo/actions/runs/100",
            );
        });
    });

    describe("triggerDispatch", () => {
        it("calls POST /repos/:owner/:repo/actions/workflows/:id/dispatches with ref and inputs", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({ data: null, status: 204 });
            await service.triggerDispatch({
                workflowId: "ci.yml",
                ref: "main",
                inputs: { environment: "production" },
            });
            expect(mockRequest).toHaveBeenCalledWith(
                "/repos/test-owner/test-repo/actions/workflows/ci.yml/dispatches",
                {
                    method: "POST",
                    body: JSON.stringify({
                        ref: "main",
                        inputs: { environment: "production" },
                    }),
                },
            );
        });
    });

    describe("cancelRun", () => {
        it("calls POST /repos/:owner/:repo/actions/runs/:id/cancel", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({ data: null, status: 202 });
            await service.cancelRun(100);
            expect(mockRequest).toHaveBeenCalledWith(
                "/repos/test-owner/test-repo/actions/runs/100/cancel",
                { method: "POST" },
            );
        });
    });

    describe("reRunFailedJobs", () => {
        it("calls POST /repos/:owner/:repo/actions/runs/:id/rerun-failed-jobs", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({ data: null, status: 201 });
            await service.reRunFailedJobs(100);
            expect(mockRequest).toHaveBeenCalledWith(
                "/repos/test-owner/test-repo/actions/runs/100/rerun-failed-jobs",
                { method: "POST" },
            );
        });
    });
});
