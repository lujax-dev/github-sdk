import {
    mapRepository,
    mapRepositories,
    mapActivityType,
    mapRepositoryActivity,
    mapRepositoryActivities,
    mapImmutableReleasesStatus,
    mapRepositoryTag,
    mapRepositoryTags,
    mapTeamPermissions,
    mapTeamParent,
    mapTeam,
    mapTeams,
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
    TeamPermissionsDTO,
    TeamParentDTO,
    TeamDTO,
} from "../../../../src/modules/repositories/repository.dto";
import { UserDTO } from "../../../../src/modules/users/user.dto";
import {
    CreateRepositoryParams,
    UpdateRepositoryParams,
    TransferRepositoryParams,
    CreateRepositoryFromTemplateParams,
} from "../../../../src/modules/repositories/repository.types";

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
    description: "A test repo",
    fork: false,
    url: "https://api.github.com/repos/testuser/test-repo",
    stargazers_count: 5,
    watchers_count: 5,
    forks_count: 1,
    open_issues_count: 2,
    language: "TypeScript",
    default_branch: "main",
    created_at: "2020-01-01T00:00:00Z",
    updated_at: "2020-01-02T00:00:00Z",
    pushed_at: "2020-01-03T00:00:00Z",
    size: 100,
    topics: ["typescript", "sdk"],
    visibility: "public",
};

describe("mapRepository", () => {
    it("maps a full DTO to a Repository, including topics", () => {
        const result = mapRepository(mockRepoDto);
        expect(result).toEqual({
            id: 1,
            nodeId: "R_1",
            name: "test-repo",
            fullName: "testuser/test-repo",
            private: false,
            owner: expect.objectContaining({ username: "testuser" }),
            url: "https://github.com/testuser/test-repo",
            description: "A test repo",
            fork: false,
            apiUrl: "https://api.github.com/repos/testuser/test-repo",
            stargazersCount: 5,
            watchersCount: 5,
            forksCount: 1,
            openIssuesCount: 2,
            language: "TypeScript",
            defaultBranch: "main",
            createdAt: "2020-01-01T00:00:00Z",
            updatedAt: "2020-01-02T00:00:00Z",
            pushedAt: "2020-01-03T00:00:00Z",
            size: 100,
            topics: ["typescript", "sdk"],
            visibility: "public",
        });
    });

    it("carries through an undefined topics field", () => {
        const { topics: _topics, ...withoutTopics } = mockRepoDto;
        const result = mapRepository(withoutTopics as RepositoryDTO);
        expect(result.topics).toBeUndefined();
    });
});

describe("mapRepositories", () => {
    it("maps an array of DTOs", () => {
        const result = mapRepositories([mockRepoDto, mockRepoDto]);
        expect(result).toHaveLength(2);
        expect(result[0].name).toBe("test-repo");
    });
});

describe("mapActivityType", () => {
    it.each([
        ["push", "push"],
        ["force_push", "forcePush"],
        ["branch_deletion", "branchDeletion"],
        ["branch_creation", "branchCreation"],
        ["pr_merge", "prMerge"],
        ["merge_queue_merge", "mergeQueueMerge"],
    ] as const)("maps %s to %s", (dto, expected) => {
        expect(mapActivityType(dto)).toBe(expected);
    });
});

describe("mapRepositoryActivity", () => {
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

    it("maps a full DTO, including the actor and a parsed timestamp", () => {
        const result = mapRepositoryActivity(mockActivityDto);
        expect(result.id).toBe(1);
        expect(result.nodeId).toBe("A_1");
        expect(result.before).toBe("abc123");
        expect(result.after).toBe("def456");
        expect(result.ref).toBe("refs/heads/main");
        expect(result.timestamp).toEqual(new Date("2024-01-01T00:00:00Z"));
        expect(result.activityType).toBe("push");
        expect(result.actor?.username).toBe("testuser");
    });

    it("maps a null actor to null", () => {
        const result = mapRepositoryActivity({
            ...mockActivityDto,
            actor: null,
        });
        expect(result.actor).toBeNull();
    });
});

