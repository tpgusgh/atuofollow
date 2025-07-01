import React, { useState } from 'react';
import { KeyIcon, GithubIcon, AlertCircle, Loader2 } from 'lucide-react';

interface LoginFormProps {
  onLogin: (token: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin, isLoading, error }) => {
  const [token, setToken] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (token.trim()) {
      await onLogin(token.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-white/10 rounded-full">
              <GithubIcon className="w-12 h-12 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">깃허브 오토 팔로우</h2>
          <p className="text-gray-300 text-sm">
            효율적이게 github관리하기
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <div className="space-y-4">
              <div>
                <label htmlFor="token" className="block text-sm font-medium text-gray-300 mb-2">
                  깃허브 허용 토큰을 넣어주세요
                </label>
                <div className="relative">
                  <KeyIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="token"
                    type="password"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center space-x-2 text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !token.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>연결중..</span>
                  </>
                ) : (
                  <>
                    <GithubIcon className="w-5 h-5" />
                    <span>깃허브에 연결됨</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-400 mb-2">
              Need a token?{' '}
              <a
                href="https://github.com/settings/tokens/new?scopes=user:follow"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                눌러서 만들기
              </a>
            </p>
            <p className="text-xs text-gray-500">
              Required scopes: <code className="bg-white/10 px-1 rounded">user:follow</code>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};