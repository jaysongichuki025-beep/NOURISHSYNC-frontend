import React, { useState, useEffect } from 'react';

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please sign in to view your dashboard.');
      setLoading(false);
      return;
    }

    fetch('http://localhost:5000/api/dashboard', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) setError(data.error);
        else setDashboardData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching dashboard:', err);
        setError('Failed to load dashboard data.');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center py-24 font-bold text-gray-500">Loading your dashboard...</div>;
  if (error) return <div className="text-center py-24 font-bold text-red-500">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 min-h-screen bg-[#F8FAF7]">
      <div className="mb-12 pb-6 border-b border-gray-200/60">
        <span className="text-xs font-bold tracking-widest text-food-primary uppercase block mb-2">Activity Hub</span>
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight font-serif">
          {dashboardData.role === 'donor' ? 'Donor Inventory & Claims.' : 'Recipient Claimed Lots.'}
        </h1>
        <p className="text-gray-600 mt-2 font-medium">
          {dashboardData.role === 'donor' 
            ? 'Track your posted food surplus and see which distribution hubs have claimed them.'
            : 'Manage your active food rescue pickups and confirm collection schedules.'}
        </p>
      </div>

      {dashboardData.role === 'receiver' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dashboardData.claims.length === 0 ? (
            <p className="text-gray-400 py-12 text-center col-span-full font-medium">You have not claimed any lots yet. Explore the Marketplace to start rescuing food!</p>
          ) : (
            dashboardData.claims.map(item => (
              <div key={item.claim_id} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100/80 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full">
                      {item.status}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">{item.listing.category}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{item.listing.title}</h3>
                  <div className="mt-6 space-y-2 text-sm text-gray-600">
                    <p>📍 <span className="font-semibold text-gray-700">{item.listing.pickup_location}</span></p>
                    <p>⚖️ <span className="font-semibold text-gray-700">{item.listing.quantity}</span></p>
                    <p>🏢 Donor: <span className="font-semibold text-gray-700">{item.listing.donor}</span></p>
                  </div>
                </div>
                <div className="mt-8 pt-6 border-t border-gray-50 text-xs font-bold text-gray-500">
                  Best Before: {item.listing.expiration_date}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {dashboardData.role === 'donor' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dashboardData.listings.length === 0 ? (
            <p className="text-gray-400 py-12 text-center col-span-full font-medium">You have not posted any surplus lots yet. Go to Donate Food to publish your first lot!</p>
          ) : (
            dashboardData.listings.map((item, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100/80 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className={`text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${item.is_claimed ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>
                      {item.claim_status}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">{item.listing.category}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{item.listing.title}</h3>
                  <div className="mt-6 space-y-2 text-sm text-gray-600">
                    <p>⚖️ Quantity: <span className="font-semibold text-gray-700">{item.listing.quantity}</span></p>
                    <p>📍 Location: <span className="font-semibold text-gray-700">{item.listing.pickup_location}</span></p>
                    {item.is_claimed ? (
                      <p className="mt-4 p-3 bg-amber-50 rounded-2xl text-xs font-bold text-amber-900 border border-amber-100">
                        🤝 Claimed by: <span className="underline">{item.claimed_by}</span>
                      </p>
                    ) : (
                      <p className="mt-4 p-3 bg-gray-50 rounded-2xl text-xs font-bold text-gray-500">
                        ⏳ Waiting for recipient claim...
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-8 pt-6 border-t border-gray-50 text-xs font-bold text-gray-500">
                  Expires: {item.listing.expiration_date}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}