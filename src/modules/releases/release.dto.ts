import { UserDTO } from "../users/user.dto";

export interface ReleaseAssetDTO {
    id: number;
    node_id: string;
    name: string;
    label: string | null;
    content_type: string;
    size: number;
    download_count: number;
    url: string;
    browser_download_url: string;
    created_at: string;
    updated_at: string;
}

export interface ReleaseDTO {
    id: number;
    node_id: string;
    tag_name: string;
    target_commitish: string;
    name: string | null;
    body: string | null;
    draft: boolean;
    prerelease: boolean;
    author: UserDTO;
    assets: ReleaseAssetDTO[];
    html_url: string;
    url: string;
    tarball_url: string | null;
    zipball_url: string | null;
    created_at: string;
    published_at: string | null;
}