describe("mapRepositoryActivities", () => {
    it("maps an array of activity DTOs", () => {
        const mockActivityDto: RepositoryActivityDTO = {
            id: 1,
            node_id: "A_1",
            before: "abc123",
            after: "def456",
            ref: "refs/heads/main",
            timestamp: "2024-01-01T00:00:00Z",
            activity_type: "push",
            actor: null,
        };
        const result = mapRepositoryActivities([
            mockActivityDto,
            mockActivityDto,
        ]);
        expect(result).toHaveLength(2);
    });
});

describe("mapImmutableReleasesStatus", () => {
    it("maps enabled and enforcedByOwner", () => {
        const dto: ImmutableReleasesStatusDTO = {
            enabled: true,
            enforced_by_owner: false,
        };
        expect(mapImmutableReleasesStatus(dto)).toEqual({
            enabled: true,
            enforcedByOwner: false,
        });
    });
});

describe("mapRepositoryTag / mapRepositoryTags", () => {
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

    it("maps a single tag DTO", () => {
        const result = mapRepositoryTag(mockTagDto);
        expect(result).toEqual({
            name: "v1.0.0",
            nodeId: "T_1",
            zipballUrl:
                "https://api.github.com/repos/testuser/test-repo/zipball/v1.0.0",
            tarballUrl:
                "https://api.github.com/repos/testuser/test-repo/tarball/v1.0.0",
            commit: {
                sha: "abc123",
                url: "https://api.github.com/repos/testuser/test-repo/commits/abc123",
            },
        });
    });

    it("maps an array of tag DTOs", () => {
        const result = mapRepositoryTags([mockTagDto, mockTagDto]);
        expect(result).toHaveLength(2);
    });
});

describe("mapTeamPermissions", () => {
    it("maps all permission flags", () => {
        const dto: TeamPermissionsDTO = {
            pull: true,
            triage: false,
            push: true,
            maintain: false,
            admin: false,
        };
        expect(mapTeamPermissions(dto)).toEqual(dto);
    });
});

describe("mapTeamParent", () => {
    it("maps a full team parent DTO", () => {
        const dto: TeamParentDTO = {
            id: 2,
            node_id: "T_2",
            url: "https://api.github.com/teams/2",
            members_url: "https://api.github.com/teams/2/members{/member}",
            name: "Everyone",
            description: "Whole org",
            permission: "pull",
            privacy: "closed",
            notification_setting: "notifications_enabled",
            html_url: "https://github.com/orgs/test-org/teams/everyone",
            repositories_url: "https://api.github.com/teams/2/repos",
            slug: "everyone",
            ldap_dn: "cn=everyone",
            type: "organization",
            organization_id: 10,
            enterprise_id: undefined,
        };
        const result = mapTeamParent(dto);
        expect(result).toEqual({
            id: 2,
            nodeId: "T_2",
            url: "https://api.github.com/teams/2",
            membersUrl: "https://api.github.com/teams/2/members{/member}",
            name: "Everyone",
            description: "Whole org",
            permission: "pull",
            privacy: "closed",
            notificationSetting: "notifications_enabled",
            htmlUrl: "https://github.com/orgs/test-org/teams/everyone",
            repositoriesUrl: "https://api.github.com/teams/2/repos",
            slug: "everyone",
            ldapDn: "cn=everyone",
            type: "organization",
            organizationId: 10,
            enterpriseId: undefined,
        });
    });
});

