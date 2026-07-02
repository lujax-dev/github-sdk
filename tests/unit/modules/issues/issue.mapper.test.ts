import {
    mapIssue,
    mapIssues,
    mapIssueComment,
    mapLabel,
    mapMilestone,
    mapCreateIssueParams,
    mapUpdateIssueParams,
} from "../../../../src/modules/issues/issue.mapper";
import {
    IssueDTO,
    IssueCommentDTO,
    LabelDTO,
    MilestoneDTO,
} from "../../../../src/modules/issues/issue.dto";
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

const mockLabelDto: LabelDTO = {
    id: 1,
    node_id: "L_1",
    name: "bug",
    description: "Something isn't working",
    color: "d73a4a",
    default: true,
};

const mockMilestoneDto: MilestoneDTO = {
    id: 1,
    node_id: "M_1",
    number: 1,
    title: "v1",
    description: null,
    state: "open",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    closed_at: null,
    due_on: null,
};

const mockIssueDto: IssueDTO = {
    id: 1,
    node_id: "I_1",
    number: 12,
    title: "Bug: build fails",
    body: "Steps to reproduce...",
    state: "open",
    state_reason: null,
    user: mockUserDto,
    labels: [mockLabelDto],
    assignee: null,
    assignees: [],
    milestone: null,
    comments: 0,
    locked: false,
    html_url: "https://github.com/owner/repo/issues/12",
    url: "https://api.github.com/repos/owner/repo/issues/12",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    closed_at: null,
};

describe("issue.mapper", () => {
    describe("mapLabel", () => {
        it("maps default to isDefault", () => {
            const result = mapLabel(mockLabelDto);
            expect(result.isDefault).toBe(true);
            expect(result.name).toBe("bug");
        });
    });

    describe("mapMilestone", () => {
        it("maps snake_case fields to camelCase", () => {
            const result = mapMilestone(mockMilestoneDto);
            expect(result.dueOn).toBeNull();
            expect(result.createdAt).toBe("2024-01-01T00:00:00Z");
        });
    });

    describe("mapIssue", () => {
        it("maps a plain issue with isPullRequest false", () => {
            const result = mapIssue(mockIssueDto);
            expect(result.number).toBe(12);
            expect(result.isPullRequest).toBe(false);
            expect(result.labels[0].name).toBe("bug");
            expect(result.assignee).toBeNull();
            expect(result.milestone).toBeNull();
        });

        it("sets isPullRequest true when pull_request is present", () => {
            const result = mapIssue({
                ...mockIssueDto,
                pull_request: {
                    url: "https://api.github.com/repos/owner/repo/pulls/12",
                    html_url: "https://github.com/owner/repo/pull/12",
                    diff_url: null,
                    patch_url: null,
                },
            });
            expect(result.isPullRequest).toBe(true);
        });

        it("maps assignee and milestone when present", () => {
            const result = mapIssue({
                ...mockIssueDto,
                assignee: mockUserDto,
                assignees: [mockUserDto],
                milestone: mockMilestoneDto,
            });
            expect(result.assignee?.username).toBe("testuser");
            expect(result.assignees).toHaveLength(1);
            expect(result.milestone?.title).toBe("v1");
        });
    });

    describe("mapIssues", () => {
        it("maps an array of issues", () => {
            const result = mapIssues([mockIssueDto]);
            expect(result).toHaveLength(1);
        });
    });

    describe("mapIssueComment", () => {
        it("maps a comment DTO to camelCase", () => {
            const dto: IssueCommentDTO = {
                id: 1,
                node_id: "IC_1",
                user: mockUserDto,
                body: "Thanks for the report!",
                html_url:
                    "https://github.com/owner/repo/issues/12#issuecomment-1",
                url: "https://api.github.com/repos/owner/repo/issues/comments/1",
                created_at: "2024-01-01T00:00:00Z",
                updated_at: "2024-01-01T00:00:00Z",
            };
            const result = mapIssueComment(dto);
            expect(result.body).toBe("Thanks for the report!");
            expect(result.user.username).toBe("testuser");
        });
    });

    describe("mapCreateIssueParams", () => {
        it("passes params through unchanged (already flat)", () => {
            const result = mapCreateIssueParams({
                title: "New bug",
                labels: ["bug"],
                assignees: ["testuser"],
            });
            expect(result).toEqual({
                title: "New bug",
                body: undefined,
                labels: ["bug"],
                assignees: ["testuser"],
                milestone: undefined,
            });
        });
    });

    describe("mapUpdateIssueParams", () => {
        it("maps stateReason to state_reason", () => {
            const result = mapUpdateIssueParams({
                issueNumber: 12,
                state: "closed",
                stateReason: "completed",
            });
            expect(result.state).toBe("closed");
            expect(result.state_reason).toBe("completed");
        });
    });
});
