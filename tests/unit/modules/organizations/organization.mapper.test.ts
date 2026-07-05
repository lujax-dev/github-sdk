import {
    mapSimpleOrganization,
    mapOrganization,
    mapSimpleOrganizations,
    mapUpdateOrganizationParams,
    mapOrgMembership,
    mapUpdateOrgMembershipParams,
} from "../../../../src/modules/organizations/organization.mapper";
import {
    SimpleOrganizationDto,
    OrganizationDto,
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
    avatar_url: "https://avatars.githubusercontent.com/u/1",
    description: "Developer tools, done right",
    url: "https://api.github.com/orgs/lujax-dev",
};

const mockOrgDto: OrganizationDto = {
    ...mockSimpleOrgDto,
    node_id: "O_1",
    name: "Lujax",
    company: undefined,
    blog: "https://lujax.dev",
    location: "London, UK",
    email: "hello@lujax.dev",
    twitter_username: null,
    is_verified: false,
    public_repos: 1,
    public_gists: 0,
    followers: 0,
    following: 0,
    html_url: "https://github.com/lujax-dev",
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
    archived_at: null,
};

describe("organization.mapper", () => {
    describe("mapSimpleOrganization", () => {
        it("maps avatar_url to avatarUrl", () => {
            const result = mapSimpleOrganization(mockSimpleOrgDto);
            expect(result.avatarUrl).toBe(mockSimpleOrgDto.avatar_url);
            expect(result.login).toBe("lujax-dev");
        });
    });

    describe("mapOrganization", () => {
        it("maps snake_case fields to camelCase", () => {
            const result = mapOrganization(mockOrgDto);
            expect(result.nodeId).toBe("O_1");
            expect(result.twitterUsername).toBeNull();
            expect(result.isVerified).toBe(false);
            expect(result.htmlUrl).toBe("https://github.com/lujax-dev");
            expect(result.archivedAt).toBeNull();
        });
    });

    describe("mapSimpleOrganizations", () => {
        it("maps an array of organizations", () => {
            const result = mapSimpleOrganizations([mockSimpleOrgDto]);
            expect(result).toHaveLength(1);
            expect(result[0].login).toBe("lujax-dev");
        });
    });

    describe("mapUpdateOrganizationParams", () => {
        it("maps camelCase params to snake_case payload", () => {
            const result = mapUpdateOrganizationParams({
                billingEmail: "billing@lujax.dev",
                defaultRepositoryPermission: "read",
                membersCanCreateRepositories: false,
            });
            expect(result.billing_email).toBe("billing@lujax.dev");
            expect(result.default_repository_permission).toBe("read");
            expect(result.members_can_create_repositories).toBe(false);
        });
    });

    describe("mapOrgMembership", () => {
        it("maps a membership DTO to camelCase", () => {
            const dto: OrgMembershipDto = {
                url: "https://api.github.com/orgs/lujax-dev/memberships/testuser",
                state: "active",
                role: "admin",
                organization_url: "https://api.github.com/orgs/lujax-dev",
                organization: mockSimpleOrgDto,
                user: mockUserDto,
            };
            const result = mapOrgMembership(dto);
            expect(result.organizationUrl).toBe(dto.organization_url);
            expect(result.role).toBe("admin");
            expect(result.state).toBe("active");
            expect(result.user.username).toBe("testuser");
            expect(result.organization.login).toBe("lujax-dev");
        });
    });

    describe("mapUpdateOrgMembershipParams", () => {
        it("passes role through", () => {
            const result = mapUpdateOrgMembershipParams({ role: "member" });
            expect(result.role).toBe("member");
        });
    });
});
