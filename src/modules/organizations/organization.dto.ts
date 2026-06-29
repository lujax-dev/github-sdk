export interface SimpleOrganizationDto {
    id: number;
    login: string;
    avatar_url: string;
    description: string | null;
    url: string;
}

export interface OrganizationDto extends SimpleOrganizationDto {
    node_id: string;
    name?: string;
    company?: string;
    blog?: string;
    location?: string;
    email?: string;
    twitter_username?: string | null;
    is_verified?: boolean;
    public_repos: number;
    public_gists: number;
    followers: number;
    following: number;
    html_url: string;
    created_at: string;
    updated_at: string;
    archived_at?: string | null;
}
