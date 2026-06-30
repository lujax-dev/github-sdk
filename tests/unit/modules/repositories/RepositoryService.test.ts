import { GithubClient } from "../../../../src/client/GithubClient";
import { RepositoryService } from "../../../../src/modules/repositories/RepositoryService";
import { RepositoryDTO } from "../../../../src/modules/repositories/repository.dto";
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

const mockRepoDto: RepositoryDTO = {
    id: 1,
    node_id: "R_1",
    name: "test-repo",
    full_name: "testuser/test-repo",
    private: false,
    owner: mockUserDto,
    html_url: "https://github.com/testuser/test-repo",
    description: null,
    fork: false,
    url: "https://api.github.com/repos/testuser/test-repo",
    stargazers_count: 0,
    watchers_count: 0,
    forks_count: 0,
    open_issues_count: 0,
    language: null,
    default_branch: "main",
    created_at: "2020-01-01T00:00:00Z",
    updated_at: "2020-01-01T00:00:00Z",
    pushed_at: "2020-01-01T00:00:00Z",
    size: 0,
    visibility: "public",
};

function makeService() {
    const mockRequest = jest.fn();
    const client = {
        config: {
            token: "test-token",
            owner: "test-owner",
            repo: "test-repo",
            org: "test-org",
        },
        request: mockRequest,
        baseUrl: "https://api.github.com",
    } as unknown as GithubClient;
    return { service: new RepositoryService(client), mockRequest };
}

describe("RepositoryService", () => {
    describe("get", () => {
        it("calls GET /repos/:owner/:repo", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({ data: mockRepoDto, status: 200 });
            await service.get();
            expect(mockRequest).toHaveBeenCalledWith(
                "/repos/test-owner/test-repo",
            );
        });

        it("returns a mapped Repository", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({ data: mockRepoDto, status: 200 });
            const result = await service.get();
            expect(result.name).toBe("test-repo");
            expect(result.fullName).toBe("testuser/test-repo");
        });
    });

    describe("listByUsername", () => {
        it("calls GET /users/:username/repos", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({
                data: [mockRepoDto],
                status: 200,
            });
            await service.listByUsername("lewie");
            expect(mockRequest).toHaveBeenCalledWith("/users/lewie/repos");
        });

        it("returns an array of mapped Repositories", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({
                data: [mockRepoDto],
                status: 200,
            });
            const result = await service.listByUsername("lewie");
            expect(Array.isArray(result)).toBe(true);
            expect(result[0].name).toBe("test-repo");
        });
    });
});
