import React, { useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function DonorPortal({ onListingCreated }) {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Produce');
  const [pickupLocation, setPickupLocation] = useState('');
  const [quantity, setQuantity] = useState('');
  const [expirationDate, setExpirationDate] = useState('');

  const fetchDonorDashboard = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/dashboard`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setListings(data.listings || []);
      setLoading(false);
    } catch (err) {
      console.error("Error loading donor dashboard:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonorDashboard();
  }, []);

  const handleCreateListing = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    try {
      const res = await fetch(`${API_URL}/api/listings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          category,
          donor: user.organization_name || user.username,
          pickup_location: pickupLocation,
          quantity,
          expiration_date: expirationDate
        })
      });

      if (res.ok) {
        alert("Donation lot published successfully!");
        setTitle('');
        setPickupLocation('');
        setQuantity('');
        setExpirationDate('');
        fetchDonorDashboard();
        if (onListingCreated) onListingCreated();
      } else {
        alert("Failed to publish listing.");
      }
    } catch (err) {
      console.error("Error publishing listing:", err);
    }
  };

  if (loading) return <div className="text-center py-20 font-bold text-gray-400">Loading Donor Portal...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-serif font-black text-gray-900 tracking-tight">Food Donor Portal</h1>
        <p className="text-sm text-gray-500 mt-1">Publish surplus food lots and monitor real-time recipient pickup schedules.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Publish Form */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm h-fit">
          <h2 className="text-2xl font-bold font-serif text-gray-900 mb-6">Publish Surplus Lot</h2>
          <form onSubmit={handleCreateListing} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Lot Title</label>
              <input 
                type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-food-primary"
                placeholder="e.g. Fresh Bakery Pastries"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Category</label>
              <select 
                value={category} onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-food-primary"
              >
                <option value="Produce">Produce</option>
                <option value="Bakery">Bakery</option>
                <option value="Prepared">Prepared Meals</option>
                <option value="Dairy">Dairy</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Pickup Location</label>
              <input 
                type="text" required value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-food-primary"
                placeholder="e.g. 123 Market St, Nairobi"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Quantity</label>
                <input 
                  type="text" required value={quantity} onChange={(e) => setQuantity(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-food-primary"
                  placeholder="e.g. 10 kg"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Expiration</label>
                <input 
                  type="text" required value={expirationDate} onChange={(e) => setExpirationDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-food-primary"
                  placeholder="e.g. Tomorrow"
                />
              </div>
            </div>
            <button 
              type="submit"
              className="w-full bg-gray-900 text-white font-bold py-3.5 rounded-2xl hover:bg-food-primary transition shadow-sm text-sm mt-4"
            >
              Publish Surplus Lot
            </button>
          </form>
        </div>

        {/* Active Listings & Claim / Pickup Schedule Audit */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h2 className="text-2xl font-bold font-serif text-gray-900 mb-6">Your Published Lots & Claims</h2>
          <div className="space-y-4">
            {listings.length === 0 ? (
              <p className="text-sm text-gray-500">You haven't published any lots yet.</p>
            ) : (
              listings.map(item => (
                <div key={item.listing.id} className="p-5 rounded-2xl bg-gray-50 border border-gray-100 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-food-primary uppercase tracking-wider bg-food-light px-2.5 py-0.5 rounded-full">
                      {item.listing.category}
                    </span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                      item.is_claimed ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {item.claim_status}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-gray-900">{item.listing.title}</h4>
                  <p className="text-xs text-gray-500">Qty: {item.listing.quantity} | Location: {item.listing.pickup_location}</p>

                  {item.is_claimed && (
                    <div className="bg-white p-4 rounded-xl border border-gray-200 text-xs text-gray-700 space-y-1 mt-3">
                      <p><strong className="text-gray-900">Claimed By:</strong> {item.claimed_by}</p>
                      <p><strong className="text-gray-900">Scheduled Pickup Window:</strong> <span className="text-food-primary font-bold">{item.pickup_time}</span></p>
                      <p className="italic text-gray-500 mt-2">
                        💌 Thank-you note from recipient: "Thank you for your generous donation! Our team has scheduled the rescue pickup for <strong className="text-gray-900">{item.pickup_time}</strong>."
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}