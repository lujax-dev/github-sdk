import { GithubClient } from "../../../../src/client/GithubClient";
import { PullRequestService } from "../../../../src/modules/pull-requests/PullRequestService";
import {
    PullRequestDTO,
    PullRequestReviewDTO,
} from "../../../../src/modules/pull-requests/pull-request.dto";
import { UserDTO } from "../../../../src/modules/users/user.dto";
import { GithubApiError } from "../../../../src/shared/errors/GithubApiError";

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

const mockPullRequestDto: PullRequestDTO = {
    id: 1,
    node_id: "PR_1",
    number: 8,
    state: "open",
    locked: false,
    draft: false,
    title: "Test PR",
    body: null,
    user: mockUserDto,
    html_url: "https://github.com/owner/repo/pull/8",
    url: "https://api.github.com/repos/owner/repo/pulls/8",
    comments: 0,
    commits: 1,
    additions: 10,
    deletions: 2,
    changed_files: 1,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    closed_at: null,
    merged_at: null,
    merged: false,
    head: { ref: "feature", sha: "abc123" },
    base: { ref: "main", sha: "def456" },
};

const mockReviewDto: PullRequestReviewDTO = {
    id: 1,
    node_id: "PRR_1",
    user: mockUserDto,
    body: "Looks good",
    state: "APPROVED",
    html_url: "https://github.com/owner/repo/pull/8#pullrequestreview-1",
    pull_request_url: "https://api.github.com/repos/owner/repo/pulls/8",
    submitted_at: "2024-01-02T00:00:00Z",
    commit_id: "abc123",
};

function makeService() {
    const mockRequest = jest.fn();
    const client = {
        config: { token: "test-token", owner: "test-owner", repo: "test-repo" },
        request: mockRequest,
        baseUrl: "https://api.github.com",
    } as unknown as GithubClient;
    return { service: new PullRequestService(client), mockRequest };
}

