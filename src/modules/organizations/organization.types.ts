export interface SimpleOrganization {
    id: number;
    login: string;
    avatarUrl: string;
    description: string | null;
    url: string;
}

export interface Organization extends SimpleOrganization {
    nodeId: string;
    name?: string;
    company?: string;
    blog?: string;
    location?: string;
    email?: string;
    twitterUsername?: string | null;
    isVerified?: boolean;
    publicRepos: number;
    publicGists: number;
    followers: number;
    following: number;
    htmlUrl: string;
    createdAt: string;
    updatedAt: string;
    archivedAt?: string | null;
}
