import { User } from "./user.types";

export interface PullRequest {
    id: number;
    html_url: string;
    number: number;
    state: 'open' | 'closed';
    title: string;
    user: User;
    body?: string;
    created_at: string;
    merged_at?: string;
    head: {
        ref: string;
    }
    base: {
        ref: string;
    }
    merged: boolean;
}