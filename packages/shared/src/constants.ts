export const XP_LEVELS = {
  POST_CREATED: 10,
  LIKE_RECEIVED: 2,
  FOLLOW_GAINED: 5,
  QUEST_COMPLETED: 50,
  EVENT_PARTICIPATION: 25,
  SESSION_STATS: 1, // per minute of gameplay
  REGISTRATION_BONUS: 50,
  RSI_LINK_BONUS: 25,
} as const;

export const ROLE_PERMISSIONS = {
  user: [
    'create_post',
    'edit_own_post',
    'delete_own_post'
  ],
  moderator: [
    'create_post',
    'edit_own_post',
    'delete_own_post',
    'moderate_posts',
    'moderate_users',
    'moderate_comments',
    'ban_users'
  ],
  admin: [
    'create_post',
    'edit_own_post',
    'delete_own_post',
    'moderate_posts',
    'moderate_users',
    'moderate_comments',
    'ban_users',
    'manage_users',
    'manage_moderators',
    'access_admin_panel',
    'manage_quests',
    'manage_events'
  ],
  super_admin: [
    'create_post',
    'edit_own_post',
    'delete_own_post',
    'moderate_posts',
    'moderate_users',
    'moderate_comments',
    'ban_users',
    'manage_users',
    'manage_moderators',
    'access_admin_panel',
    'manage_quests',
    'manage_events',
    'manage_admins',
    'system_config',
    'database_access'
  ]
} as const;

export const API_ENDPOINTS = {
  // Auth
  REGISTER: '/api/users/register',
  LOGIN: '/api/users/login',
  REFRESH_TOKEN: '/api/users/refresh-token',
  ME: '/api/users/me',
  LINK_RSI: '/api/users/link-rsi',
  UPDATE_RSI_GEID: '/api/users/rsi-geid',

  // Users
  USER_PROFILE: (userId: number) => `/api/users/${userId}`,
  UPDATE_PROFILE: '/api/users/profile',
  SEARCH_USERS: '/api/users/search',
  LEADERBOARD: '/api/users/leaderboard',
  DEACTIVATE_ACCOUNT: '/api/users/deactivate',

  // Admin
  UPDATE_USER_ROLE: (userId: number) => `/api/users/${userId}/role`,
  BAN_USER: (userId: number) => `/api/users/${userId}/ban`,
  UNBAN_USER: (userId: number) => `/api/users/${userId}/ban`,
  AWARD_XP: (userId: number) => `/api/users/${userId}/award-xp`,

  // Posts
  CREATE_POST: '/api/posts',
  GET_POST: (postId: number) => `/api/posts/${postId}`,
  UPDATE_POST: (postId: number) => `/api/posts/${postId}`,
  DELETE_POST: (postId: number) => `/api/posts/${postId}`,
  FEED: '/api/posts/feed',
  USER_POSTS: (userId: number) => `/api/posts/user/${userId}`,
  LIKE_POST: (postId: number) => `/api/posts/${postId}/like`,
  UNLIKE_POST: (postId: number) => `/api/posts/${postId}/like`,
  MODERATE_POST: (postId: number) => `/api/posts/${postId}/moderate`,

  // Social - Follows
  FOLLOW_USER: '/api/follows',
  UNFOLLOW_USER: (userId: number) => `/api/follows/${userId}`,
  GET_FOLLOWERS: (userId: number) => `/api/follows/${userId}/followers`,
  GET_FOLLOWING: (userId: number) => `/api/follows/${userId}/following`,

  // Social - Friends
  SEND_FRIEND_REQUEST: '/api/friends/request',
  RESPOND_FRIEND_REQUEST: (requestId: number) => `/api/friends/request/${requestId}`,
  GET_PENDING_REQUESTS: '/api/friends/requests',
  REMOVE_FRIEND: (userId: number) => `/api/friends/${userId}`,
  GET_FRIENDS: (userId: number) => `/api/friends/${userId}/friends`,
  GET_SOCIAL_STATS: (userId: number) => `/api/friends/${userId}/stats`,
} as const;

export const DEFAULT_LIMITS = {
  POSTS_PER_PAGE: 20,
  USERS_PER_PAGE: 20,
  LEADERBOARD_SIZE: 50,
  SEARCH_RESULTS: 20,
  MEDIA_URLS_PER_POST: 4,
  POST_CONTENT_MAX: 2000,
  BIO_MAX: 500,
  DISPLAY_NAME_MAX: 100,
  HANDLE_MAX: 30,
  LOCATION_MAX: 100,
} as const;

export const RSI_DATA = {
  HANDLE_MIN: 1,
  HANDLE_MAX: 50,
  GEID_PATTERN: /^GEID_[A-Za-z0-9_]+$/,
} as const;

export const PREMIUM_FEATURES = {
  UNLIMITED_UPLOADS: 'unlimited_uploads',
  EXTRA_MARKETPLACE_SLOTS: 'extra_marketplace_slots',
  PREMIUM_BADGE: 'premium_badge',
  PRIORITY_SUPPORT: 'priority_support',
} as const;