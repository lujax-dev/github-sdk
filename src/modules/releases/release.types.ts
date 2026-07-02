import { User } from "../users/user.types";

export interface ReleaseAsset {
    id: number;
    nodeId: string;
    name: string;
    label: string | null;
    contentType: string;
    size: number;
    downloadCount: number;
    url: string;
    downloadUrl: string;
    createdAt: string;
    updatedAt: string;
}

export interface Release {
    id: number;
    nodeId: string;
    tagName: string;
    targetCommitish: string;
    name: string | null;
    body: string | null;
    isDraft: boolean;
    isPrerelease: boolean;
    author: User;
    assets: ReleaseAsset[];
    url: string;
    apiUrl: string;
    tarballUrl: string | null;
    zipballUrl: string | null;
    createdAt: string;
    publishedAt: string | null;
}

export interface CreateReleaseParams {
    tagName: string;
    targetCommitish?: string;
    name?: string;
    body?: string;
    draft?: boolean;
    prerelease?: boolean;
    generateReleaseNotes?: boolean;
}

export interface CreateReleasePayload {
    tag_name: string;
    target_commitish?: string;
    name?: string;
    body?: string;
    draft?: boolean;
    prerelease?: boolean;
    generate_release_notes?: boolean;
}

export interface UpdateReleaseParams {
    releaseId: number;
    tagName?: string;
    targetCommitish?: string;
    name?: string;
    body?: string;
    draft?: boolean;
    prerelease?: boolean;
}

export interface UpdateReleasePayload {
    tag_name?: string;
    target_commitish?: string;
    name?: string;
    body?: string;
    draft?: boolean;
    prerelease?: boolean;
}
