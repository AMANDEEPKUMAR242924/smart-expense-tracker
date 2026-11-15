import { useState } from 'react';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return user ? (
    <Dashboard user={user} onLogout={handleLogout} />
  ) : (
    <AuthPage onAuthSuccess={setUser} />
  );
}