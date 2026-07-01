import { GithubApiError } from "../errors/GithubApiError";

interface GithubApiErrorResponse {
    message: string;
    documentation_url?: string;
    details?: unknown;
}

export interface ApiResponse<T> {
    data: T;
    status: number;
}

export interface RequestClient {
    <T>(path: string, options?: RequestInit): Promise<ApiResponse<T>>;
}

const MAX_ATTEMPTS = 3;
const RETRY_DELAYS_MS = [1000, 2000, 4000];

function isRetryableStatus(status: number): boolean {
    return status === 429 || (status >= 500 && status < 600);
}

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

interface CacheEntry {
    etag: string;
    data: unknown;
}

/**
 * Builds a `request<T>` function bound to a base URL and token. Rate-limit
 * state and the ETag cache are held in closure so each GithubClient instance
 * (and each token) gets its own isolated state.
 */
export function createRequestClient(
    baseUrl: string,
    token: string,
): RequestClient {
    let rateLimitRemaining: number | null = null;
    let rateLimitResetAt: number | null = null;
    const etagCache = new Map<string, CacheEntry>();

    function updateRateLimitFromHeaders(headers: Headers): void {
        const remaining = headers.get("x-ratelimit-remaining");
        const reset = headers.get("x-ratelimit-reset");

        if (remaining !== null) {
            rateLimitRemaining = Number(remaining);
        }
        if (reset !== null) {
            rateLimitResetAt = Number(reset) * 1000;
        }
    }

    async function waitForRateLimit(): Promise<void> {
        if (rateLimitRemaining !== 0 || rateLimitResetAt === null) {
            return;
        }
        const waitMs = rateLimitResetAt - Date.now();
        if (waitMs > 0) {
            await sleep(waitMs);
        }
    }

    return async function request<T>(
        path: string,
        options: RequestInit = {},
    ): Promise<ApiResponse<T>> {
        await waitForRateLimit();

        const url = `${baseUrl}${path}`;
        const isGet = (options.method ?? "GET").toUpperCase() === "GET";
        const cached = isGet ? etagCache.get(url) : undefined;

        const headers: Record<string, string> = {
            "X-GitHub-Api-Version": "2022-11-28",
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            ...(options.headers as Record<string, string> | undefined),
        };
        if (cached) {
            headers["If-None-Match"] = cached.etag;
        }

        for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
            const response = await fetch(url, { ...options, headers });
            updateRateLimitFromHeaders(response.headers);

            if (response.status === 304 && cached) {
                return { data: cached.data as T, status: 304 };
            }

            if (isRetryableStatus(response.status)) {
                const isLastAttempt = attempt === MAX_ATTEMPTS - 1;
                if (!isLastAttempt) {
                    await sleep(RETRY_DELAYS_MS[attempt]);
                    continue;
                }
            }

            const text = await response.text();
            const data = text ? JSON.parse(text) : null;

            if (!response.ok) {
                const error = data as GithubApiErrorResponse;
                throw new GithubApiError(
                    response.status,
                    error.message,
                    error.documentation_url,
                    error.details,
                );
            }

            if (isGet) {
                const etag = response.headers.get("etag");
                if (etag) {
                    etagCache.set(url, { etag, data });
                }
            }

            return { data: data as T, status: response.status };
        }

        throw new GithubApiError(
            500,
            "Request failed after all retry attempts",
        );
    };
}
