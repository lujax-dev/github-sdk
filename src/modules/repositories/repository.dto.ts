import { UserDTO } from "../users/user.dto";
import { RepositoryVisibility, RepositoryTagCommit } from "./repository.types";
import { Status } from "./repository.types";

export type RepositoryActivityTypeDTO =
    | "push"
    | "force_push"
    | "branch_deletion"
    | "branch_creation"
    | "pr_merge"
    | "merge_queue_merge";

export interface RepositoryDTO {
    id: number;
    node_id: string;
    name: string;
    full_name: string;
    private: boolean;
    owner: UserDTO;
    html_url: string;
    description: string | null;
    fork: boolean;
    url: string;
    stargazers_count: number;
    watchers_count: number;
    forks_count: number;
    open_issues_count: number;
    language: string | null;
    default_branch: string;
    created_at: string;
    updated_at: string;
    pushed_at: string;
    size: number;
    topics?: string[];
    visibility: RepositoryVisibility;
}

export interface RepositoryActivityDTO {
    id: number;
    node_id: string;
    before: string;
    after: string;
    ref: string;
    timestamp: string; 
    activity_type: RepositoryActivityTypeDTO;
    actor: UserDTO| null;
}

export interface ImmutableReleasesStatusDTO extends Status {
    enforced_by_owner: boolean;
}

export interface RepositoryTagDTO {
    name: string;
    node_id: string;
    zipball_url: string;
    tarball_url: string;
    commit: RepositoryTagCommit;
}

export interface TeamPermissionsDTO {
    pull: boolean;
    triage: boolean;
    push: boolean;
    maintain: boolean;
    admin: boolean;
}

export interface TeamParentDTO {
    id: number;
    node_id: string;
    url: string;
    members_url: string;
    name: string;
    description: string | null;
    permission: string;
    privacy?: string;
    notification_setting?: string;
    html_url: string;
    repositories_url: string;
    slug: string;
    ldap_dn?: string;
    type: "enterprise" | "organization";
    organization_id?: number;
    enterprise_id?: number;
}

export interface TeamDTO {
    id: number;
    node_id: string;
    name: string;
    slug: string;
    description: string | null;
    privacy?: string;
    notification_setting?: string;
    permission: string;
    permissions?: TeamPermissionsDTO;
    url: string;
    html_url: string;
    members_url: string;
    repositories_url: string;
    type: "enterprise" | "organization";
    organization_id?: number;
    enterprise_id?: number;
    parent: TeamParentDTO | null;
}
