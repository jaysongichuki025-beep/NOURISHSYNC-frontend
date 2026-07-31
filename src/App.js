import React, { useState } from 'react';
import DiscoveryEngine from './components/DiscoveryEngine';
import DonorPortal from './components/DonorPortal';
import AdminPanel from './components/AdminPanel';

export default function App() {
  const [activeTab, setActiveTab] = useState('discovery');

  return (
    <div className="min-h-screen bg-food-light flex flex-col">
      <header className="bg-food-dark p-4 shadow-md text-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl font-bold flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('discovery')}>
            🥗 NourishSync
          </h1>
          <nav className="flex gap-2 bg-food-dark/50 p-1.5 rounded-xl border border-white/10">
            <button 
              onClick={() => setActiveTab('discovery')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${activeTab === 'discovery' ? 'bg-food-primary text-white' : 'text-gray-300 hover:text-white'}`}
            >
              Discovery Engine
            </button>
            <button 
              onClick={() => setActiveTab('donor')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${activeTab === 'donor' ? 'bg-food-primary text-white' : 'text-gray-300 hover:text-white'}`}
            >
              Donor Portal
            </button>
            <button 
              onClick={() => setActiveTab('admin')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${activeTab === 'admin' ? 'bg-food-primary text-white' : 'text-gray-300 hover:text-white'}`}
            >
              Admin Panel
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        {activeTab === 'discovery' && <DiscoveryEngine />}
        {activeTab === 'donor' && <DonorPortal />}
        {activeTab === 'admin' && <AdminPanel />}
      </main>
    </div>
  );
}