describe("mapTeam / mapTeams", () => {
    const baseTeamDto: TeamDTO = {
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

    it("maps a team with no permissions and no parent", () => {
        const result = mapTeam(baseTeamDto);
        expect(result.permissions).toBeUndefined();
        expect(result.parent).toBeNull();
        expect(result.name).toBe("Core");
    });

    it("maps a team with permissions and a parent present", () => {
        const dto: TeamDTO = {
            ...baseTeamDto,
            permissions: {
                pull: true,
                triage: true,
                push: true,
                maintain: false,
                admin: false,
            },
            parent: {
                id: 2,
                node_id: "T_2",
                url: "https://api.github.com/teams/2",
                members_url: "https://api.github.com/teams/2/members{/member}",
                name: "Everyone",
                description: null,
                permission: "pull",
                html_url: "https://github.com/orgs/test-org/teams/everyone",
                repositories_url: "https://api.github.com/teams/2/repos",
                slug: "everyone",
                type: "organization",
            },
        };
        const result = mapTeam(dto);
        expect(result.permissions).toEqual(dto.permissions);
        expect(result.parent?.name).toBe("Everyone");
    });

    it("maps an array of teams", () => {
        const result = mapTeams([baseTeamDto, baseTeamDto]);
        expect(result).toHaveLength(2);
    });
});

describe("mapCreateRepositoryParams", () => {
    it("maps camelCase params to the snake_case payload", () => {
        const params: CreateRepositoryParams = {
            name: "new-repo",
            description: "desc",
            homepage: "https://example.com",
            privateRepo: true,
            visibility: "private",
            hasIssues: true,
            hasProjects: false,
            hasWiki: false,
            hasDownloads: true,
            isTemplate: false,
            teamId: 5,
            autoInit: true,
            gitignoreTemplate: "Node",
            licenseTemplate: "mit",
            allowSquashMerge: true,
            allowMergeCommit: false,
            allowRebaseMerge: false,
            allowAutoMerge: true,
            deleteBranchOnMerge: true,
            squashMergeCommitTitle: "PR_TITLE",
            squashMergeCommitMessage: "BLANK",
            mergeCommitTitle: "PR_TITLE",
            mergeCommitMessage: "PR_BODY",
        };
        expect(mapCreateRepositoryParams(params)).toEqual({
            name: "new-repo",
            description: "desc",
            homepage: "https://example.com",
            private: true,
            visibility: "private",
            has_issues: true,
            has_projects: false,
            has_wiki: false,
            has_downloads: true,
            is_template: false,
            team_id: 5,
            auto_init: true,
            gitignore_template: "Node",
            license_template: "mit",
            allow_squash_merge: true,
            allow_merge_commit: false,
            allow_rebase_merge: false,
            allow_auto_merge: true,
            delete_branch_on_merge: true,
            squash_merge_commit_title: "PR_TITLE",
            squash_merge_commit_message: "BLANK",
            merge_commit_title: "PR_TITLE",
            merge_commit_message: "PR_BODY",
        });
    });
});

describe("mapUpdateRepositoryParams", () => {
    it("maps camelCase params to the snake_case payload, including update-only fields", () => {
        const params: UpdateRepositoryParams = {
            name: "renamed-repo",
            privateRepo: false,
            defaultBranch: "develop",
            archived: true,
            allowForking: true,
        };
        expect(mapUpdateRepositoryParams(params)).toEqual(
            expect.objectContaining({
                name: "renamed-repo",
                private: false,
                default_branch: "develop",
                archived: true,
                allow_forking: true,
            }),
        );
    });
});

describe("mapTransferRepositoryParams", () => {
    it("maps a transfer with only the required field", () => {
        const params: TransferRepositoryParams = { newOwner: "new-owner" };
        expect(mapTransferRepositoryParams(params)).toEqual({
            new_owner: "new-owner",
            new_name: undefined,
            team_ids: undefined,
        });
    });

    it("maps a transfer with all fields set", () => {
        const params: TransferRepositoryParams = {
            newOwner: "new-owner",
            newName: "new-name",
            teamsIds: [1, 2],
        };
        expect(mapTransferRepositoryParams(params)).toEqual({
            new_owner: "new-owner",
            new_name: "new-name",
            team_ids: [1, 2],
        });
    });
});

describe("mapCreateRepositoryFromTemplateParams", () => {
    it("maps template params, pulling fields out of options", () => {
        const params: CreateRepositoryFromTemplateParams = {
            templateOwner: "lujax-dev",
            templateRepo: "template-repo",
            owner: "lujax-dev",
            options: {
                name: "new-repo",
                description: "from a template",
                includeAllBranches: true,
                private: true,
            },
        };
        expect(mapCreateRepositoryFromTemplateParams(params)).toEqual({
            name: "new-repo",
            owner: "lujax-dev",
            description: "from a template",
            include_all_branches: true,
            private: true,
        });
    });

    it("maps template params with only the required options fields", () => {
        const params: CreateRepositoryFromTemplateParams = {
            templateOwner: "lujax-dev",
            templateRepo: "template-repo",
            options: { name: "new-repo" },
        };
        expect(mapCreateRepositoryFromTemplateParams(params)).toEqual({
            name: "new-repo",
            owner: undefined,
            description: undefined,
            include_all_branches: undefined,
            private: undefined,
        });
    });
});