describe("PullRequestService", () => {
    describe("list", () => {
        it("calls GET /repos/:owner/:repo/pulls", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({
                data: [mockPullRequestDto],
                status: 200,
            });
            await service.list();
            expect(mockRequest).toHaveBeenCalledWith(
                "/repos/test-owner/test-repo/pulls",
            );
        });

        it("returns an array of mapped PullRequests", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({
                data: [mockPullRequestDto],
                status: 200,
            });
            const result = await service.list();
            expect(Array.isArray(result)).toBe(true);
            expect(result[0].number).toBe(8);
            expect(result[0].title).toBe("Test PR");
        });
    });

    describe("get", () => {
        it("calls GET /repos/:owner/:repo/pulls/:number", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({
                data: mockPullRequestDto,
                status: 200,
            });
            await service.get(8);
            expect(mockRequest).toHaveBeenCalledWith(
                "/repos/test-owner/test-repo/pulls/8",
            );
        });
    });

    describe("isMerged", () => {
        it("returns true when the PR is merged (204 response)", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({ data: null, status: 204 });
            const result = await service.isMerged(8);
            expect(result).toBe(true);
        });

        it("returns false when the PR is not merged (404 error)", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockRejectedValue(new GithubApiError(404, "Not Found"));
            const result = await service.isMerged(8);
            expect(result).toBe(false);
        });

        it("rethrows errors that are not 404", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockRejectedValue(
                new GithubApiError(500, "Internal Server Error"),
            );
            await expect(service.isMerged(8)).rejects.toThrow(GithubApiError);
        });
    });

    describe("reviews", () => {
        it("calls GET /repos/:owner/:repo/pulls/:number/reviews", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({
                data: [mockReviewDto],
                status: 200,
            });
            await service.reviews(8);
            expect(mockRequest).toHaveBeenCalledWith(
                "/repos/test-owner/test-repo/pulls/8/reviews",
            );
        });

        it("returns an array of mapped PullRequestReviews", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({
                data: [mockReviewDto],
                status: 200,
            });
            const result = await service.reviews(8);
            expect(Array.isArray(result)).toBe(true);
            expect(result[0].state).toBe("APPROVED");
            expect(result[0].commitId).toBe("abc123");
            expect(result[0].submittedAt).toBe("2024-01-02T00:00:00Z");
        });

        it("maps a missing submitted_at to null", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({
                data: [{ ...mockReviewDto, submitted_at: undefined }],
                status: 200,
            });
            const result = await service.reviews(8);
            expect(result[0].submittedAt).toBeNull();
        });
    });

    describe("cycleTime", () => {
        it("calculates totalMs and totalHours for a merged PR", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({
                data: {
                    ...mockPullRequestDto,
                    created_at: "2024-01-01T00:00:00Z",
                    merged_at: "2024-01-01T02:00:00Z",
                    merged: true,
                },
                status: 200,
            });
            const result = await service.cycleTime(8);
            expect(result.openedAt).toBe("2024-01-01T00:00:00Z");
            expect(result.mergedAt).toBe("2024-01-01T02:00:00Z");
            expect(result.totalMs).toBe(2 * 60 * 60 * 1000);
            expect(result.totalHours).toBe(2);
        });

        it("returns null durations for an unmerged PR", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({
                data: mockPullRequestDto,
                status: 200,
            });
            const result = await service.cycleTime(8);
            expect(result.mergedAt).toBeNull();
            expect(result.totalMs).toBeNull();
            expect(result.totalHours).toBeNull();
        });
    });

    describe("create", () => {
        it("calls POST /repos/:owner/:repo/pulls with the mapped payload", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({
                data: mockPullRequestDto,
                status: 201,
            });
            await service.create({
                title: "Test PR",
                head: "user:feature",
                base: "main",
                maintainerCanModify: true,
            });
            expect(mockRequest).toHaveBeenCalledWith(
                "/repos/test-owner/test-repo/pulls",
                {
                    method: "POST",
                    body: JSON.stringify({
                        head: "user:feature",
                        base: "main",
                        title: "Test PR",
                        maintainer_can_modify: true,
                    }),
                },
            );
        });

        it("returns the mapped created PullRequest", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({
                data: mockPullRequestDto,
                status: 201,
            });
            const result = await service.create({
                title: "Test PR",
                head: "user:feature",
                base: "main",
            });
            expect(result.number).toBe(8);
            expect(result.head).toEqual({ ref: "feature", sha: "abc123" });
        });
    });

    describe("update", () => {
        it("calls PATCH /repos/:owner/:repo/pulls/:number with the mapped payload", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({
                data: { ...mockPullRequestDto, title: "new title" },
                status: 200,
            });
            const result = await service.update({
                pullNumber: 8,
                title: "new title",
                state: "open",
            });
            expect(mockRequest).toHaveBeenCalledWith(
                "/repos/test-owner/test-repo/pulls/8",
                {
                    method: "PATCH",
                    body: JSON.stringify({
                        title: "new title",
                        state: "open",
                    }),
                },
            );
            expect(result.title).toBe("new title");
        });
    });

    describe("listCommits", () => {
        it("calls GET /repos/:owner/:repo/pulls/:number/commits and maps them", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({
                data: [
                    {
                        sha: "abc123",
                        node_id: "C_1",
                        commit: {
                            author: {
                                name: "Mona",
                                email: "mona@example.com",
                                date: "2024-01-01T00:00:00Z",
                            },
                            committer: {
                                name: "Mona",
                                email: "mona@example.com",
                                date: "2024-01-01T00:00:00Z",
                            },
                            message: "feat: add thing",
                            tree: { sha: "t1", url: "" },
                            url: "",
                            comment_count: 0,
                            verification: {
                                verified: false,
                                reason: "unsigned",
                                signature: null,
                                payload: null,
                            },
                        },
                        url: "",
                        html_url: "https://github.com/owner/repo/commit/abc123",
                        author: mockUserDto,
                        committer: mockUserDto,
                        parents: [],
                    },
                ],
                status: 200,
            });
            const result = await service.listCommits(8);
            expect(mockRequest).toHaveBeenCalledWith(
                "/repos/test-owner/test-repo/pulls/8/commits",
            );
            expect(result).toHaveLength(1);
            expect(result[0].message).toBe("feat: add thing");
        });
    });

    describe("listFiles", () => {
        it("calls GET /repos/:owner/:repo/pulls/:number/files and maps them", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({
                data: [
                    {
                        sha: "f1",
                        filename: "src/index.ts",
                        status: "modified",
                        additions: 1,
                        deletions: 0,
                        changes: 1,
                        blob_url: "",
                        raw_url: "",
                        contents_url: "",
                        patch: "@@ -1 +1 @@",
                    },
                ],
                status: 200,
            });
            const result = await service.listFiles(8);
            expect(mockRequest).toHaveBeenCalledWith(
                "/repos/test-owner/test-repo/pulls/8/files",
            );
            expect(result[0].name).toBe("src/index.ts");
        });
    });

    describe("merge", () => {
        it("calls PUT /repos/:owner/:repo/pulls/:number/merge with the mapped payload", async () => {
            const { service, mockRequest } = makeService();
            const mergeResponse = {
                sha: "merged123",
                merged: true,
                message: "Pull Request successfully merged",
            };
            mockRequest.mockResolvedValue({ data: mergeResponse, status: 200 });
            const result = await service.merge({
                pullNumber: 8,
                commitTitle: "Expand docs",
                mergeMethod: "squash",
            });
            expect(mockRequest).toHaveBeenCalledWith(
                "/repos/test-owner/test-repo/pulls/8/merge",
                {
                    method: "PUT",
                    body: JSON.stringify({
                        commit_title: "Expand docs",
                        merge_method: "squash",
                    }),
                },
            );
            expect(result).toEqual(mergeResponse);
        });
    });

    describe("updateBranch", () => {
        it("calls PUT /repos/:owner/:repo/pulls/:number/update-branch", async () => {
            const { service, mockRequest } = makeService();
            const branchResponse = {
                message: "Updating pull request branch.",
                url: "https://api.github.com/repos/owner/repo/pulls/8",
            };
            mockRequest.mockResolvedValue({
                data: branchResponse,
                status: 202,
            });
            const result = await service.updateBranch(8, "abc123");
            expect(mockRequest).toHaveBeenCalledWith(
                "/repos/test-owner/test-repo/pulls/8/update-branch",
                {
                    method: "PUT",
                    body: JSON.stringify({ expected_head_sha: "abc123" }),
                },
            );
            expect(result).toEqual(branchResponse);
        });

        it("sends an undefined expected_head_sha when omitted", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({
                data: { message: "ok", url: "" },
                status: 202,
            });
            await service.updateBranch(8);
            expect(mockRequest).toHaveBeenCalledWith(
                "/repos/test-owner/test-repo/pulls/8/update-branch",
                { method: "PUT", body: JSON.stringify({}) },
            );
        });
    });
});
