import { GithubClient } from "../../../../src/client/GithubClient";
import { RepositoryService } from "../../../../src/modules/repositories/RepositoryService";
import {
    mapCreateRepositoryParams,
    mapUpdateRepositoryParams,
    mapTransferRepositoryParams,
    mapCreateRepositoryFromTemplateParams,
} from "../../../../src/modules/repositories/repository.mapper";
import {
    RepositoryDTO,
    RepositoryActivityDTO,
    ImmutableReleasesStatusDTO,
    RepositoryTagDTO,
    TeamDTO,
} from "../../../../src/modules/repositories/repository.dto";
import { CodeownersErrorsResponse } from "../../../../src/modules/repositories/repository.types";
import {
    UserDTO,
    ContributorDTO,
} from "../../../../src/modules/users/user.dto";

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

const mockActivityDto: RepositoryActivityDTO = {
    id: 1,
    node_id: "A_1",
    before: "abc123",
    after: "def456",
    ref: "refs/heads/main",
    timestamp: "2024-01-01T00:00:00Z",
    activity_type: "push",
    actor: mockUserDto,
};

const mockImmutableStatusDto: ImmutableReleasesStatusDTO = {
    enabled: true,
    enforced_by_owner: false,
};

const mockTagDto: RepositoryTagDTO = {
    name: "v1.0.0",
    node_id: "T_1",
    zipball_url:
        "https://api.github.com/repos/testuser/test-repo/zipball/v1.0.0",
    tarball_url:
        "https://api.github.com/repos/testuser/test-repo/tarball/v1.0.0",
    commit: {
        sha: "abc123",
        url: "https://api.github.com/repos/testuser/test-repo/commits/abc123",
    },
};

const mockTeamDto: TeamDTO = {
    id: 1,
    node_id: "T_1",
    name: "Core",
    slug: "core",
    description: null,
    permission: "push",
    url: "https://api.github.com/teams/1",
    html_url: "https://github.com/orgs/test-org/teams/core",
    members_url: "https://api.github.com/teams/1/members{/member}",
    repositories_url: "https://api.github.com/teams/1/repos",
    type: "organization",
    parent: null,
};

const mockContributorDto: ContributorDTO = {
    ...mockUserDto,
    contributions: 42,
};

