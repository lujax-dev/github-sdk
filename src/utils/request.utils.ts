import { GithubApiError } from "../errors/errors"

interface GithubApiErrorResponse {
    message: string
}

export async function request<T>(
    baseUrl: string, 
    path: string,
    options: RequestInit = {}, 
    token: string
): Promise<T> {
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

    return data as T
   
}
