import React, { useState, useEffect } from 'react';
import DiscoveryEngine from './components/DiscoveryEngine';
import DonorPortal from './components/DonorPortal';
import AdminPanel from './components/AdminPanel';
import AuthModal from './components/AuthModal';

export default function App() {
  const [activeTab, setActiveTab] = useState('discovery');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setActiveTab('discovery');
  };

  return (
    <div className="min-h-screen bg-food-light flex flex-col font-sans">
      {/* Human-crafted Navbar */}
      <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => setActiveTab('discovery')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-food-primary flex items-center justify-center text-white text-xl shadow-sm group-hover:bg-food-dark transition">
              🥗
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-gray-900 block leading-none">
                Nourish<span className="text-food-primary">Sync</span>
              </span>
              <span className="text-xs font-medium text-gray-400">Community Food Network</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
            <button 
              onClick={() => setActiveTab('discovery')}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition ${activeTab === 'discovery' ? 'bg-white text-food-dark shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Marketplace
            </button>
            {user && user.role === 'donor' && (
              <button 
                onClick={() => setActiveTab('donor')}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition ${activeTab === 'donor' ? 'bg-white text-food-dark shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
              >
                Donate Food
              </button>
            )}
            {user && user.role === 'admin' && (
              <button 
                onClick={() => setActiveTab('admin')}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition ${activeTab === 'admin' ? 'bg-white text-food-dark shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
              >
                Impact Admin
              </button>
            )}
          </nav>

          {/* User Profile or Sign In Button */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:block text-right">
                  <p className="text-xs font-bold text-gray-900">{user.organization_name}</p>
                  <p className="text-[10px] text-food-primary font-semibold uppercase tracking-wider">{user.role}</p>
                </div>
                <button 
                  onClick={handleLogout}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl text-xs font-bold hover:bg-red-50 hover:text-red-600 transition"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsAuthOpen(true)}
                className="bg-gray-900 text-white px-5 py-2.5 rounded-2xl text-xs font-bold hover:bg-food-primary transition shadow-sm"
              >
                Sign In / Register
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow">
        {activeTab === 'discovery' && <DiscoveryEngine />}
        {activeTab === 'donor' && <DonorPortal />}
        {activeTab === 'admin' && <AdminPanel />}
      </main>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        onLoginSuccess={(loggedInUser) => {
          setUser(loggedInUser);
          if (loggedInUser.role === 'donor') setActiveTab('donor');
          else if (loggedInUser.role === 'admin') setActiveTab('admin');
          else setActiveTab('discovery');
        }}
      />
    </div>
  );
}