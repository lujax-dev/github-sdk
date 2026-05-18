import { User } from "../users/user.types";

export interface Commit {
    sha: string;
    nodeId: string;
    message: string;
    author: {
        name: string;
        email: string;
        date: Date;
        user: User | null;
    };
    committer: {
        name: string;
        email: string;
        date: Date;
        user: User | null;
    };
    url: string;
    commentCount: number;
    verified: boolean;
    parentShas: string[];
}
