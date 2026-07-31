import React from 'react';
import DiscoveryEngine from './components/DiscoveryEngine';

function App() {
  return (
    <div className="min-h-screen bg-food-light">
      <header className="bg-food-dark p-4 shadow-md text-white">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            🥗 NourishSync
          </h1>
          <span className="text-sm bg-food-primary px-3 py-1 rounded-full font-medium">Recipient Portal</span>
        </div>
      </header>
      <main>
        <DiscoveryEngine />
      </main>
    </div>
  );
}

export default App;