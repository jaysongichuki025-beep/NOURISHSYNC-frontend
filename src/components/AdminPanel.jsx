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
    <div className="p-8 max-w-7xl mx-auto min-h-screen bg-food-light">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-food-dark tracking-tight">
          Administrative Control Panel
        </h1>
        <p className="text-gray-600 mt-2">Monitor global platform impact metrics, safety compliance, and content governance.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">Total Volume Rescued</p>
          <p className="text-3xl font-extrabold text-food-primary mt-2">{metrics.totalRescuedKg}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">Active Surplus Lots</p>
          <p className="text-3xl font-extrabold text-food-dark mt-2">{metrics.activeListings}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">Active Claims in Progress</p>
          <p className="text-3xl font-extrabold text-amber-600 mt-2">{metrics.activeClaims}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">Est. Value Saved</p>
          <p className="text-3xl font-extrabold text-food-dark mt-2">{metrics.wastePreventedValue}</p>
        </div>
      </div>

      {/* Flagged Safety Listings Control */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Safety Compliance & Flagged Listings</h3>
        
        {flaggedListings.length === 0 ? (
          <p className="text-gray-500 py-4 text-center">No questionable or flagged listings right now. All clear! 🎉</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {flaggedListings.map(item => (
              <div key={item.id} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">{item.title}</h4>
                  <p className="text-sm text-gray-600">Donor: <span className="font-medium">{item.donor}</span> | Reason: <span className="text-red-500 font-medium">{item.reason}</span></p>
                </div>
                <div className="flex gap-3">
                  <button className="bg-food-primary text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-food-dark transition">
                    Approve
                  </button>
                  <button 
                    onClick={() => handleRemove(item.id)}
                    className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-red-100 transition"
                  >
                    Remove Listing
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