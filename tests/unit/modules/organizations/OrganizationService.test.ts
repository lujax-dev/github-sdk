import { GithubClient } from "../../../../src/client/GithubClient";
import { OrganizationService } from "../../../../src/modules/organizations/OrganizationService";
import { GithubApiError } from "../../../../src/shared/errors/GithubApiError";
import {
    OrganizationDto,
    SimpleOrganizationDto,
    OrgMembershipDto,
} from "../../../../src/modules/organizations/organization.dto";
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

const mockSimpleOrgDto: SimpleOrganizationDto = {
    id: 1,
    login: "lujax-dev",
    avatar_url: "",
    description: null,
    url: "https://api.github.com/orgs/lujax-dev",
};

const mockOrgDto: OrganizationDto = {
    ...mockSimpleOrgDto,
    node_id: "O_1",
    public_repos: 1,
    public_gists: 0,
    followers: 0,
    following: 0,
    html_url: "https://github.com/lujax-dev",
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
};

const mockMembershipDto: OrgMembershipDto = {
    url: "https://api.github.com/orgs/lujax-dev/memberships/testuser",
    state: "active",
    role: "admin",
    organization_url: "https://api.github.com/orgs/lujax-dev",
    organization: mockSimpleOrgDto,
    user: mockUserDto,
};

function makeService() {
    const mockRequest = jest.fn();
    const client = {
        config: { token: "test-token", org: "lujax-dev" },
        request: mockRequest,
        baseUrl: "https://api.github.com",
    } as unknown as GithubClient;
    return { service: new OrganizationService(client), mockRequest };
}

describe("OrganizationService", () => {
    describe("get", () => {
        it("calls GET /orgs/:org", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({ data: mockOrgDto, status: 200 });
            await service.get();
            expect(mockRequest).toHaveBeenCalledWith("/orgs/lujax-dev");
        });

        it("returns a mapped Organization", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({ data: mockOrgDto, status: 200 });
            const result = await service.get();
            expect(result.login).toBe("lujax-dev");
        });
    });

    describe("update", () => {
        it("calls PATCH /orgs/:org with the mapped payload", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({ data: mockOrgDto, status: 200 });
            await service.update({ description: "New description" });
            expect(mockRequest).toHaveBeenCalledWith(
                "/orgs/lujax-dev",
                expect.objectContaining({ method: "PATCH" }),
            );
        });
    });

    describe("list", () => {
        it("calls GET /organizations", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({
                data: [mockSimpleOrgDto],
                status: 200,
            });
            const result = await service.list();
            expect(mockRequest).toHaveBeenCalledWith("/organizations");
            expect(result).toHaveLength(1);
        });
    });

    describe("listForUser", () => {
        it("calls GET /users/:username/orgs", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({
                data: [mockSimpleOrgDto],
                status: 200,
            });
            await service.listForUser("LewieJ08");
            expect(mockRequest).toHaveBeenCalledWith("/users/LewieJ08/orgs");
        });
    });

    describe("listForAuthenticatedUser", () => {
        it("calls GET /user/orgs", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({
                data: [mockSimpleOrgDto],
                status: 200,
            });
            await service.listForAuthenticatedUser();
            expect(mockRequest).toHaveBeenCalledWith("/user/orgs");
        });
    });

    describe("listMembers", () => {
        it("calls GET /orgs/:org/members", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({
                data: [mockUserDto],
                status: 200,
            });
            const result = await service.listMembers();
            expect(mockRequest).toHaveBeenCalledWith("/orgs/lujax-dev/members");
            expect(result[0].username).toBe("testuser");
        });
    });

    describe("checkMembership", () => {
        it("returns true on 204", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({ data: null, status: 204 });
            const result = await service.checkMembership("testuser");
            expect(mockRequest).toHaveBeenCalledWith(
                "/orgs/lujax-dev/members/testuser",
            );
            expect(result).toBe(true);
        });

        it("returns false on 404", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockRejectedValue(new GithubApiError(404, "Not Found"));
            const result = await service.checkMembership("testuser");
            expect(result).toBe(false);
        });

        it("rethrows non-404 GithubApiErrors", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockRejectedValue(
                new GithubApiError(500, "Server error"),
            );
            await expect(service.checkMembership("testuser")).rejects.toThrow(
                GithubApiError,
            );
        });
    });

    describe("removeMember", () => {
        it("calls DELETE /orgs/:org/members/:username", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({ data: null, status: 204 });
            const result = await service.removeMember("testuser");
            expect(mockRequest).toHaveBeenCalledWith(
                "/orgs/lujax-dev/members/testuser",
                { method: "DELETE" },
            );
            expect(result).toBe(true);
        });
    });

    describe("getMembershipForUser", () => {
        it("calls GET /orgs/:org/memberships/:username", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({
                data: mockMembershipDto,
                status: 200,
            });
            const result = await service.getMembershipForUser("testuser");
            expect(mockRequest).toHaveBeenCalledWith(
                "/orgs/lujax-dev/memberships/testuser",
            );
            expect(result.role).toBe("admin");
        });
    });

    describe("updateMembershipForUser", () => {
        it("calls PUT /orgs/:org/memberships/:username with the mapped payload", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({
                data: mockMembershipDto,
                status: 200,
            });
            await service.updateMembershipForUser("testuser", {
                role: "admin",
            });
            expect(mockRequest).toHaveBeenCalledWith(
                "/orgs/lujax-dev/memberships/testuser",
                {
                    method: "PUT",
                    body: JSON.stringify({ role: "admin" }),
                },
            );
        });
    });

    describe("removeMembershipForUser", () => {
        it("calls DELETE /orgs/:org/memberships/:username", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({ data: null, status: 204 });
            const result = await service.removeMembershipForUser("testuser");
            expect(mockRequest).toHaveBeenCalledWith(
                "/orgs/lujax-dev/memberships/testuser",
                { method: "DELETE" },
            );
            expect(result).toBe(true);
        });
    });
});
