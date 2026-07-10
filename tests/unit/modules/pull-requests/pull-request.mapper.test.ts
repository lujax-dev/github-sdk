import {
    mapCreatePullRequestParams,
    mapMergePullRequestParams,
    mapPullRequestFile,
    mapPullRequestFiles,
    mapUpdatePullRequestParams,
} from "../../../../src/modules/pull-requests/pull-request.mapper";
import { PullRequestFileDTO } from "../../../../src/modules/pull-requests/pull-request.dto";

const mockFileDto: PullRequestFileDTO = {
    sha: "abc123",
    filename: "src/index.ts",
    status: "modified",
    additions: 12,
    deletions: 3,
    changes: 15,
    blob_url: "https://github.com/owner/repo/blob/abc123/src/index.ts",
    raw_url: "https://github.com/owner/repo/raw/abc123/src/index.ts",
    contents_url:
        "https://api.github.com/repos/owner/repo/contents/src/index.ts?ref=abc123",
    patch: "@@ -1 +1 @@",
};

describe("pull-request.mapper", () => {
    describe("mapPullRequestFile", () => {
        it("maps filename to name and snake_case urls to camelCase", () => {
            const result = mapPullRequestFile(mockFileDto);
            expect(result.name).toBe("src/index.ts");
            expect(result.status).toBe("modified");
            expect(result.blobUrl).toBe(mockFileDto.blob_url);
            expect(result.rawUrl).toBe(mockFileDto.raw_url);
            expect(result.changes).toBe(15);
        });

        it("keeps a null patch (large or binary files)", () => {
            const result = mapPullRequestFile({ ...mockFileDto, patch: null });
            expect(result.patch).toBeNull();
        });
    });

    describe("mapPullRequestFiles", () => {
        it("maps an array of files", () => {
            const result = mapPullRequestFiles([
                mockFileDto,
                { ...mockFileDto, filename: "README.md" },
            ]);
            expect(result).toHaveLength(2);
            expect(result[1].name).toBe("README.md");
        });

        it("maps an empty array to an empty array", () => {
            expect(mapPullRequestFiles([])).toEqual([]);
        });
    });

    describe("mapCreatePullRequestParams", () => {
        it("maps camelCase params to the snake_case payload", () => {
            const result = mapCreatePullRequestParams({
                title: "Cool new feature",
                head: "user:dev",
                base: "main",
                headRepo: "user/repo",
                maintainerCanModify: true,
                draft: false,
            });
            expect(result).toEqual({
                title: "Cool new feature",
                head: "user:dev",
                base: "main",
                head_repo: "user/repo",
                body: undefined,
                maintainer_can_modify: true,
                draft: false,
                issue: undefined,
            });
        });
    });

    describe("mapUpdatePullRequestParams", () => {
        it("maps maintainerCanModify to maintainer_can_modify", () => {
            const result = mapUpdatePullRequestParams({
                pullNumber: 8,
                title: "new title",
                state: "closed",
                maintainerCanModify: false,
            });
            expect(result.title).toBe("new title");
            expect(result.state).toBe("closed");
            expect(result.maintainer_can_modify).toBe(false);
        });
    });

    describe("mapMergePullRequestParams", () => {
        it("maps camelCase merge params to the snake_case payload", () => {
            const result = mapMergePullRequestParams({
                pullNumber: 8,
                commitTitle: "Expand docs",
                commitMessage: "Add docs for new methods",
                sha: "abc123",
                mergeMethod: "squash",
            });
            expect(result).toEqual({
                commit_title: "Expand docs",
                commit_message: "Add docs for new methods",
                sha: "abc123",
                merge_method: "squash",
            });
        });
    });
});
