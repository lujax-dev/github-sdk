import { GithubClient } from "../client/GithubClient";
import { User, UserDTO } from "../types/user.types";
import { mapUser, mapUsers } from "../mappers/user.mapper";

interface UpdateUserParams {
    name?: string;
    email?: string;
    blog?: string;
    twitterUsername?: string | null;
    company?: string;
    location?: string;
    hireable?: boolean;
    bio?: string;
}

export class UserService {
    private readonly path: string;
    private readonly authPath: string; 

    constructor(private readonly client: GithubClient) {
        this.path = '/users';
        this.authPath = '/user';
    }

    /**
     * Get the authenticated user via token
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
     * @param params Update user params object
     * @param params.name The new name of the user
     * @param params.email The publicly visable email address of the user
     * @param params.blog The new blog URL of the user
     * @param params.twitterUsername The new Twitter username of the user 
     * @param params.company The new company of the user
     * @param params.location The new location of the user 
     * @param params.hireable The new hiring availability of the user 
     * @param params.bio The new short biography of the user 
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
    public updateAuthenticated(params: UpdateUserParams) {
        const {
            name,
            email,
            blog,
            twitterUsername,
            company,
            location,
            hireable,
            bio
        } = params
        return this.client.request(this.path, {
            method: 'PATCH',
            body: JSON.stringify({
                name: name,
                email: email,
                blog: blog,
                twitter_username: twitterUsername,
                company: company,
                location: location,
                hireable: hireable,
                bio: bio
            })
        })
    }

    /**
     * Get a user by their ID
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