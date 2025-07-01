import React, { useState } from 'react';
import { GitHubUser, FollowAction } from '../types/github';
import { UserCard } from './UserCard';
import { StatsCard } from './StatsCard';
import { ActionLog } from './ActionLog';
import { githubApi } from '../services/githubApi';
import { Users, UserPlus, UserMinus, RefreshCw, LogOut, Zap, UserX } from 'lucide-react';

interface DashboardProps {
  user: GitHubUser;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [followActions, setFollowActions] = useState<FollowAction[]>([]);
  const [isAutoFollowing, setIsAutoFollowing] = useState(false);
  const [isUnfollowing, setIsUnfollowing] = useState(false);
  const [followProgress, setFollowProgress] = useState({ current: 0, total: 0 });
  const [unfollowProgress, setUnfollowProgress] = useState({ current: 0, total: 0 });
  const [stats, setStats] = useState({
    totalFollowed: 0,
    totalUnfollowed: 0,
    mutualFollows: 0,
  });

  const addAction = (action: FollowAction) => {
    setFollowActions(prev => [action, ...prev.slice(0, 99)]); // Keep last 100 actions

    if (action.success) {
      setStats(prev => ({
        ...prev,
        totalFollowed: action.action === 'follow' ? prev.totalFollowed + 1 : prev.totalFollowed,
        totalUnfollowed: action.action === 'unfollow' ? prev.totalUnfollowed + 1 : prev.totalUnfollowed,
      }));
    }
  };

  const handleAutoFollow = async () => {
    setIsAutoFollowing(true);
    setFollowProgress({ current: 0, total: 100 });

    try {
      const randomUsers = await githubApi.getRandomUsers(100);

      for (let i = 0; i < randomUsers.length; i++) {
        const targetUser = randomUsers[i];
        setFollowProgress({ current: i + 1, total: 100 });

        try {
          const isAlreadyFollowing = await githubApi.isFollowing(user.login, targetUser.login);

          if (!isAlreadyFollowing) {
            await githubApi.followUser(targetUser.login);
            addAction({
              id: `${Date.now()}-${i}`,
              username: targetUser.login,
              action: 'follow',
              timestamp: new Date(),
              success: true,
            });
          } else {
            addAction({
              id: `${Date.now()}-${i}`,
              username: targetUser.login,
              action: 'follow',
              timestamp: new Date(),
              success: false,
            });
          }

          if (i < randomUsers.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 800));
          }
        } catch (error) {
          addAction({
            id: `${Date.now()}-${i}`,
            username: targetUser.login,
            action: 'follow',
            timestamp: new Date(),
            success: false,
          });
        }
      }
    } catch (error) {
      console.error('Auto-follow error:', error);
    } finally {
      setIsAutoFollowing(false);
      setFollowProgress({ current: 0, total: 0 });
    }
  };

  const handleUnfollowNonFollowers = async () => {
    setIsUnfollowing(true);
    try {
      let allFollowing: any[] = [];
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        const following = await githubApi.getFollowing(user.login, page);
        if (following.length === 0) {
          hasMore = false;
        } else {
          allFollowing = [...allFollowing, ...following];
          page++;
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }

      setUnfollowProgress({ current: 0, total: allFollowing.length });
      let unfollowedCount = 0;

      for (let i = 0; i < allFollowing.length; i++) {
        const followedUser = allFollowing[i];
        setUnfollowProgress({ current: i + 1, total: allFollowing.length });

        try {
          // Check if this user follows me back
          const isFollowingBack = await githubApi.isUserFollowing(followedUser.login, user.login);


          if (!isFollowingBack) {
            await githubApi.unfollowUser(followedUser.login);
            unfollowedCount++;
            addAction({
              id: `${Date.now()}-unfollow-${i}`,
              username: followedUser.login,
              action: 'unfollow',
              timestamp: new Date(),
              success: true,
            });
          }

          if (i < allFollowing.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 600));
          }
        } catch (error) {
          addAction({
            id: `${Date.now()}-unfollow-${i}`,
            username: followedUser.login,
            action: 'unfollow',
            timestamp: new Date(),
            success: false,
          });
        }
      }

      console.log(`Unfollowed ${unfollowedCount} users who don't follow back`);
    } catch (error) {
      console.error('Unfollow error:', error);
    } finally {
      setIsUnfollowing(false);
      setUnfollowProgress({ current: 0, total: 0 });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <img
              src={user.avatar_url}
              alt={user.login}
              className="w-12 h-12 rounded-full border-2 border-white/20"
            />
            <div>
              <h1 className="text-2xl font-bold text-white">{user.name || user.login}</h1>
              <p className="text-gray-400">@{user.login}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors border border-white/20"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard title="Following" value={user.following} icon={<Users className="w-6 h-6" />} color="blue" />
          <StatsCard title="Followers" value={user.followers} icon={<Users className="w-6 h-6" />} color="green" />
          <StatsCard title="Auto Followed" value={stats.totalFollowed} icon={<UserPlus className="w-6 h-6" />} color="purple" />
          <StatsCard title="Auto Unfollowed" value={stats.totalUnfollowed} icon={<UserMinus className="w-6 h-6" />} color="red" />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <button
            onClick={handleAutoFollow}
            disabled={isAutoFollowing}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-medium rounded-xl transition-all duration-200 disabled:cursor-not-allowed relative overflow-hidden"
          >
            {isAutoFollowing ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Following Users... ({followProgress.current}/{followProgress.total})</span>
                <div className="absolute bottom-0 left-0 h-1 bg-white/30 transition-all duration-300" style={{ width: `${(followProgress.current / followProgress.total) * 100}%` }} />
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                <span>Auto Follow 100 Random Users</span>
              </>
            )}
          </button>

          <button
            onClick={handleUnfollowNonFollowers}
            disabled={isUnfollowing}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-medium rounded-xl transition-all duration-200 disabled:cursor-not-allowed relative overflow-hidden"
          >
            {isUnfollowing ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Checking Users... ({unfollowProgress.current}/{unfollowProgress.total})</span>
                <div className="absolute bottom-0 left-0 h-1 bg-white/30 transition-all duration-300" style={{ width: unfollowProgress.total > 0 ? `${(unfollowProgress.current / unfollowProgress.total) * 100}%` : '0%' }} />
              </>
            ) : (
              <>
                <UserX className="w-5 h-5" />
                <span>Unfollow Non-Followers</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <UserCard user={user} />
          </div>
          <div className="lg:col-span-2">
            <ActionLog actions={followActions} />
          </div>
        </div>
      </div>
    </div>
  );
};
