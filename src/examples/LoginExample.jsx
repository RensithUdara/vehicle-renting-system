import React, { useState } from 'react';
import { authAPI } from '../api';
import { useNavigate } from 'react-router-dom';

const LoginExample = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.login(formData);
      
      if (response.success) {
        // Token is automatically stored by authAPI.login()
        console.log('Login successful:', response.data.user);
        
        // Redirect based on user role
        const user = response.data.user;
        if (user.role === 'admin' || user.role === 'staff') {
          navigate('/dashboard');
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // Quick login buttons for testing
  const quickLogin = async (email, password) => {
    setFormData({ email, password });
    // Simulate form submission
    setTimeout(() => {
      handleSubmit({ preventDefault: () => {} });
    }, 100);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        
        {/* Quick Login Buttons for Testing */}
        <div className="bg-blue-50 p-4 rounded-md">
          <p className="text-sm text-blue-800 mb-2">Quick Login (for testing):</p>
          <div className="space-y-2">
            <button
              onClick={() => quickLogin('admin@vehiclerental.com', 'admin123')}
              className="w-full text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            >
              Login as Admin
            </button>
            <button
              onClick={() => quickLogin('staff@vehiclerental.com', 'staff123')}
              className="w-full text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
            >
              Login as Staff
            </button>
            <button
              onClick={() => quickLogin('customer@example.com', 'customer123')}
              className="w-full text-xs bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
            >
              Login as Customer
            </button>
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginExample;
