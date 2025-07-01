import React from 'react';
import { GitHubUser } from '../types/github';
import { MapPin, Calendar, ExternalLink, GitBranch } from 'lucide-react';

interface UserCardProps {
  user: GitHubUser;
}

export const UserCard: React.FC<UserCardProps> = ({ user }) => {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
      <div className="flex flex-col items-center text-center space-y-4">
        <img
          src={user.avatar_url}
          alt={user.login}
          className="w-24 h-24 rounded-full border-4 border-white/20"
        />
        
        <div>
          <h3 className="text-xl font-bold text-white">{user.name || user.login}</h3>
          <p className="text-gray-400">@{user.login}</p>
        </div>

        {user.bio && (
          <p className="text-gray-300 text-sm">{user.bio}</p>
        )}

        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <div className="flex items-center space-x-1">
            <GitBranch className="w-4 h-4" />
            <span>{user.public_repos} repos</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{new Date(user.created_at).getFullYear()}</span>
          </div>
        </div>

        <div className="flex space-x-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{user.following}</div>
            <div className="text-sm text-gray-400">Following</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{user.followers}</div>
            <div className="text-sm text-gray-400">Followers</div>
          </div>
        </div>

        <a
          href={user.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors border border-white/20"
        >
          <ExternalLink className="w-4 h-4" />
          <span>View on GitHub</span>
        </a>
      </div>
    </div>
  );
};