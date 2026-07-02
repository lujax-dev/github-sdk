import { GithubClient } from "../../../../src/client/GithubClient";
import { IssueService } from "../../../../src/modules/issues/IssueService";
import { IssueDTO } from "../../../../src/modules/issues/issue.dto";
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

const mockIssueDto: IssueDTO = {
    id: 1,
    node_id: "I_1",
    number: 12,
    title: "Bug: build fails",
    body: "Steps to reproduce...",
    state: "open",
    state_reason: null,
    user: mockUserDto,
    labels: [],
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

function makeService() {
    const mockRequest = jest.fn();
    const client = {
        config: { token: "test-token", owner: "test-owner", repo: "test-repo" },
        request: mockRequest,
        baseUrl: "https://api.github.com",
    } as unknown as GithubClient;
    return { service: new IssueService(client), mockRequest };
}

describe("IssueService", () => {
    describe("list", () => {
        it("calls GET /repos/:owner/:repo/issues", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({
                data: [mockIssueDto],
                status: 200,
            });
            await service.list();
            expect(mockRequest).toHaveBeenCalledWith(
                "/repos/test-owner/test-repo/issues",
            );
        });

        it("returns an array of mapped Issues", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({
                data: [mockIssueDto],
                status: 200,
            });
            const result = await service.list();
            expect(result[0].number).toBe(12);
        });
    });

    describe("get", () => {
        it("calls GET /repos/:owner/:repo/issues/:number", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({ data: mockIssueDto, status: 200 });
            await service.get(12);
            expect(mockRequest).toHaveBeenCalledWith(
                "/repos/test-owner/test-repo/issues/12",
            );
        });
    });

    describe("create", () => {
        it("calls POST /repos/:owner/:repo/issues with the mapped payload", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({ data: mockIssueDto, status: 201 });
            await service.create({ title: "New bug", labels: ["bug"] });
            expect(mockRequest).toHaveBeenCalledWith(
                "/repos/test-owner/test-repo/issues",
                {
                    method: "POST",
                    body: JSON.stringify({
                        title: "New bug",
                        body: undefined,
                        labels: ["bug"],
                        assignees: undefined,
                        milestone: undefined,
                    }),
                },
            );
        });
    });

    describe("update", () => {
        it("calls PATCH /repos/:owner/:repo/issues/:number with the mapped payload", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({
                data: { ...mockIssueDto, state: "closed" },
                status: 200,
            });
            await service.update({ issueNumber: 12, state: "closed" });
            expect(mockRequest).toHaveBeenCalledWith(
                "/repos/test-owner/test-repo/issues/12",
                expect.objectContaining({ method: "PATCH" }),
            );
        });
    });

    describe("listComments", () => {
        it("calls GET /repos/:owner/:repo/issues/:number/comments", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({ data: [], status: 200 });
            await service.listComments(12);
            expect(mockRequest).toHaveBeenCalledWith(
                "/repos/test-owner/test-repo/issues/12/comments",
            );
        });
    });

    describe("addComment", () => {
        it("calls POST /repos/:owner/:repo/issues/:number/comments with the body", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({
                data: {
                    id: 1,
                    node_id: "IC_1",
                    user: mockUserDto,
                    body: "Thanks!",
                    html_url: "",
                    url: "",
                    created_at: "2024-01-01T00:00:00Z",
                    updated_at: "2024-01-01T00:00:00Z",
                },
                status: 201,
            });
            const result = await service.addComment(12, "Thanks!");
            expect(mockRequest).toHaveBeenCalledWith(
                "/repos/test-owner/test-repo/issues/12/comments",
                { method: "POST", body: JSON.stringify({ body: "Thanks!" }) },
            );
            expect(result.body).toBe("Thanks!");
        });
    });
});
