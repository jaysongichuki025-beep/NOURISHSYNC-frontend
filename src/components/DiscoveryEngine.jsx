import React, { useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function DiscoveryEngine({ onClaimSuccess }) {
  const [listings, setListings] = useState([]);
  const [selectedListing, setSelectedListing] = useState(null);
  const [pickupTime, setPickupTime] = useState('Today (2:00 PM - 4:00 PM)');
  const [loading, setLoading] = useState(true);

  const fetchListings = async () => {
    try {
      const res = await fetch(`${API_URL}/api/listings`);
      const data = await res.json();
      if (res.ok) setListings(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching listings:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleConfirmClaim = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please sign in to claim a food lot.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/claim`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          listing_id: selectedListing.id,
          pickup_time: pickupTime 
        })
      });
      const data = await res.json();
      if (res.ok) {
        alert("Lot successfully claimed! Thank-you message & pickup window sent to the donor.");
        setSelectedListing(null);
        fetchListings();
        if (onClaimSuccess) onClaimSuccess();
      } else {
        alert(data.error || "Failed to claim lot.");
      }
    } catch (err) {
      console.error("Claim error:", err);
    }
  };

  if (loading) return <div className="text-center py-20 font-bold text-gray-400">Loading Marketplace...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-serif font-black text-gray-900 mb-8">Surplus Food Marketplace</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {listings.map(item => {
          // Fallback map for clean display if old seeded strings persist
          const displayDonorName = item.donor === 'grand_bakery' ? 'Grand Bakery' :
                                   item.donor === 'green_valley' ? 'Green Valley Farms' :
                                   item.donor === 'city_hotel' ? 'City Hotel Hub' :
                                   item.donor;

          return (
            <div key={item.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold bg-food-light text-food-primary px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {item.category}
                </span>
                <h3 className="text-xl font-bold text-gray-900 mt-3">{item.title}</h3>
                <p className="text-xs text-gray-500 mt-2 space-y-1">
                  <strong>Donor:</strong> <span className="font-semibold text-gray-800">{displayDonorName}</span> <br />
                  <strong>Location:</strong> <span className="font-semibold text-gray-800">{item.pickup_location}</span> <br />
                  <strong>Quantity:</strong> <span className="font-semibold text-gray-800">{item.quantity}</span>
                </p>
              </div>
              <button
                onClick={() => setSelectedListing(item)}
                className="mt-6 w-full bg-gray-900 text-white py-3 rounded-xl text-xs font-bold hover:bg-food-primary transition shadow-sm"
              >
                Claim Lot
              </button>
            </div>
          );
        })}
      </div>

      {selectedListing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl border border-gray-100 space-y-6">
            <div>
              <span className="text-xs font-bold text-food-primary uppercase tracking-wider">Schedule Pickup</span>
              <h2 className="text-2xl font-bold font-serif text-gray-900 mt-1">Claim: {selectedListing.title}</h2>
              <p className="text-xs text-gray-500 mt-1">Select your preferred collection window. This schedule and a thank-you note will be delivered to the donor.</p>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Select Pickup Window</label>
              <select 
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-food-primary"
              >
                <option value="Today (2:00 PM - 4:00 PM)">Today (2:00 PM - 4:00 PM)</option>
                <option value="Today (4:00 PM - 6:00 PM)">Today (4:00 PM - 6:00 PM)</option>
                <option value="Tomorrow Morning (9:00 AM - 11:00 AM)">Tomorrow Morning (9:00 AM - 11:00 AM)</option>
                <option value="Tomorrow Afternoon (1:00 PM - 3:00 PM)">Tomorrow Afternoon (1:00 PM - 3:00 PM)</option>
              </select>
            </div>

            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
              <p className="text-xs font-bold text-emerald-800 mb-1">💌 Donor Message Preview:</p>
              <p className="text-xs text-emerald-900 italic">
                "Thank you for your generous donation! Our team has scheduled the rescue pickup for <strong className="text-gray-900">{pickupTime}</strong> at {selectedListing.pickup_location}."
              </p>
            </div>

            <div className="flex gap-4 pt-2">
              <button
                onClick={() => setSelectedListing(null)}
                className="w-1/2 bg-gray-100 text-gray-700 py-3 rounded-xl text-xs font-bold hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmClaim}
                className="w-1/2 bg-gray-900 text-white py-3 rounded-xl text-xs font-bold hover:bg-food-primary transition shadow-sm"
              >
                Confirm & Send Notice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}