import { GithubClient } from "../client/GithubClient";
import { User, UserDTO, UpdateUserParams } from "../types/user.types";
import { mapUpdateUserParams, mapUser, mapUsers } from "../mappers/user.mapper";

export class UserService {
    private readonly path: string;
    private readonly authPath: string; 

    constructor(private readonly client: GithubClient) {
        this.path = '/users';
        this.authPath = '/user';
    }

    /**
     * Get the authenticated user via token
     * 
     * @returns Data of the user
     * 
     * @example 
     * ```ts 
     * const user = await github.users.getAuthenticated();
     * ``` 
     */
    public async getAuthenticated(): Promise<User> {
        const response = await this.client.request<UserDTO>(this.authPath);
        return mapUser(response.data);
    }

    /**
     * Update the authenticated user via token
     * 
     * @param params Configuration for the user to update
     * @returns Data of the updated user
     * 
     * @example 
     * ```ts 
     * await github.users.updateAuthenticated({
     *     name: 'John Smith',
     *     email: 'John123@example.com',
     *     hireable: true,
     *     bio: 'Hi, im john and I code'
     * });
     * ```
     */
    public async updateAuthenticated(params: UpdateUserParams): Promise<User> {
        const body = mapUpdateUserParams(params);
        const response = await this.client.request<UserDTO>(this.path, {
            method: 'PATCH',
            body: JSON.stringify(body)
        });
        return mapUser(response.data);
    }

    /**
     * Get a user by their ID
     * 
     * @param accountId ID of the user's GitHub account
     * @returns Data of the user
     * 
     * @example 
     * ```ts 
     * const user = await github.users.getById(7454);
     * ```
     */
    public async getById(accountId: number): Promise<User> {
        const response = await this.client.request<UserDTO>(`${this.path}/${accountId}`);
        return mapUser(response.data);
    }

    /**
     * List all users
     * 
     * @returns Array of users
     * 
     * @example
     * ```ts
     * const users = await github.users.list();
     * ```
     */
    public async list(): Promise<User[]> {
        const response = await this.client.request<UserDTO[]>(this.authPath);
        return mapUsers(response.data);
    }

    /**
     * Get a user by their username
     * 
     * @param username The handle for the GitHub user account
     * @returns Data of the user
     * 
     * @example
     * ```ts 
     * const user = await github.users.getByUsername('username');
     * ```
     */
    public async getByUsername(username: string): Promise<User> {
        const response = await this.client.request<UserDTO>(`${this.authPath}/${username}`);
        return mapUser(response.data);
    }
}