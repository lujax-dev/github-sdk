import { GithubClient } from "../../../../src/client/GithubClient";
import { ReleaseService } from "../../../../src/modules/releases/ReleaseService";
import { ReleaseDTO } from "../../../../src/modules/releases/release.dto";
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

const mockReleaseDto: ReleaseDTO = {
    id: 1,
    node_id: "R_1",
    tag_name: "v1.0.0",
    target_commitish: "main",
    name: "v1.0.0",
    body: "Initial release",
    draft: false,
    prerelease: false,
    author: mockUserDto,
    assets: [],
    html_url: "https://github.com/owner/repo/releases/tag/v1.0.0",
    url: "https://api.github.com/repos/owner/repo/releases/1",
    tarball_url: null,
    zipball_url: null,
    created_at: "2024-01-01T00:00:00Z",
    published_at: "2024-01-02T00:00:00Z",
};

function makeService() {
    const mockRequest = jest.fn();
    const client = {
        config: { token: "test-token", owner: "test-owner", repo: "test-repo" },
        request: mockRequest,
        baseUrl: "https://api.github.com",
    } as unknown as GithubClient;
    return { service: new ReleaseService(client), mockRequest };
}

describe("ReleaseService", () => {
    describe("list", () => {
        it("calls GET /repos/:owner/:repo/releases", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({
                data: [mockReleaseDto],
                status: 200,
            });
            await service.list();
            expect(mockRequest).toHaveBeenCalledWith(
                "/repos/test-owner/test-repo/releases",
            );
        });
    });

    describe("get", () => {
        it("calls GET /repos/:owner/:repo/releases/:id", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({
                data: mockReleaseDto,
                status: 200,
            });
            await service.get(1);
            expect(mockRequest).toHaveBeenCalledWith(
                "/repos/test-owner/test-repo/releases/1",
            );
        });
    });

    describe("getLatest", () => {
        it("calls GET /repos/:owner/:repo/releases/latest", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({
                data: mockReleaseDto,
                status: 200,
            });
            await service.getLatest();
            expect(mockRequest).toHaveBeenCalledWith(
                "/repos/test-owner/test-repo/releases/latest",
            );
        });
    });

    describe("getByTag", () => {
        it("calls GET /repos/:owner/:repo/releases/tags/:tag", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({
                data: mockReleaseDto,
                status: 200,
            });
            await service.getByTag("v1.0.0");
            expect(mockRequest).toHaveBeenCalledWith(
                "/repos/test-owner/test-repo/releases/tags/v1.0.0",
            );
        });
    });

    describe("create", () => {
        it("calls POST /repos/:owner/:repo/releases with the mapped payload", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({
                data: mockReleaseDto,
                status: 201,
            });
            await service.create({ tagName: "v1.0.0", name: "v1.0.0" });
            expect(mockRequest).toHaveBeenCalledWith(
                "/repos/test-owner/test-repo/releases",
                expect.objectContaining({ method: "POST" }),
            );
            const callBody = JSON.parse(
                (mockRequest.mock.calls[0][1] as { body: string }).body,
            );
            expect(callBody.tag_name).toBe("v1.0.0");
        });
    });

    describe("update", () => {
        it("calls PATCH /repos/:owner/:repo/releases/:id with the mapped payload", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({
                data: mockReleaseDto,
                status: 200,
            });
            await service.update({ releaseId: 1, body: "Updated notes" });
            expect(mockRequest).toHaveBeenCalledWith(
                "/repos/test-owner/test-repo/releases/1",
                expect.objectContaining({ method: "PATCH" }),
            );
        });
    });

    describe("delete", () => {
        it("calls DELETE /repos/:owner/:repo/releases/:id", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({ data: null, status: 204 });
            await service.delete(1);
            expect(mockRequest).toHaveBeenCalledWith(
                "/repos/test-owner/test-repo/releases/1",
                { method: "DELETE" },
            );
        });
    });
});