const mockCodeownersErrorsResponse: CodeownersErrorsResponse = {
    errors: [
        {
            line: 1,
            column: 1,
            kind: "Invalid pattern",
            message: "Invalid path",
            path: "CODEOWNERS",
        },
    ],
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
    describe("listForOrg", () => {
        it("calls GET /orgs/:org/repos and returns mapped repositories", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({ data: [mockRepoDto], status: 200 });
            const result = await service.listForOrg();
            expect(mockRequest).toHaveBeenCalledWith("/orgs/test-org/repos");
            expect(result[0].name).toBe("test-repo");
        });
    });

    describe("createForOrg", () => {
        it("calls POST /orgs/:org/repos with the mapped payload", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({ data: mockRepoDto, status: 201 });
            const params = { name: "new-org-repo", privateRepo: false };
            const result = await service.createForOrg(params);
            expect(mockRequest).toHaveBeenCalledWith("/orgs/test-org/repos", {
                method: "POST",
                body: JSON.stringify(mapCreateRepositoryParams(params)),
            });
            expect(result.name).toBe("test-repo");
        });
    });

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

    describe("update", () => {
        it("calls PATCH /repos/:owner/:repo with the mapped payload", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({ data: mockRepoDto, status: 200 });
            const params = { name: "renamed", privateRepo: true };
            const result = await service.update(params);
            expect(mockRequest).toHaveBeenCalledWith(
                "/repos/test-owner/test-repo",
                {
                    method: "PATCH",
                    body: JSON.stringify(mapUpdateRepositoryParams(params)),
                },
            );
            expect(result.name).toBe("test-repo");
        });
    });

    describe("delete", () => {
        it("calls DELETE /repos/:owner/:repo and returns true on 204", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({ data: null, status: 204 });
            const result = await service.delete();
            expect(mockRequest).toHaveBeenCalledWith(
                "/repos/test-owner/test-repo",
                { method: "DELETE" },
            );
            expect(result).toBe(true);
        });

        it("returns false when the status is not 204", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({ data: null, status: 202 });
            const result = await service.delete();
            expect(result).toBe(false);
        });
    });

    describe("listActivities", () => {
        it("calls GET /repos/:owner/:repo/activity and returns mapped activities", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({
                data: [mockActivityDto],
                status: 200,
            });
            const result = await service.listActivities();
            expect(mockRequest).toHaveBeenCalledWith(
                "/repos/test-owner/test-repo/activity",
            );
            expect(result[0].activityType).toBe("push");
        });
    });

    describe("getDependabotSecurityUpdatesStatus", () => {
        it("calls GET .../automated-security-fixes and returns the raw status", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({
                data: { enabled: true, paused: false },
                status: 200,
            });
            const result = await service.getDependabotSecurityUpdatesStatus();
            expect(mockRequest).toHaveBeenCalledWith(
                "/repos/test-owner/test-repo/automated-security-fixes",
            );
            expect(result).toEqual({ enabled: true, paused: false });
        });
    });

    describe("enableDependabotSecurityUpdates", () => {
        it("calls PUT .../automated-security-fixes and returns true on 204", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({ data: null, status: 204 });
            const result = await service.enableDependabotSecurityUpdates();
            expect(mockRequest).toHaveBeenCalledWith(
                "/repos/test-owner/test-repo/automated-security-fixes",
                { method: "PUT" },
            );
            expect(result).toBe(true);
        });
    });

    describe("disableDependabotSecurityUpdates", () => {
        it("calls DELETE .../automated-security-fixes and returns true on 204", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({ data: null, status: 204 });
            const result = await service.disableDependabotSecurityUpdates();
            expect(mockRequest).toHaveBeenCalledWith(
                "/repos/test-owner/test-repo/automated-security-fixes",
                { method: "DELETE" },
            );
            expect(result).toBe(true);
        });
    });

    describe("getCodeownersErrors", () => {
        it("calls GET .../codeowners/errors and returns the errors array", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({
                data: mockCodeownersErrorsResponse,
                status: 200,
            });
            const result = await service.getCodeownersErrors();
            expect(mockRequest).toHaveBeenCalledWith(
                "/repos/test-owner/test-repo/codeowners/errors",
            );
            expect(result).toEqual(mockCodeownersErrorsResponse.errors);
        });
    });

    describe("getContributors", () => {
        it("calls GET .../contributors and returns mapped contributors", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({
                data: [mockContributorDto],
                status: 200,
            });
            const result = await service.getContributors();
            expect(mockRequest).toHaveBeenCalledWith(
                "/repos/test-owner/test-repo/contributors",
            );
            expect(result[0].contributions).toBe(42);
        });
    });

    describe("createDispatchEvent", () => {
        it("calls POST .../dispatches with the event type and returns true on 204", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({ data: null, status: 204 });
            const result = await service.createDispatchEvent("on-demand-test");
            expect(mockRequest).toHaveBeenCalledWith(
                "/repos/test-owner/test-repo/dispatches",
                {
                    method: "POST",
                    body: JSON.stringify({ event_type: "on-demand-test" }),
                },
            );
            expect(result).toBe(true);
        });
    });

    describe("getImmutableReleasesStatus", () => {
        it("calls GET .../immutable-releases and returns the mapped status", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({
                data: mockImmutableStatusDto,
                status: 200,
            });
            const result = await service.getImmutableReleasesStatus();
            expect(mockRequest).toHaveBeenCalledWith(
                "/repos/test-owner/test-repo/immutable-releases",
            );
            expect(result).toEqual({ enabled: true, enforcedByOwner: false });
        });
    });

    describe("enableImmutableReleases", () => {
        it("calls PUT .../immutable-releases and returns true on 204", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({ data: null, status: 204 });
            const result = await service.enableImmutableReleases();
            expect(mockRequest).toHaveBeenCalledWith(
                "/repos/test-owner/test-repo/immutable-releases",
                { method: "PUT" },
            );
            expect(result).toBe(true);
        });
    });

    describe("disableImmutableReleases", () => {
        it("calls DELETE .../immutable-releases and returns true on 204", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({ data: null, status: 204 });
            const result = await service.disableImmutableReleases();
            expect(mockRequest).toHaveBeenCalledWith(
                "/repos/test-owner/test-repo/immutable-releases",
                { method: "DELETE" },
            );
            expect(result).toBe(true);
        });
    });

    describe("listLanguages", () => {
        it("calls GET .../languages and returns the raw language map", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({
                data: { TypeScript: 1000, JavaScript: 200 },
                status: 200,
            });
            const result = await service.listLanguages();
            expect(mockRequest).toHaveBeenCalledWith(
                "/repos/test-owner/test-repo/languages",
            );
            expect(result).toEqual({ TypeScript: 1000, JavaScript: 200 });
        });
    });

    describe("getPrivateVulnerabilityReportingStatus", () => {
        it("calls GET .../private-vulnerability-reporting and returns true when enabled", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({
                data: { enabled: true },
                status: 200,
            });
            const result =
                await service.getPrivateVulnerabilityReportingStatus();
            expect(mockRequest).toHaveBeenCalledWith(
                "/repos/test-owner/test-repo/private-vulnerability-reporting",
            );
            expect(result).toBe(true);
        });

        it("returns false when disabled", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({
                data: { enabled: false },
                status: 200,
            });
            const result =
                await service.getPrivateVulnerabilityReportingStatus();
            expect(result).toBe(false);
        });
    });

    describe("enablePrivateVulnerabilityReporting", () => {
        it("calls PUT .../private-vulnerability-reporting and returns true on 204", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({ data: null, status: 204 });
            const result = await service.enablePrivateVulnerabilityReporting();
            expect(mockRequest).toHaveBeenCalledWith(
                "/repos/test-owner/test-repo/private-vulnerability-reporting",
                { method: "PUT" },
            );
            expect(result).toBe(true);
        });
    });

    describe("disablePrivateVulnerabilityReporting", () => {
        it("calls DELETE .../private-vulnerability-reporting and returns true on 204", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({ data: null, status: 204 });
            const result = await service.disablePrivateVulnerabilityReporting();
            expect(mockRequest).toHaveBeenCalledWith(
                "/repos/test-owner/test-repo/private-vulnerability-reporting",
                { method: "DELETE" },
            );
            expect(result).toBe(true);
        });
    });

    describe("listTags", () => {
        it("calls GET .../tags and returns mapped tags", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({
                data: [mockTagDto],
                status: 200,
            });
            const result = await service.listTags();
            expect(mockRequest).toHaveBeenCalledWith(
                "/repos/test-owner/test-repo/tags",
            );
            expect(result[0].name).toBe("v1.0.0");
        });
    });

    describe("listTeams", () => {
        it("calls GET .../teams and returns mapped teams", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({
                data: [mockTeamDto],
                status: 200,
            });
            const result = await service.listTeams();
            expect(mockRequest).toHaveBeenCalledWith(
                "/repos/test-owner/test-repo/teams",
            );
            expect(result[0].slug).toBe("core");
        });
    });

    describe("getTopics", () => {
        it("calls GET .../topics and returns the topic names", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({
                data: { names: ["api", "github"] },
                status: 200,
            });
            const result = await service.getTopics();
            expect(mockRequest).toHaveBeenCalledWith(
                "/repos/test-owner/test-repo/topics",
            );
            expect(result).toEqual(["api", "github"]);
        });
    });

    describe("replaceTopics", () => {
        it("calls PUT .../topics with the new topic names", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({
                data: { names: ["api", "github"] },
                status: 200,
            });
            const result = await service.replaceTopics(["api", "github"]);
            expect(mockRequest).toHaveBeenCalledWith(
                "/repos/test-owner/test-repo/topics",
                {
                    method: "PUT",
                    body: JSON.stringify({ names: ["api", "github"] }),
                },
            );
            expect(result).toEqual(["api", "github"]);
        });
    });

    describe("transfer", () => {
        it("calls POST .../transfer with the mapped payload", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({ data: mockRepoDto, status: 202 });
            const params = { newOwner: "new-owner" };
            const result = await service.transfer(params);
            expect(mockRequest).toHaveBeenCalledWith(
                "/repos/test-owner/test-repo/transfer",
                {
                    method: "POST",
                    body: JSON.stringify(mapTransferRepositoryParams(params)),
                },
            );
            expect(result.name).toBe("test-repo");
        });
    });

    describe("getVulnerabilityAlertsStatus", () => {
        it("calls GET .../vulnerability-alerts and returns true on 204", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({ data: null, status: 204 });
            const result = await service.getVulnerabilityAlertsStatus();
            expect(mockRequest).toHaveBeenCalledWith(
                "/repos/test-owner/test-repo/vulnerability-alerts",
            );
            expect(result).toBe(true);
        });

        it("returns false when not enabled", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({ data: null, status: 404 });
            const result = await service.getVulnerabilityAlertsStatus();
            expect(result).toBe(false);
        });
    });

    describe("enableVulnerabilityAlerts", () => {
        it("calls PUT .../vulnerability-alerts and returns true on 204", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({ data: null, status: 204 });
            const result = await service.enableVulnerabilityAlerts();
            expect(mockRequest).toHaveBeenCalledWith(
                "/repos/test-owner/test-repo/vulnerability-alerts",
                { method: "PUT" },
            );
            expect(result).toBe(true);
        });
    });

    describe("disableVulnerabilityAlerts", () => {
        it("calls DELETE .../vulnerability-alerts and returns true on 204", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({ data: null, status: 204 });
            const result = await service.disableVulnerabilityAlerts();
            expect(mockRequest).toHaveBeenCalledWith(
                "/repos/test-owner/test-repo/vulnerability-alerts",
                { method: "DELETE" },
            );
            expect(result).toBe(true);
        });
    });

    describe("createFromTemplate", () => {
        it("calls POST /repos/:templateOwner/:templateRepo/generate with the mapped payload", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({ data: mockRepoDto, status: 201 });
            const params = {
                templateOwner: "lujax-dev",
                templateRepo: "template-repo",
                owner: "lujax-dev",
                options: { name: "new-repo" },
            };
            const result = await service.createFromTemplate(params);
            expect(mockRequest).toHaveBeenCalledWith(
                "/repos/lujax-dev/template-repo/generate",
                {
                    method: "POST",
                    body: JSON.stringify(
                        mapCreateRepositoryFromTemplateParams(params),
                    ),
                },
            );
            expect(result.name).toBe("test-repo");
        });
    });

    describe("listPublic", () => {
        it("calls GET /repositories and returns mapped repositories", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({
                data: [mockRepoDto],
                status: 200,
            });
            const result = await service.listPublic();
            expect(mockRequest).toHaveBeenCalledWith("/repositories");
            expect(result[0].name).toBe("test-repo");
        });
    });

    describe("list", () => {
        it("calls GET /user/repos and returns mapped repositories", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({
                data: [mockRepoDto],
                status: 200,
            });
            const result = await service.list();
            expect(mockRequest).toHaveBeenCalledWith("/user/repos");
            expect(result[0].name).toBe("test-repo");
        });
    });

    describe("create", () => {
        it("calls POST /user/repos with the mapped payload", async () => {
            const { service, mockRequest } = makeService();
            mockRequest.mockResolvedValue({ data: mockRepoDto, status: 201 });
            const params = { name: "new-repo", privateRepo: false };
            const result = await service.create(params);
            expect(mockRequest).toHaveBeenCalledWith("/user/repos", {
                method: "POST",
                body: JSON.stringify(mapCreateRepositoryParams(params)),
            });
            expect(result.name).toBe("test-repo");
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
