import { useState } from 'react';
import API from '../api';
import { Wallet } from 'lucide-react';

export default function AuthPage({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const payload = isLogin
        ? { email: form.email, password: form.password }
        : form;
      const { data } = await API.post(endpoint, payload);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      onAuthSuccess(data.user);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Wallet className="w-8 h-8 text-indigo-600" />
          <h1 className="text-2xl font-bold text-slate-800">ExpenseTracker</h1>
        </div>

        <h2 className="text-xl font-semibold text-center text-slate-700 mb-4">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          )}
          <input
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg transition cursor-pointer"
          >
            {loading ? 'Please wait...' : isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-600 mt-5">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="text-indigo-600 font-semibold hover:underline cursor-pointer"
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
}