import {
    mapCommit,
    mapCommits,
} from "../../../../src/modules/commits/commit.mapper";
import { CommitDTO } from "../../../../src/modules/commits/commit.dto";
import { UserDTO } from "../../../../src/modules/users/user.dto";

const mockUserDto: UserDTO = {
    login: "octocat",
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

const mockCommitDto: CommitDTO = {
    sha: "abc123",
    node_id: "C_1",
    commit: {
        author: {
            name: "Mona Lisa",
            email: "mona@example.com",
            date: "2024-01-01T10:00:00Z",
        },
        committer: {
            name: "GitHub",
            email: "noreply@github.com",
            date: "2024-01-02T10:00:00Z",
        },
        message: "fix: handle null user",
        tree: {
            sha: "tree123",
            url: "https://api.github.com/repos/owner/repo/git/trees/tree123",
        },
        url: "https://api.github.com/repos/owner/repo/git/commits/abc123",
        comment_count: 2,
        verification: {
            verified: false,
            reason: "unsigned",
            signature: null,
            payload: null,
        },
    },
    url: "https://api.github.com/repos/owner/repo/commits/abc123",
    html_url: "https://github.com/owner/repo/commit/abc123",
    author: mockUserDto,
    committer: mockUserDto,
    parents: [
        {
            sha: "parent1",
            url: "https://api.github.com/repos/owner/repo/commits/parent1",
            html_url: "https://github.com/owner/repo/commit/parent1",
        },
    ],
};

describe("commit.mapper", () => {
    describe("mapCommit", () => {
        it("maps snake_case DTO fields to camelCase", () => {
            const result = mapCommit(mockCommitDto);
            expect(result.sha).toBe("abc123");
            expect(result.nodeId).toBe("C_1");
            expect(result.message).toBe("fix: handle null user");
            expect(result.commentCount).toBe(2);
        });

        it("uses html_url for url, not the API url", () => {
            const result = mapCommit(mockCommitDto);
            expect(result.url).toBe(
                "https://github.com/owner/repo/commit/abc123",
            );
        });

        it("converts author and committer dates to Date instances", () => {
            const result = mapCommit(mockCommitDto);
            expect(result.author.date).toBeInstanceOf(Date);
            expect(result.author.date.toISOString()).toBe(
                "2024-01-01T10:00:00.000Z",
            );
            expect(result.committer.date).toBeInstanceOf(Date);
            expect(result.committer.date.toISOString()).toBe(
                "2024-01-02T10:00:00.000Z",
            );
        });

        it("maps the GitHub user onto author and committer when present", () => {
            const result = mapCommit(mockCommitDto);
            expect(result.author.user?.username).toBe("octocat");
            expect(result.committer.user?.username).toBe("octocat");
        });

        it("maps author.user to null when the commit author has no GitHub account", () => {
            const result = mapCommit({ ...mockCommitDto, author: null });
            expect(result.author.user).toBeNull();
            // The git-level identity is still there.
            expect(result.author.name).toBe("Mona Lisa");
            expect(result.author.email).toBe("mona@example.com");
        });

        it("maps committer.user to null when the committer has no GitHub account", () => {
            const result = mapCommit({ ...mockCommitDto, committer: null });
            expect(result.committer.user).toBeNull();
            expect(result.committer.name).toBe("GitHub");
        });

        it("takes verified from the verification block", () => {
            expect(mapCommit(mockCommitDto).verified).toBe(false);
            const signed: CommitDTO = {
                ...mockCommitDto,
                commit: {
                    ...mockCommitDto.commit,
                    verification: {
                        verified: true,
                        reason: "valid",
                        signature: "-----BEGIN PGP SIGNATURE-----",
                        payload: "tree tree123",
                    },
                },
            };
            expect(mapCommit(signed).verified).toBe(true);
        });

        it("maps parents to their shas", () => {
            const merge: CommitDTO = {
                ...mockCommitDto,
                parents: [
                    ...mockCommitDto.parents,
                    {
                        sha: "parent2",
                        url: "https://api.github.com/repos/owner/repo/commits/parent2",
                        html_url:
                            "https://github.com/owner/repo/commit/parent2",
                    },
                ],
            };
            expect(mapCommit(merge).parentShas).toEqual(["parent1", "parent2"]);
        });

        it("maps a root commit (no parents) to an empty array", () => {
            const root = mapCommit({ ...mockCommitDto, parents: [] });
            expect(root.parentShas).toEqual([]);
        });
    });

    describe("mapCommits", () => {
        it("maps an array of commits", () => {
            const result = mapCommits([
                mockCommitDto,
                { ...mockCommitDto, sha: "def456" },
            ]);
            expect(result).toHaveLength(2);
            expect(result[1].sha).toBe("def456");
        });

        it("maps an empty array to an empty array", () => {
            expect(mapCommits([])).toEqual([]);
        });
    });
});
