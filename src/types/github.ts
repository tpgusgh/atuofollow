export interface GitHubUser {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
  name?: string;
  bio?: string;
  followers: number;
  following: number;
  public_repos: number;
  created_at: string;
}

export interface FollowAction {
  id: string;
  username: string;
  action: 'follow' | 'unfollow';
  timestamp: Date;
  success: boolean;
}

export interface AppState {
  user: GitHubUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  followActions: FollowAction[];
  stats: {
    totalFollowed: number;
    totalUnfollowed: number;
    mutualFollows: number;
  };
}