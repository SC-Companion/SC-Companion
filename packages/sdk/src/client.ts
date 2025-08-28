import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import {
  User,
  UserProfile,
  Post,
  PostWithUser,
  PaginatedResponse,
  AuthResponse,
  LoginResponse,
  RegisterResponse,
  SocialStats,
  CreateUserInput,
  UpdateUserInput,
  LoginInput,
  LinkRSIAccountInput,
  CreatePostInput,
  UpdatePostInput,
  FollowInput,
  FriendRequestInput,
  FriendRequestResponseInput,
  PaginationInput,
  API_ENDPOINTS
} from './shared';

export interface ClientConfig {
  baseURL: string;
  timeout?: number;
  token?: string;
}

export class SCCompanionClient {
  private axios: AxiosInstance;
  private token?: string;

  constructor(config: ClientConfig) {
    this.axios = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (config.token) {
      this.setToken(config.token);
    }

    // Add request interceptor to include token
    this.axios.interceptors.request.use((config) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config;
    });

    // Add response interceptor for error handling
    this.axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.token = undefined;
          // You might want to emit an event here for token expiration
        }
        throw error;
      }
    );
  }

  setToken(token: string): void {
    this.token = token;
  }

  clearToken(): void {
    this.token = undefined;
  }

  // Auth methods
  async register(userData: CreateUserInput): Promise<RegisterResponse> {
    const response = await this.axios.post(API_ENDPOINTS.REGISTER, userData);
    const { token } = response.data;
    if (token) {
      this.setToken(token);
    }
    return response.data;
  }

  async login(credentials: LoginInput): Promise<LoginResponse> {
    const response = await this.axios.post(API_ENDPOINTS.LOGIN, credentials);
    const { token } = response.data;
    if (token) {
      this.setToken(token);
    }
    return response.data;
  }

  async refreshToken(): Promise<{ token: string }> {
    const response = await this.axios.post(API_ENDPOINTS.REFRESH_TOKEN);
    const { token } = response.data;
    if (token) {
      this.setToken(token);
    }
    return response.data;
  }

  async getMe(): Promise<{ user: User }> {
    const response = await this.axios.get(API_ENDPOINTS.ME);
    return response.data;
  }

  async linkRSIAccount(data: LinkRSIAccountInput): Promise<{ user: User }> {
    const response = await this.axios.post(API_ENDPOINTS.LINK_RSI, data);
    return response.data;
  }

  async updateRSIGEID(rsi_geid: string): Promise<{ user: User }> {
    const response = await this.axios.put(API_ENDPOINTS.UPDATE_RSI_GEID, { rsi_geid });
    return response.data;
  }

  // User methods
  async getUserProfile(userId: number): Promise<{ user: UserProfile }> {
    const response = await this.axios.get(API_ENDPOINTS.USER_PROFILE(userId));
    return response.data;
  }

  async updateProfile(data: UpdateUserInput): Promise<{ user: User }> {
    const response = await this.axios.put(API_ENDPOINTS.UPDATE_PROFILE, data);
    return response.data;
  }

  async searchUsers(query: string, limit?: number): Promise<{ users: UserProfile[] }> {
    const response = await this.axios.get(API_ENDPOINTS.SEARCH_USERS, {
      params: { q: query, limit }
    });
    return response.data;
  }

  async getLeaderboard(limit?: number): Promise<{ leaderboard: UserProfile[] }> {
    const response = await this.axios.get(API_ENDPOINTS.LEADERBOARD, {
      params: { limit }
    });
    return response.data;
  }

  async deactivateAccount(): Promise<{ user: User }> {
    const response = await this.axios.delete(API_ENDPOINTS.DEACTIVATE_ACCOUNT);
    return response.data;
  }

  // Post methods
  async createPost(data: CreatePostInput): Promise<{ post: Post }> {
    const response = await this.axios.post(API_ENDPOINTS.CREATE_POST, data);
    return response.data;
  }

  async getPost(postId: number): Promise<{ post: PostWithUser }> {
    const response = await this.axios.get(API_ENDPOINTS.GET_POST(postId));
    return response.data;
  }

  async updatePost(postId: number, data: UpdatePostInput): Promise<{ post: Post }> {
    const response = await this.axios.put(API_ENDPOINTS.UPDATE_POST(postId), data);
    return response.data;
  }

  async deletePost(postId: number): Promise<{ success: boolean }> {
    const response = await this.axios.delete(API_ENDPOINTS.DELETE_POST(postId));
    return response.data;
  }

  async getFeed(options?: PaginationInput): Promise<PaginatedResponse<PostWithUser>> {
    const response = await this.axios.get(API_ENDPOINTS.FEED, { params: options });
    return response.data;
  }

  async getUserPosts(userId: number, options?: PaginationInput): Promise<PaginatedResponse<PostWithUser>> {
    const response = await this.axios.get(API_ENDPOINTS.USER_POSTS(userId), { params: options });
    return response.data;
  }

  async likePost(postId: number): Promise<{ success: boolean; likesCount: number }> {
    const response = await this.axios.post(API_ENDPOINTS.LIKE_POST(postId));
    return response.data;
  }

  async unlikePost(postId: number): Promise<{ success: boolean; likesCount: number }> {
    const response = await this.axios.delete(API_ENDPOINTS.UNLIKE_POST(postId));
    return response.data;
  }

  // Social methods - Follows
  async followUser(data: FollowInput): Promise<{ success: boolean }> {
    const response = await this.axios.post(API_ENDPOINTS.FOLLOW_USER, data);
    return response.data;
  }

  async unfollowUser(userId: number): Promise<{ success: boolean }> {
    const response = await this.axios.delete(API_ENDPOINTS.UNFOLLOW_USER(userId));
    return response.data;
  }

  async getFollowers(userId: number, options?: PaginationInput): Promise<PaginatedResponse<UserProfile>> {
    const response = await this.axios.get(API_ENDPOINTS.GET_FOLLOWERS(userId), { params: options });
    return response.data;
  }

  async getFollowing(userId: number, options?: PaginationInput): Promise<PaginatedResponse<UserProfile>> {
    const response = await this.axios.get(API_ENDPOINTS.GET_FOLLOWING(userId), { params: options });
    return response.data;
  }

  // Social methods - Friends
  async sendFriendRequest(data: FriendRequestInput): Promise<{ success: boolean }> {
    const response = await this.axios.post(API_ENDPOINTS.SEND_FRIEND_REQUEST, data);
    return response.data;
  }

  async respondToFriendRequest(requestId: number, data: FriendRequestResponseInput): Promise<{ success: boolean }> {
    const response = await this.axios.put(API_ENDPOINTS.RESPOND_FRIEND_REQUEST(requestId), data);
    return response.data;
  }

  async getPendingFriendRequests(type: 'sent' | 'received' = 'received'): Promise<{ requests: UserProfile[] }> {
    const response = await this.axios.get(API_ENDPOINTS.GET_PENDING_REQUESTS, { params: { type } });
    return response.data;
  }

  async removeFriend(userId: number): Promise<{ success: boolean }> {
    const response = await this.axios.delete(API_ENDPOINTS.REMOVE_FRIEND(userId));
    return response.data;
  }

  async getFriends(userId: number, options?: PaginationInput): Promise<PaginatedResponse<UserProfile>> {
    const response = await this.axios.get(API_ENDPOINTS.GET_FRIENDS(userId), { params: options });
    return response.data;
  }

  async getSocialStats(userId: number): Promise<SocialStats> {
    const response = await this.axios.get(API_ENDPOINTS.GET_SOCIAL_STATS(userId));
    return response.data;
  }

  // Generic request method for custom endpoints
  async request<T = any>(config: AxiosRequestConfig): Promise<T> {
    const response = await this.axios.request(config);
    return response.data;
  }
}