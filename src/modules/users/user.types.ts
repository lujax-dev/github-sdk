export interface User {
    username: string;
    id: number;
    nodeId: string;
    avatarUrl: string;
    url: string;
    apiUrl: string;
    type: "User" | "Organization";
    isSiteAdmin: boolean;
    name: string | null;
    company: string | null;
    blog: string | null;
    email: string | null;
    bio: string | null;
    twitterUsername: string | null;
    publicRepos: number;
    publicGists: number;
    followers: number;
    following: number;
    createdAt: string;
    updatedAt: string;
}

export interface Contributer extends User {
    contributions: number;
}

export interface UpdateUserParams {
    name?: string;
    email?: string;
    blog?: string;
    twitterUsername?: string | null;
    company?: string;
    location?: string;
    hireable?: boolean;
    bio?: string;
}

export interface UpdateUserPayload {
    name?: string;
    email?: string;
    blog?: string;
    twitter_username?: string | null;
    company?: string;
    location?: string;
    hireable?: boolean;
    bio?: string;
}
