import { 
    PullRequest, 
    BranchRef, 
    PullRequestFile,
    CreatePullRequestParams,
    CreatePullRequestPayload,
    UpdatePullRequestParams,
    UpdatePullRequestPayload,
    MergePullRequestParams,
    MergePullRequestPayload
} from "./pull-request.types"
import { 
    BranchRefDTO, 
    PullRequestDTO, 
    PullRequestFileDTO 
} from "./pull-request.dto"
import { mapUser } from "../users/user.mapper"

export function mapBranchRef(dto: BranchRefDTO): BranchRef {
    return {
        ref: dto.ref,
        sha: dto.sha
    }
}

export function mapPullRequest(dto: PullRequestDTO): PullRequest {
    return {
        id: dto.id,
        nodeId: dto.node_id,
        number: dto.number,
        state: dto.state,
        isLocked: dto.locked,
        isDraft: dto.draft,
        title: dto.title,
        body: dto.body,
        user: mapUser(dto.user),
        url: dto.html_url,
        apiUrl: dto.url,
        comments:dto.comments,
        commits:dto.commits,
        additions: dto.additions,
        deletions: dto.deletions,
        changedFiles: dto.changed_files,
        createdAt: dto.created_at,
        updatedAt: dto.updated_at,
        closedAt: dto.closed_at,
        mergedAt: dto.merged_at,
        isMerged: dto.merged,
        head: mapBranchRef(dto.head),
        base: mapBranchRef(dto.base)
    }   
}

export function mapPullRequests(dtos: PullRequestDTO[]): PullRequest[] {
    return dtos.map(dto => mapPullRequest(dto))
}

export function mapPullRequestFile(dto: PullRequestFileDTO): PullRequestFile{
    return {
        sha: dto.sha,
        name: dto.filename,
        status: dto.status,
        additions: dto.additions,
        deletions: dto.deletions,
        changes: dto.changes,
        blobUrl: dto.blob_url,
        rawUrl: dto.raw_url,
        patch: dto.patch
    }
}

export function mapPullRequestFiles(dtos: PullRequestFileDTO[]): PullRequestFile[] {
    return dtos.map(dto => mapPullRequestFile(dto))
}

export function mapCreatePullRequestParams(params: CreatePullRequestParams): CreatePullRequestPayload {
    return {
        head: params.head,
        base: params.base,
        title: params.title,
        head_repo: params.headRepo,
        body: params.body,
        maintainer_can_modify: params.maintainerCanModify,
        draft: params.draft,
        issue: params.issue
    }
}

export function mapUpdatePullRequestParams(params: UpdatePullRequestParams): UpdatePullRequestPayload {
    return {
        title: params.title,
        body: params.body,
        state: params.state,
        base: params.base,
        maintainer_can_modify: params.maintainerCanModify,
    };
}

export function mapMergePullRequestParams(params: MergePullRequestParams): MergePullRequestPayload {
    return {
        commit_title: params.commitTitle,
        commit_message: params.commitMessage,
        sha: params.sha,
        merge_method: params.mergeMethod,
    };
}
