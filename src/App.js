import React, { useState } from 'react';
import DiscoveryEngine from './components/DiscoveryEngine';
import DonorPortal from './components/DonorPortal';
import AdminPanel from './components/AdminPanel';

export default function App() {
  const [activeTab, setActiveTab] = useState('discovery');

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
            <button 
              onClick={() => setActiveTab('donor')}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition ${activeTab === 'donor' ? 'bg-white text-food-dark shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Donate Food
            </button>
            <button 
              onClick={() => setActiveTab('admin')}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition ${activeTab === 'admin' ? 'bg-white text-food-dark shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Impact Admin
            </button>
          </nav>

          {/* User Profile Pill */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-xs font-bold text-gray-900">Green Valley Hub</p>
              <p className="text-[10px] text-food-primary font-semibold uppercase tracking-wider">Verified Partner</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-food-light border-2 border-food-primary/20 flex items-center justify-center font-bold text-food-dark">
              GV
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow">
        {activeTab === 'discovery' && <DiscoveryEngine />}
        {activeTab === 'donor' && <DonorPortal />}
        {activeTab === 'admin' && <AdminPanel />}
      </main>
    </div>
  );
}