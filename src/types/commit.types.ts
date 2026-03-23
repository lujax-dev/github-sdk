import { UserDTO, User } from "./user.types";

interface CommitAuthorDTO {
  name: string;
  email: string;
  date: string;
}

interface CommitTreeDTO {
  sha: string;
  url: string;
}

interface VerificationDTO {
  verified: boolean;
  reason: string;
  signature: string | null;
  payload: string | null;
}

interface CommitDetailsDTO {
  author: CommitAuthorDTO;
  committer: CommitAuthorDTO;
  message: string;
  tree: CommitTreeDTO;
  url: string;
  comment_count: number;
  verification: VerificationDTO;
}

export interface CommitDTO {
  sha: string;
  node_id: string;
  commit: CommitDetailsDTO;
  url: string;
  html_url: string;
  author: UserDTO | null;
  committer: UserDTO | null;
  parents: {
    sha: string;
    url: string;
    html_url: string;
  }[];
}

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
