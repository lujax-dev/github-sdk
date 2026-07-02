import {
    mapRelease,
    mapReleases,
    mapReleaseAsset,
    mapCreateReleaseParams,
    mapUpdateReleaseParams,
} from "../../../../src/modules/releases/release.mapper";
import {
    ReleaseDTO,
    ReleaseAssetDTO,
} from "../../../../src/modules/releases/release.dto";
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

const mockAssetDto: ReleaseAssetDTO = {
    id: 1,
    node_id: "RA_1",
    name: "release.zip",
    label: null,
    content_type: "application/zip",
    size: 1024,
    download_count: 5,
    url: "https://api.github.com/repos/owner/repo/releases/assets/1",
    browser_download_url:
        "https://github.com/owner/repo/releases/download/v1.0.0/release.zip",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
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
    assets: [mockAssetDto],
    html_url: "https://github.com/owner/repo/releases/tag/v1.0.0",
    url: "https://api.github.com/repos/owner/repo/releases/1",
    tarball_url: "https://api.github.com/repos/owner/repo/tarball/v1.0.0",
    zipball_url: "https://api.github.com/repos/owner/repo/zipball/v1.0.0",
    created_at: "2024-01-01T00:00:00Z",
    published_at: "2024-01-02T00:00:00Z",
};

describe("release.mapper", () => {
    describe("mapReleaseAsset", () => {
        it("maps browser_download_url to downloadUrl", () => {
            const result = mapReleaseAsset(mockAssetDto);
            expect(result.downloadUrl).toBe(mockAssetDto.browser_download_url);
            expect(result.downloadCount).toBe(5);
        });
    });

    describe("mapRelease", () => {
        it("maps snake_case fields to camelCase", () => {
            const result = mapRelease(mockReleaseDto);
            expect(result.tagName).toBe("v1.0.0");
            expect(result.isDraft).toBe(false);
            expect(result.isPrerelease).toBe(false);
            expect(result.url).toBe(mockReleaseDto.html_url);
            expect(result.apiUrl).toBe(mockReleaseDto.url);
            expect(result.assets).toHaveLength(1);
            expect(result.author.username).toBe("testuser");
        });
    });

    describe("mapReleases", () => {
        it("maps an array of releases", () => {
            const result = mapReleases([mockReleaseDto]);
            expect(result).toHaveLength(1);
        });
    });

    describe("mapCreateReleaseParams", () => {
        it("maps tagName and targetCommitish to snake_case", () => {
            const result = mapCreateReleaseParams({
                tagName: "v1.0.0",
                targetCommitish: "main",
                name: "v1.0.0",
            });
            expect(result.tag_name).toBe("v1.0.0");
            expect(result.target_commitish).toBe("main");
        });
    });

    describe("mapUpdateReleaseParams", () => {
        it("maps camelCase params to snake_case payload", () => {
            const result = mapUpdateReleaseParams({
                releaseId: 1,
                tagName: "v1.0.1",
                prerelease: true,
            });
            expect(result.tag_name).toBe("v1.0.1");
            expect(result.prerelease).toBe(true);
        });
    });
});
