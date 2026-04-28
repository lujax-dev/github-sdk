import { GithubApiError } from "../errors/errors"

interface GithubApiErrorResponse {
    message: string
    documentation_url?: string;
    details?: unknown; 
}

export interface ApiResponse<T>{
    data: T,
    status: number
}

export async function request<T>(
    baseUrl: string, 
    path: string,
    options: RequestInit = {}, 
    token: string
): Promise<ApiResponse<T>> {
    const response = await fetch(`${baseUrl}${path}`, {
        ...options,
        headers: {
            'X-GitHub-Api-Version': '2022-11-28',
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github+json',
            ...options.headers
        },
    })

    const data = await response.json();

    if (!response.ok) {
        const error = data as GithubApiErrorResponse
        throw new GithubApiError(response.status, error.message)
    }

    return {
        data: data as T,
        status: response.status
    }
}
