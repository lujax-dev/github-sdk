import {
    Release,
    ReleaseAsset,
    CreateReleaseParams,
    CreateReleasePayload,
    UpdateReleaseParams,
    UpdateReleasePayload,
} from "./release.types";
import { ReleaseDTO, ReleaseAssetDTO } from "./release.dto";
import { mapUser } from "../users/user.mapper";

export function mapReleaseAsset(dto: ReleaseAssetDTO): ReleaseAsset {
    return {
        id: dto.id,
        nodeId: dto.node_id,
        name: dto.name,
        label: dto.label,
        contentType: dto.content_type,
        size: dto.size,
        downloadCount: dto.download_count,
        url: dto.url,
        downloadUrl: dto.browser_download_url,
        createdAt: dto.created_at,
        updatedAt: dto.updated_at,
    };
}

export function mapReleaseAssets(dtos: ReleaseAssetDTO[]): ReleaseAsset[] {
    return dtos.map((dto) => mapReleaseAsset(dto));
}

export function mapRelease(dto: ReleaseDTO): Release {
    return {
        id: dto.id,
        nodeId: dto.node_id,
        tagName: dto.tag_name,
        targetCommitish: dto.target_commitish,
        name: dto.name,
        body: dto.body,
        isDraft: dto.draft,
        isPrerelease: dto.prerelease,
        author: mapUser(dto.author),
        assets: mapReleaseAssets(dto.assets),
        url: dto.html_url,
        apiUrl: dto.url,
        tarballUrl: dto.tarball_url,
        zipballUrl: dto.zipball_url,
        createdAt: dto.created_at,
        publishedAt: dto.published_at,
    };
}

export function mapReleases(dtos: ReleaseDTO[]): Release[] {
    return dtos.map((dto) => mapRelease(dto));
}

export function mapCreateReleaseParams(
    params: CreateReleaseParams,
): CreateReleasePayload {
    return {
        tag_name: params.tagName,
        target_commitish: params.targetCommitish,
        name: params.name,
        body: params.body,
        draft: params.draft,
        prerelease: params.prerelease,
        generate_release_notes: params.generateReleaseNotes,
    };
}

export function mapUpdateReleaseParams(
    params: UpdateReleaseParams,
): UpdateReleasePayload {
    return {
        tag_name: params.tagName,
        target_commitish: params.targetCommitish,
        name: params.name,
        body: params.body,
        draft: params.draft,
        prerelease: params.prerelease,
    };
}
