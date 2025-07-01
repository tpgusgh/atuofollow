import React from 'react';
import { FollowAction } from '../types/github';
import { UserPlus, UserMinus, CheckCircle, XCircle, Clock } from 'lucide-react';

interface ActionLogProps {
  actions: FollowAction[];
}

export const ActionLog: React.FC<ActionLogProps> = ({ actions }) => {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
      <div className="flex items-center space-x-2 mb-6">
        <Clock className="w-5 h-5 text-gray-400" />
        <h3 className="text-lg font-semibold text-white">기록</h3>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {actions.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No activity yet</p>
            <p className="text-sm">팔로우 버튼이나 삭제버튼을 누르면 기록이 보여요</p>
          </div>
        ) : (
          actions.map((action) => (
            <div
              key={action.id}
              className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
            >
              <div className="flex-shrink-0">
                {action.action === 'follow' ? (
                  <UserPlus className="w-5 h-5 text-blue-400" />
                ) : (
                  <UserMinus className="w-5 h-5 text-red-400" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">
                  {action.action === 'follow' ? '팔로우' : '언팔로우'} @{action.username}
                </p>
                <p className="text-sm text-gray-400">
                  {action.timestamp.toLocaleTimeString()}
                </p>
              </div>
              
              <div className="flex-shrink-0">
                {action.success ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-400" />
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};