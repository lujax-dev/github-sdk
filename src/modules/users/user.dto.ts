export interface UserDTO {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    html_url: string;
    url: string;
    type: "User" | "Organization";
    site_admin: boolean;
    name: string | null;
    company: string | null;
    blog: string | null;
    location: string | null;
    email: string | null;
    bio: string | null;
    twitter_username: string | null;
    public_repos: number;
    public_gists: number;
    followers: number;
    following: number;
    created_at: string;
    updated_at: string;
}

export interface ContributerDTO extends UserDTO {
    contributions: number;
}
