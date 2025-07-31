import { useState, useEffect } from 'react';
import { LoginForm } from './components/LoginForm';
import { Dashboard } from './components/Dashboard';
import { GitHubUser } from './types/github';
import { githubApi } from './services/githubApi';

function App() {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('github_token');
    if (savedToken) {
      handleLogin(savedToken);
    }
  }, []);

  const handleLogin = async (token: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      githubApi.setToken(token);
      const userData = await githubApi.getCurrentUser();
      
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('github_token', token);
    } catch (error) {
      setError('Invalid token or network error. Please check your token and try again.');
      localStorage.removeItem('github_token');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('github_token');
    githubApi.setToken('');
  };

  if (!isAuthenticated) {
    return (
      <LoginForm
        onLogin={handleLogin}
        isLoading={isLoading}
        error={error}
      />
    );
  }

  return (
    <Dashboard
      user={user!}
      onLogout={handleLogout}
    />
  );
}

export default App;