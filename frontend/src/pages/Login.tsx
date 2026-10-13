import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, Factory } from 'lucide-react';
import { login } from '../api/authApi';
import { CircularProgress } from '@mui/material';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await login({ username, password });

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative"
      style={{
        backgroundImage: 'url(/bg_crane.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: '#1b1e24',
      }}
    >
      {/* Dark soft scrim so the light neumorphic panel pops */}
      <div className="absolute inset-0 bg-black/60" />

      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center text-white z-10">
        <div className="flex items-center gap-3">
          <div className="neu-icon-inset p-2" style={{ boxShadow: 'var(--neu-out-sm)' }}>
            <Factory size={26} className="text-emerald-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wider uppercase drop-shadow">3Tech Cranes and Lift Pvt. Ltd.</h1>
            <p className="text-sm text-gray-300">Boisar</p>
          </div>
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10 mt-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-white drop-shadow-md">
            Welcome to HRMS
          </h2>
          <p className="mt-2 text-md text-gray-300 drop-shadow-sm">
            Please sign in to access your dashboard
          </p>
        </div>

        <div className="neu-card py-8 px-6 sm:px-10">
          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="neu-inset-sm px-4 py-3 border-l-4 border-red-500">
                <p className="text-sm font-medium text-red-600">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-[color:var(--neu-text)]">Username</label>
              <div className="mt-2 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-[color:var(--neu-muted)]" />
                </div>
                <input
                  type="text"
                  required
                  className="neu-input pl-10 pr-3 block w-full py-3 text-sm"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[color:var(--neu-text)]">Password</label>
              <div className="mt-2 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-[color:var(--neu-muted)]" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="neu-input pl-10 pr-10 block w-full py-3 text-sm"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[color:var(--neu-muted)] hover:text-[color:var(--neu-text)] focus:outline-none"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 accent-emerald-600"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={loading}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-[color:var(--neu-text)] cursor-pointer">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-semibold text-emerald-600 hover:text-emerald-500">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="neu-btn-primary w-full flex justify-center py-3 px-4 text-sm disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <CircularProgress size={16} color="inherit" />
                    Signing in...
                  </span>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full p-4 flex justify-between items-center text-gray-400 text-xs z-10">
        <p>&copy; 2026 3Tech Cranes and Lift Pvt. Ltd. All rights reserved.</p>
        <p>v1.0.0 (Build 42)</p>
      </div>
    </div>
  );
};

export default Login;
