import React, { useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Scores expiration urgency so the most time-sensitive lots can be sorted/filtered
// to the top. Lower score = more urgent. Falls back to 99 for unrecognized text
// since the current data model stores expiration_date as free-form text.
function getUrgencyScore(expirationText = '') {
  const text = expirationText.toLowerCase();
  if (text.includes('tonight')) return 0;
  if (text.includes('today')) return 1;
  if (text.includes('tomorrow')) return 2;
  const daysMatch = text.match(/in (\d+)\s*day/);
  if (daysMatch) return 2 + parseInt(daysMatch[1], 10);
  return 99;
}

function getUrgencyLabel(score) {
  if (score <= 1) return { text: 'Urgent', className: 'bg-red-50 text-red-700' };
  if (score <= 2) return { text: 'Soon', className: 'bg-amber-50 text-amber-700' };
  if (score < 99) return { text: 'Upcoming', className: 'bg-gray-100 text-gray-600' };
  return { text: 'Flexible', className: 'bg-gray-100 text-gray-600' };
}

export default function DiscoveryEngine({ onClaimSuccess }) {
  const [listings, setListings] = useState([]);
  const [selectedListing, setSelectedListing] = useState(null);
  const [pickupTime, setPickupTime] = useState('Today (2:00 PM - 4:00 PM)');
  const [loading, setLoading] = useState(true);
  const [urgencyFilter, setUrgencyFilter] = useState('all');
  const [locationQuery, setLocationQuery] = useState('');

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

  // Sort by urgency first (most time-sensitive lots surface first), then apply filters.
  const filteredListings = listings
    .slice()
    .sort((a, b) => getUrgencyScore(a.expiration_date) - getUrgencyScore(b.expiration_date))
    .filter(item => {
      const score = getUrgencyScore(item.expiration_date);
      if (urgencyFilter === 'urgent' && score > 1) return false;
      if (urgencyFilter === 'soon' && score > 2) return false;
      if (locationQuery.trim() && !item.pickup_location.toLowerCase().includes(locationQuery.trim().toLowerCase())) {
        return false;
      }
      return true;
    });

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-serif font-black text-gray-900 mb-8">Surplus Food Marketplace</h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1">
          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
            Expiration Urgency
          </label>
          <select
            value={urgencyFilter}
            onChange={(e) => setUrgencyFilter(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-food-primary"
          >
            <option value="all">All lots</option>
            <option value="urgent">Urgent (today / tonight)</option>
            <option value="soon">Soon (today - tomorrow)</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
            Location search
          </label>
          <input
            type="text"
            value={locationQuery}
            onChange={(e) => setLocationQuery(e.target.value)}
            placeholder="e.g. Westlands, Downtown..."
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-food-primary"
          />
        </div>
      </div>

      {filteredListings.length === 0 && (
        <p className="text-gray-400 py-12 text-center font-medium">No lots match your current filters.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredListings.map(item => {
          const urgency = getUrgencyLabel(getUrgencyScore(item.expiration_date));
          // Fallback map for clean display if old seeded strings persist
          const displayDonorName = item.donor === 'grand_bakery' ? 'Grand Bakery' :
                                   item.donor === 'green_valley' ? 'Green Valley Farms' :
                                   item.donor === 'city_hotel' ? 'City Hotel Hub' :
                                   item.donor;

          return (
            <div key={item.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold bg-food-light text-food-primary px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {item.category}
                  </span>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${urgency.className}`}>
                    {urgency.text}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mt-3">{item.title}</h3>
                <p className="text-xs text-gray-500 mt-2 space-y-1">
                  <strong>Donor:</strong> <span className="font-semibold text-gray-800">{displayDonorName}</span> <br />
                  <strong>Location:</strong> <span className="font-semibold text-gray-800">{item.pickup_location}</span> <br />
                  <strong>Quantity:</strong> <span className="font-semibold text-gray-800">{item.quantity}</span> <br />
                  <strong>Expires:</strong> <span className="font-semibold text-gray-800">{item.expiration_date}</span>
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
              <p className="text-xs font-bold text-emerald-800 mb-1"> Donor Message Preview:</p>
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