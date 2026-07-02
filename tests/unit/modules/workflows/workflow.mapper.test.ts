import {
    mapWorkflow,
    mapWorkflows,
    mapWorkflowRun,
    mapWorkflowRuns,
    mapTriggerWorkflowDispatchParams,
} from "../../../../src/modules/workflows/workflow.mapper";
import {
    WorkflowDTO,
    WorkflowRunDTO,
} from "../../../../src/modules/workflows/workflow.dto";
import { UserDTO } from "../../../../src/modules/users/user.dto";

const mockUserDto: UserDTO = {
    login: "testuser",
    id: 1,
    node_id: "U_1",
    avatar_url: "",
    html_url: "",
    url: "",
    type: "User",
    site_admin: false,
    name: null,
    company: null,
    blog: null,
    location: null,
    email: null,
    bio: null,
    twitter_username: null,
    public_repos: 0,
    public_gists: 0,
    followers: 0,
    following: 0,
    created_at: "2020-01-01T00:00:00Z",
    updated_at: "2020-01-01T00:00:00Z",
};

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
    actor: mockUserDto,
};

describe("workflow.mapper", () => {
    describe("mapWorkflow", () => {
        it("maps snake_case fields to camelCase", () => {
            const result = mapWorkflow(mockWorkflowDto);
            expect(result.badgeUrl).toBe(mockWorkflowDto.badge_url);
            expect(result.url).toBe(mockWorkflowDto.html_url);
            expect(result.apiUrl).toBe(mockWorkflowDto.url);
            expect(result.state).toBe("active");
        });
    });

    describe("mapWorkflows", () => {
        it("maps an array of workflows", () => {
            expect(mapWorkflows([mockWorkflowDto])).toHaveLength(1);
        });
    });

    describe("mapWorkflowRun", () => {
        it("maps snake_case fields to camelCase and the actor", () => {
            const result = mapWorkflowRun(mockWorkflowRunDto);
            expect(result.runNumber).toBe(42);
            expect(result.headBranch).toBe("main");
            expect(result.conclusion).toBe("success");
            expect(result.actor?.username).toBe("testuser");
        });

        it("maps a null actor to null", () => {
            const result = mapWorkflowRun({
                ...mockWorkflowRunDto,
                actor: null,
            });
            expect(result.actor).toBeNull();
        });
    });

    describe("mapWorkflowRuns", () => {
        it("maps an array of workflow runs", () => {
            expect(mapWorkflowRuns([mockWorkflowRunDto])).toHaveLength(1);
        });
    });

    describe("mapTriggerWorkflowDispatchParams", () => {
        it("maps params to the dispatch payload", () => {
            const result = mapTriggerWorkflowDispatchParams({
                workflowId: "ci.yml",
                ref: "main",
                inputs: { environment: "production" },
            });
            expect(result).toEqual({
                ref: "main",
                inputs: { environment: "production" },
            });
        });
    });
});
