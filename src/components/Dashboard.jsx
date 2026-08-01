import React, { useState, useEffect } from 'react';

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboard = () => {
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
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleApproveClaim = async (claimId) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/claims/${claimId}/approve`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (res.ok) {
        alert("Claim request accepted!");
        fetchDashboard();
      } else {
        alert("Failed to approve claim.");
      }
    } catch (err) {
      console.error("Approval error:", err);
    }
  };

  const handleOpenWhatsApp = (recipientName, listingTitle, pickupTime, phoneNumber = '') => {
    const cleanPhone = phoneNumber ? phoneNumber.replace(/[^0-9]/g, '') : '';
    
    if (!cleanPhone) {
      alert("This listing's account sample record lacks a registered direct phone number for instant chat.");
      return;
    }

    const message = encodeURIComponent(
      `Hello ${recipientName || 'there'}, regarding your claim for "${listingTitle}" scheduled for pickup at ${pickupTime}.`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

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
            ? 'Review incoming rescue claims, accept pickup schedules, and coordinate with receivers.'
            : 'Track approval status for your requested food pickups.'}
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
                    <span className={`text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${
                      item.status === 'Approved' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {item.status}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">{item.listing.category}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{item.listing.title}</h3>
                  <div className="mt-6 space-y-2 text-sm text-gray-600">
                    <p>📍 <span className="font-semibold text-gray-700">{item.listing.pickup_location}</span></p>
                    <p>⚖️ <span className="font-semibold text-gray-700">{item.listing.quantity}</span></p>
                    <p>🏢 Donor: <span className="font-semibold text-gray-700">{item.listing.donor}</span></p>
                    <div className="mt-4 p-3 bg-food-light/60 rounded-2xl border border-food-light text-xs text-food-dark">
                      <p>🕒 <strong className="text-gray-900">Requested Pickup Window:</strong> <span className="font-bold">{item.pickup_time}</span></p>
                    </div>
                  </div>
                </div>
                <div className="mt-8 pt-6 border-t border-gray-50">
                  <button
                    onClick={() => handleOpenWhatsApp(item.listing.donor, item.listing.title, item.pickup_time, item.donor_phone)}
                    className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition text-xs shadow-sm flex items-center justify-center gap-2"
                  >
                    💬 WhatsApp Donor for Instructions
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {dashboardData.role === 'donor' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dashboardData.listings.length === 0 ? (
            <p className="text-gray-400 py-12 text-center col-span-full font-medium">You have not posted any surplus lots yet.</p>
          ) : (
            dashboardData.listings.map((item, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100/80 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className={`text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${
                      item.claim_status === 'Approved' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {item.claim_status}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">{item.listing.category}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{item.listing.title}</h3>
                  <div className="mt-6 space-y-2 text-sm text-gray-600">
                    <p>⚖️ Quantity: <span className="font-semibold text-gray-700">{item.listing.quantity}</span></p>
                    <p>📍 Location: <span className="font-semibold text-gray-700">{item.listing.pickup_location}</span></p>
                    {item.is_claimed ? (
                      <div className="mt-4 p-4 bg-amber-50 rounded-2xl text-xs space-y-2 border border-amber-100 text-amber-900">
                        <p className="font-bold">🤝 Claimed by: <span className="underline">{item.claimed_by}</span></p>
                        {item.receiver_phone && (
                          <p className="font-bold">📞 Phone: <span className="text-gray-800">{item.receiver_phone}</span></p>
                        )}
                        <p className="font-bold">🕒 Pickup Time: <span className="text-food-dark">{item.pickup_time}</span></p>
                        
                        {item.claim_status === 'Pending Approval' ? (
                          <button 
                            onClick={() => handleApproveClaim(item.claim_id)}
                            className="mt-2 w-full bg-gray-900 text-white py-2.5 rounded-xl font-bold hover:bg-food-primary transition text-xs shadow-sm"
                          >
                            Accept Claim Request
                          </button>
                        ) : (
                          <p className="text-emerald-700 font-bold text-center pt-1">✓ Claim Approved & Confirmed</p>
                        )}
                      </div>
                    ) : (
                      <p className="mt-4 p-3 bg-gray-50 rounded-2xl text-xs font-bold text-gray-500">
                        ⏳ Waiting for recipient claim...
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between text-xs font-bold text-gray-500">
                  <span>Expires: {item.listing.expiration_date}</span>
                  {item.is_claimed && item.receiver_phone && (
                    <button
                      onClick={() => handleOpenWhatsApp(item.claimed_by, item.listing.title, item.pickup_time, item.receiver_phone)}
                      className="bg-blue-600 text-white px-3 py-2 rounded-xl hover:bg-blue-700 transition shadow-sm inline-flex items-center gap-1"
                    >
                      💬 Message Receiver
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}