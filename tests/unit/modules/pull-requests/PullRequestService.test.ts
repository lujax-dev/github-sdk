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
});
