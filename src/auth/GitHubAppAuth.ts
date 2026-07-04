import { importPKCS8, SignJWT } from "jose";
import { GithubApiError } from "../shared/errors/GithubApiError";
import { GitHubAuth } from "./GitHubAuth";

export interface GitHubAppAuthConfig {
    /** The GitHub App's ID (from the App's settings page). */
    appId: string;
    /** The App's PEM-encoded PKCS8 private key. */
    privateKey: string;
    /** The installation to authenticate as. */
    installationId: string;
    /** Override for GitHub Enterprise Server. Defaults to `https://api.github.com`. */
    baseUrl?: string;
}

interface InstallationTokenResponse {
    token: string;
    expires_at: string;
}

interface GithubApiErrorResponse {
    message: string;
    documentation_url?: string;
}

const JWT_TTL_SECONDS = 600;
const JWT_CLOCK_DRIFT_SECONDS = 60;
const REFRESH_MARGIN_MS = 60_000;

/**
 * GitHub App authentication: signs a short-lived JWT from the App's private
 * key, exchanges it for an installation access token, and transparently
 * re-exchanges once the cached token is close to expiring. Refresh happens
 * lazily inside {@link getToken} — there is no background timer.
 *
 * @example
 * ```ts
 * const auth = new GitHubAppAuth({
 *     appId: process.env.GITHUB_APP_ID,
 *     privateKey: process.env.GITHUB_APP_PRIVATE_KEY,
 *     installationId: process.env.GITHUB_APP_INSTALLATION_ID,
 * });
 * const github = new GithubClient({ auth, owner: 'lujax-dev', repo: 'github-sdk' });
 * ```
 */
export class GitHubAppAuth implements GitHubAuth {
    private cachedToken: string | null = null;
    private cachedTokenExpiresAtMs: number | null = null;

    constructor(private readonly config: GitHubAppAuthConfig) {}

    async getToken(): Promise<string> {
        if (this.cachedToken && !this.isNearExpiry()) {
            return this.cachedToken;
        }

        const jwt = await this.signAppJwt();
        const { token, expiresAtMs } =
            await this.exchangeForInstallationToken(jwt);

        this.cachedToken = token;
        this.cachedTokenExpiresAtMs = expiresAtMs;
        return token;
    }

    private isNearExpiry(): boolean {
        if (this.cachedTokenExpiresAtMs === null) {
            return true;
        }
        return Date.now() >= this.cachedTokenExpiresAtMs - REFRESH_MARGIN_MS;
    }

    private async signAppJwt(): Promise<string> {
        const key = await importPKCS8(this.config.privateKey, "RS256");
        const nowSeconds = Math.floor(Date.now() / 1000);

        return new SignJWT({})
            .setProtectedHeader({ alg: "RS256" })
            .setIssuedAt(nowSeconds - JWT_CLOCK_DRIFT_SECONDS)
            .setExpirationTime(nowSeconds + JWT_TTL_SECONDS)
            .setIssuer(this.config.appId)
            .sign(key);
    }

    private async exchangeForInstallationToken(
        jwt: string,
    ): Promise<{ token: string; expiresAtMs: number }> {
        const baseUrl = this.config.baseUrl ?? "https://api.github.com";
        const response = await fetch(
            `${baseUrl}/app/installations/${this.config.installationId}/access_tokens`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${jwt}`,
                    Accept: "application/vnd.github+json",
                    "X-GitHub-Api-Version": "2022-11-28",
                },
            },
        );

        const text = await response.text();
        const data = text ? JSON.parse(text) : null;

        if (!response.ok) {
            const error = data as GithubApiErrorResponse;
            throw new GithubApiError(
                response.status,
                error?.message ??
                    "Failed to exchange JWT for an installation access token",
                error?.documentation_url,
            );
        }

        const body = data as InstallationTokenResponse;
        return {
            token: body.token,
            expiresAtMs: new Date(body.expires_at).getTime(),
        };
    }
}
