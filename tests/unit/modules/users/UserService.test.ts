import { GithubClient } from "../../../../src/client/GithubClient";
import { UserService } from "../../../../src/modules/users/UserService";
import { UserDTO } from "../../../../src/modules/users/user.dto";

const mockUserDto: UserDTO = {
    login: "testuser",
    id: 1,
    node_id: "U_1",
    avatar_url: "https://example.com/avatar.png",
    html_url: "https://github.com/testuser",
    url: "https://api.github.com/users/testuser",
    type: "User",
    site_admin: false,
    name: "Test User",
    company: null,
    blog: null,
    location: null,
    email: null,
    bio: null,
    twitter_username: null,
    public_repos: 5,
    public_gists: 0,
    followers: 10,
    following: 3,
    created_at: "2020-01-01T00:00:00Z",
    updated_at: "2021-01-01T00:00:00Z",
};

function makeService() {
    const mockRequest = jest.fn();
    const client = {
        config: { token: "test-token" },
        request: mockRequest,
        baseUrl: "https://api.github.com",
    } as unknown as GithubClient;
    return { service: new UserService(client), mockRequest };
}

describe("UserService", () => {
    describe("getAuthenticated", () => {
        it("calls GET /user", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({ data: mockUserDto, status: 200 });
            await service.getAuthenticated();
            expect(mockRequest).toHaveBeenCalledWith("/user");
        });

        it("returns mapped User", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({ data: mockUserDto, status: 200 });
            const result = await service.getAuthenticated();
            expect(result.username).toBe("testuser");
            expect(result.id).toBe(1);
        });
    });

    describe("updateAuthenticated", () => {
        it("calls PATCH /user, not /users", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({ data: mockUserDto, status: 200 });
            await service.updateAuthenticated({ name: "New Name" });
            expect(mockRequest).toHaveBeenCalledWith(
                "/user",
                expect.objectContaining({ method: "PATCH" }),
            );
        });

        it("returns mapped updated User", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({ data: mockUserDto, status: 200 });
            const result = await service.updateAuthenticated({ name: "New Name" });
            expect(result.username).toBe("testuser");
        });
    });

    describe("getById", () => {
        it("calls GET /users/:id", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({ data: mockUserDto, status: 200 });
            await service.getById(42);
            expect(mockRequest).toHaveBeenCalledWith("/users/42");
        });
    });

    describe("list", () => {
        it("calls GET /users, not /user", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({ data: [mockUserDto], status: 200 });
            await service.list();
            expect(mockRequest).toHaveBeenCalledWith("/users");
        });

        it("returns an array of mapped Users", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({ data: [mockUserDto], status: 200 });
            const result = await service.list();
            expect(Array.isArray(result)).toBe(true);
            expect(result[0].username).toBe("testuser");
        });
    });

    describe("getByUsername", () => {
        it("calls GET /users/:username, not /user/:username", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({ data: mockUserDto, status: 200 });
            await service.getByUsername("lewie");
            expect(mockRequest).toHaveBeenCalledWith("/users/lewie");
        });

        it("returns mapped User", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({ data: mockUserDto, status: 200 });
            const result = await service.getByUsername("lewie");
            expect(result.username).toBe("testuser");
        });
    });
});
