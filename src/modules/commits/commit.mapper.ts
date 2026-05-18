import { Commit } from "./commit.types";
import { CommitDTO } from "./commit.dto";
import { mapUser } from "../users/user.mapper";

export function mapCommit(dto: CommitDTO): Commit {
    return {
        sha: dto.sha,
        nodeId: dto.node_id,
        message: dto.commit.message,
        author: {
            name: dto.commit.author.name,
            email: dto.commit.author.email,
            date: new Date(dto.commit.author.date),
            user: dto.author ? mapUser(dto.author) : null,
        },
        committer: {
            name: dto.commit.committer.name,
            email: dto.commit.committer.email,
            date: new Date(dto.commit.committer.date),
            user: dto.committer ? mapUser(dto.committer) : null,
        },
        url: dto.html_url,
        commentCount: dto.commit.comment_count,
        verified: dto.commit.verification.verified,
        parentShas: dto.parents.map((parent) => parent.sha),
    };
}

export function mapCommits(dtos: CommitDTO[]): Commit[] {
    return dtos.map((dto) => mapCommit(dto));
}
