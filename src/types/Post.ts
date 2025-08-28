export interface PostUser {
  id: number;
  handle: string;
  displayName: string;
  avatar: string | null;
  level: number;
  isPremium: boolean;
  rsi_handle?: string;
}

export interface Post {
  id: number;
  user: PostUser;
  content: string;
  likesCount: number;
  createdAt: string;
  isLiked: boolean;
}