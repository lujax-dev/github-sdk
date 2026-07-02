import {
    Issue,
    IssueComment,
    Label,
    Milestone,
    CreateIssueParams,
    CreateIssuePayload,
    UpdateIssueParams,
    UpdateIssuePayload,
} from "./issue.types";
import { IssueDTO, IssueCommentDTO, LabelDTO, MilestoneDTO } from "./issue.dto";
import { mapUser } from "../users/user.mapper";

export function mapLabel(dto: LabelDTO): Label {
    return {
        id: dto.id,
        nodeId: dto.node_id,
        name: dto.name,
        description: dto.description,
        color: dto.color,
        isDefault: dto.default,
    };
}

export function mapLabels(dtos: LabelDTO[]): Label[] {
    return dtos.map((dto) => mapLabel(dto));
}

export function mapMilestone(dto: MilestoneDTO): Milestone {
    return {
        id: dto.id,
        nodeId: dto.node_id,
        number: dto.number,
        title: dto.title,
        description: dto.description,
        state: dto.state,
        createdAt: dto.created_at,
        updatedAt: dto.updated_at,
        closedAt: dto.closed_at,
        dueOn: dto.due_on,
    };
}

export function mapIssue(dto: IssueDTO): Issue {
    return {
        id: dto.id,
        nodeId: dto.node_id,
        number: dto.number,
        title: dto.title,
        body: dto.body,
        state: dto.state,
        stateReason: dto.state_reason,
        user: mapUser(dto.user),
        labels: mapLabels(dto.labels),
        assignee: dto.assignee ? mapUser(dto.assignee) : null,
        assignees: dto.assignees.map((assignee) => mapUser(assignee)),
        milestone: dto.milestone ? mapMilestone(dto.milestone) : null,
        comments: dto.comments,
        isLocked: dto.locked,
        url: dto.html_url,
        apiUrl: dto.url,
        createdAt: dto.created_at,
        updatedAt: dto.updated_at,
        closedAt: dto.closed_at,
        isPullRequest: dto.pull_request !== undefined,
    };
}

export function mapIssues(dtos: IssueDTO[]): Issue[] {
    return dtos.map((dto) => mapIssue(dto));
}

export function mapIssueComment(dto: IssueCommentDTO): IssueComment {
    return {
        id: dto.id,
        nodeId: dto.node_id,
        user: mapUser(dto.user),
        body: dto.body,
        url: dto.html_url,
        apiUrl: dto.url,
        createdAt: dto.created_at,
        updatedAt: dto.updated_at,
    };
}

export function mapIssueComments(dtos: IssueCommentDTO[]): IssueComment[] {
    return dtos.map((dto) => mapIssueComment(dto));
}

export function mapCreateIssueParams(
    params: CreateIssueParams,
): CreateIssuePayload {
    return {
        title: params.title,
        body: params.body,
        labels: params.labels,
        assignees: params.assignees,
        milestone: params.milestone,
    };
}

export function mapUpdateIssueParams(
    params: UpdateIssueParams,
): UpdateIssuePayload {
    return {
        title: params.title,
        body: params.body,
        state: params.state,
        state_reason: params.stateReason,
        labels: params.labels,
        assignees: params.assignees,
        milestone: params.milestone,
    };
}
