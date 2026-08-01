import React, { useState } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('receiver');
  const [organizationName, setOrganizationName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // CRITICAL FIX: Completely clear old storage BEFORE initiating login/register 
    // to prevent cross-account token and user profile overlapping.
    localStorage.clear();
    sessionStorage.clear();

    const endpoint = isRegistering 
      ? `${API_URL}/api/auth/register` 
      : `${API_URL}/api/auth/login`;

    const payload = isRegistering 
      ? { username, password, role, organization_name: organizationName, phone_number: phoneNumber }
      : { username, password };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (res.ok) {
        if (isRegistering) {
          alert("Registration successful! Please log in.");
          setIsRegistering(false);
        } else {
          // Save the fresh token and user data for this specific login session
          localStorage.setItem('token', data.token);
          localStorage.setItem('role', data.role);
          localStorage.setItem('user', JSON.stringify(data.user));
          
          onLoginSuccess(data.user);
          onClose();
          
          // Force a full page reload to ensure components mount with the correct active user
          window.location.reload();
        }
      } else {
        setError(data.error || 'Authentication failed.');
      }
    } catch (err) {
      console.error("Auth error:", err);
      setError('Server connection failed.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-gray-100 relative">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 font-bold text-lg"
        >
          ✕
        </button>

        <h2 className="text-3xl font-black font-serif text-gray-900 mb-2">
          {isRegistering ? 'Join NourishSync' : 'Welcome Back'}
        </h2>
        <p className="text-xs text-gray-500 mb-6">
          {isRegistering ? 'Create your food rescue profile' : 'Sign in to access your dashboard'}
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-xs font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Username</label>
            <input 
              type="text" required value={username} onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-food-primary"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Password</label>
            <input 
              type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-food-primary"
            />
          </div>

          {isRegistering && (
            <>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Account Role</label>
                <select 
                  value={role} onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-food-primary"
                >
                  <option value="receiver">Food Receiver / Hub</option>
                  <option value="donor">Food Donor</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Organization Name</label>
                <input 
                  type="text" required value={organizationName} onChange={(e) => setOrganizationName(e.target.value)}
                  placeholder="e.g. Community Kitchen"
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-food-primary"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">WhatsApp Phone Number</label>
                <input 
                  type="text" required value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="e.g. +254712345678"
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-food-primary"
                />
              </div>
            </>
          )}

          <button 
            type="submit"
            className="w-full bg-gray-900 text-white font-bold py-3.5 rounded-2xl hover:bg-food-primary transition shadow-sm text-sm mt-2"
          >
            {isRegistering ? 'Complete Registration' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            type="button"
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-xs font-bold text-food-primary hover:underline"
          >
            {isRegistering ? 'Already have an account? Sign In' : "Don't have an account? Register"}
          </button>
        </div>
      </div>
    </div>
  );
}