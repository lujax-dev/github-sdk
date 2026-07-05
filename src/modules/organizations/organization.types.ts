import { User } from "../users/user.types";

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

export type OrganizationRepositoryPermission =
    "read" | "write" | "admin" | "none";

export interface UpdateOrganizationParams {
    billingEmail?: string;
    company?: string;
    email?: string;
    twitterUsername?: string;
    location?: string;
    name?: string;
    description?: string;
    blog?: string;
    hasOrganizationProjects?: boolean;
    hasRepositoryProjects?: boolean;
    defaultRepositoryPermission?: OrganizationRepositoryPermission;
    membersCanCreateRepositories?: boolean;
}

export interface UpdateOrganizationPayload {
    billing_email?: string;
    company?: string;
    email?: string;
    twitter_username?: string;
    location?: string;
    name?: string;
    description?: string;
    blog?: string;
    has_organization_projects?: boolean;
    has_repository_projects?: boolean;
    default_repository_permission?: OrganizationRepositoryPermission;
    members_can_create_repositories?: boolean;
}

export type OrgMembershipRole = "admin" | "member";
export type OrgMembershipState = "active" | "pending";

export interface OrgMembership {
    url: string;
    state: OrgMembershipState;
    role: OrgMembershipRole;
    organizationUrl: string;
    organization: SimpleOrganization;
    user: User;
}

export interface UpdateOrgMembershipParams {
    role?: OrgMembershipRole;
}

export interface UpdateOrgMembershipPayload {
    role?: OrgMembershipRole;
}
