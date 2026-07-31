import React, { useState } from 'react';

export default function AuthPortal({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'Recipient'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate token response and pass user state up
    console.log(isLogin ? "Logging in..." : "Registering...", formData);
    localStorage.setItem('access_token', 'mock_jwt_token_12345');
    if (onLoginSuccess) onLoginSuccess();
  };

  return (
    <div className="min-h-screen bg-food-light flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h2 className="text-4xl font-extrabold text-food-dark tracking-tight">
          🥗 NourishSync
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          {isLogin ? "Sign in to your account" : "Register a new account"}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-sm border border-gray-100 rounded-2xl sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-bold text-gray-700">Email Address</label>
              <div className="mt-1">
                <input 
                  type="email" 
                  name="email" 
                  required 
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-food-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700">Password</label>
              <div className="mt-1">
                <input 
                  type="password" 
                  name="password" 
                  required 
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-food-primary"
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-bold text-gray-700">Account Role</label>
                <div className="mt-1">
                  <select 
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-food-primary"
                  >
                    <option value="Recipient">Recipient / Distribution Center</option>
                    <option value="Donor">Food Donor</option>
                    <option value="Admin">Administrator</option>
                  </select>
                </div>
              </div>
            )}

            <div>
              <button 
                type="submit"
                className="w-full bg-food-primary text-white font-semibold py-3 rounded-xl hover:bg-food-dark transition shadow-sm"
              >
                {isLogin ? "Sign In" : "Create Account"}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm font-medium text-food-primary hover:text-food-dark"
            >
              {isLogin ? "Need an account? Register here" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}