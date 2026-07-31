import React, { useState } from 'react';

export default function AdminPanel() {
  const [metrics] = useState({
    totalRescuedKg: '1,420 kg',
    activeListings: 12,
    activeClaims: 8,
    wastePreventedValue: '$4,850'
  });

  const [flaggedListings, setFlaggedListings] = useState([
    { id: 101, title: 'Prepared Casserole Tray', donor: 'Grand Kitchen', reason: 'Expiration timeline unclear', status: 'Pending Review' }
  ]);

  const handleRemove = (id) => {
    setFlaggedListings(flaggedListings.filter(item => item.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 min-h-screen bg-[#F8FAF7]">
      {/* Editorial Header */}
      <div className="mb-12 pb-6 border-b border-gray-200/60">
        <span className="text-xs font-bold tracking-widest text-food-primary uppercase block mb-2">Network Oversight</span>
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight font-serif">
          Impact Control Center.
        </h1>
        <p className="text-gray-600 mt-2 font-medium">Monitor global platform impact metrics, safety compliance, and content governance.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100/80">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Volume Rescued</p>
          <p className="text-4xl font-black text-food-primary mt-3 tracking-tight">{metrics.totalRescuedKg}</p>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100/80">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Surplus Lots</p>
          <p className="text-4xl font-black text-gray-900 mt-3 tracking-tight">{metrics.activeListings}</p>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100/80">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Claims</p>
          <p className="text-4xl font-black text-amber-600 mt-3 tracking-tight">{metrics.activeClaims}</p>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100/80">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Est. Value Saved</p>
          <p className="text-4xl font-black text-gray-900 mt-3 tracking-tight">{metrics.wastePreventedValue}</p>
        </div>
      </div>

      {/* Flagged Safety Listings Control */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100/80 p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight">Safety Compliance & Flagged Listings</h3>
        
        {flaggedListings.length === 0 ? (
          <p className="text-gray-400 py-8 text-center font-medium">No questionable or flagged listings right now. All clear! 🎉</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {flaggedListings.map(item => (
              <div key={item.id} className="py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                  <h4 className="font-bold text-gray-900 text-lg tracking-tight">{item.title}</h4>
                  <p className="text-sm text-gray-500 mt-1">Donor: <span className="font-semibold text-gray-700">{item.donor}</span> • Reason: <span className="text-red-500 font-semibold">{item.reason}</span></p>
                </div>
                <div className="flex gap-3">
                  <button className="bg-gray-900 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-food-primary transition shadow-sm">
                    Approve
                  </button>
                  <button 
                    onClick={() => handleRemove(item.id)}
                    className="bg-red-50 text-red-600 px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-red-100 transition"
                  >
                    Remove Lot
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}