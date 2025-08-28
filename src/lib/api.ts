import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

export interface User {
  id: number;
  handle: string;
  displayName: string;
  email: string;
  bio?: string;
  location?: string;
  avatar?: string;
  rsi_handle?: string;
  rsi_geid?: string;
  role: string;
  xp: number;
  level: number;
  isActive: boolean;
  isPremium: boolean;
  isBanned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  message: string;
  user: User;
  token: string;
}

export interface RegisterResponse {
  message: string;
  user: User;
  token: string;
}

export class SCCompanionClient {
  private axios: AxiosInstance;
  private token?: string;

  constructor(baseURL: string) {
    this.axios = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

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
  async register(userData: {
    handle: string;
    displayName: string;
    email: string;
    password: string;
    bio?: string;
    location?: string;
    rsi_handle?: string;
  }): Promise<RegisterResponse> {
    const response = await this.axios.post('/api/users/register', userData);
    const { token } = response.data;
    if (token) {
      this.setToken(token);
    }
    return response.data;
  }

  async login(credentials: { email: string; password: string }): Promise<LoginResponse> {
    const response = await this.axios.post('/api/users/login', credentials);
    const { token } = response.data;
    if (token) {
      this.setToken(token);
    }
    return response.data;
  }

  async getMe(): Promise<{ user: User }> {
    const response = await this.axios.get('/api/users/me');
    return response.data;
  }

  async updateProfile(data: Partial<User>): Promise<{ user: User }> {
    const response = await this.axios.put('/api/users/profile', data);
    return response.data;
  }

  // Posts methods
  async getFeed(options?: { cursor?: string; limit?: number }) {
    const response = await this.axios.get('/api/posts/feed', { params: options });
    return response.data;
  }

  async createPost(data: { content: string; mediaUrls?: string[] }) {
    const response = await this.axios.post('/api/posts', data);
    return response.data;
  }

  async likePost(postId: number) {
    const response = await this.axios.post(`/api/posts/${postId}/like`);
    return response.data;
  }

  async unlikePost(postId: number) {
    const response = await this.axios.delete(`/api/posts/${postId}/like`);
    return response.data;
  }

  // Generic request method
  async request<T = any>(config: AxiosRequestConfig): Promise<T> {
    const response = await this.axios.request(config);
    return response.data;
  }
}