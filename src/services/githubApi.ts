class GitHubAPI {
  private token: string = '';
  private baseUrl = 'https://api.github.com';

  setToken(token: string) {
    this.token = token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `token ${this.token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API Error: ${response.status} ${response.statusText}`);
    }

    if (response.status === 204) return {} as T;

    return response.json();
  }

  async getCurrentUser() {
    return this.request<any>('/user');
  }

  async getFollowing(username: string, page: number = 1) {
    return this.request<any[]>(`/users/${username}/following?page=${page}&per_page=100`);
  }

  async getFollowers(username: string, page: number = 1) {
    return this.request<any[]>(`/users/${username}/followers?page=${page}&per_page=100`);
  }

  async followUser(username: string) {
    return this.request(`/user/following/${username}`, { method: 'PUT' });
  }

  async unfollowUser(username: string) {
    return this.request(`/user/following/${username}`, { method: 'DELETE' });
  }

  async isFollowing(username: string): Promise<boolean> {
    try {
      await this.request(`/user/following/${username}`);
      return true;
    } catch {
      return false;
    }
  }

  async isUserFollowing(sourceUser: string, targetUser: string): Promise<boolean> {
    try {
      await this.request(`/users/${sourceUser}/following/${targetUser}`);
      return true;
    } catch {
      return false;
    }
  }

  async searchUsers(query: string = '', page: number = 1) {
    const searchQuery = query || 'type:user';
    return this.request<any>(`/search/users?q=${encodeURIComponent(searchQuery)}&page=${page}&per_page=30`);
  }

  async getRandomUsers(count: number = 100) {
    const queries = [
      'followers:>100',
      'followers:>500',
      'followers:>1000',
      'repos:>5',
      'repos:>10',
      'repos:>20',
      'location:usa',
      'location:canada',
      'location:uk',
      'location:germany',
      'location:france',
      'location:japan',
      'location:korea',
      'location:india',
      'language:javascript',
      'language:python',
      'language:java',
      'language:typescript',
      'language:go',
      'language:rust',
      'language:php',
      'language:ruby',
      'created:>2020',
      'created:>2019',
      'created:>2018',
      'type:user followers:>50',
      'type:user followers:>200',
      'type:user repos:>10',
      'type:user repos:>25',
      'type:user created:>2019',
      'type:user created:>2017'
    ];

    const allUsers = [];
    const usedUserIds = new Set();

    for (let i = 0; i < Math.min(queries.length, 8); i++) {
      try {
        const randomQuery = queries[Math.floor(Math.random() * queries.length)];
        const randomPage = Math.floor(Math.random() * 15) + 1;

        const result = await this.searchUsers(randomQuery, randomPage);

        for (const user of result.items) {
          if (!usedUserIds.has(user.id) && allUsers.length < count) {
            usedUserIds.add(user.id);
            allUsers.push(user);
          }
        }

        if (allUsers.length >= count) break;

        await new Promise(resolve => setTimeout(resolve, 150));
      } catch (error) {
        console.warn('Error fetching from query:', error);
      }
    }

    let attempts = 0;
    while (allUsers.length < count && attempts < 20) {
      try {
        const randomQuery = queries[Math.floor(Math.random() * queries.length)];
        const randomPage = Math.floor(Math.random() * 30) + 1;

        const result = await this.searchUsers(randomQuery, randomPage);

        for (const user of result.items) {
          if (!usedUserIds.has(user.id) && allUsers.length < count) {
            usedUserIds.add(user.id);
            allUsers.push(user);
          }
        }

        attempts++;
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        attempts++;
        if (attempts >= 10) break;
      }
    }

    return allUsers.slice(0, count);
  }
}

export const githubApi = new GitHubAPI();
