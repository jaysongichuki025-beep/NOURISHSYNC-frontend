import React, { useState } from 'react';

export default function DonorPortal({ onListingCreated }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Produce');
  const [donor, setDonor] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [quantity, setQuantity] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in as a food donor to post surplus lots.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/listings', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          category,
          donor,
          pickup_location: pickupLocation,
          quantity,
          expiration_date: expirationDate
        })
      });

      const data = await response.json();
      if (response.ok) {
        setSuccessMessage('Surplus lot successfully published to the live marketplace! 🎉');
        setTitle('');
        setDonor('');
        setPickupLocation('');
        setQuantity('');
        setExpirationDate('');
        if (onListingCreated) onListingCreated();
      } else {
        alert(data.error || 'Failed to create listing.');
      }
    } catch (err) {
      console.error('Error posting listing:', err);
      alert('Network error while posting listing.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 min-h-screen bg-[#F8FAF7]">
      <div className="mb-12 pb-6 border-b border-gray-200/60">
        <span className="text-xs font-bold tracking-widest text-food-primary uppercase block mb-2">Donor Portal</span>
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight font-serif">
          Post Surplus Food.
        </h1>
        <p className="text-gray-600 mt-2 font-medium">List available food items, specify quantities, and connect with local distribution hubs instantly.</p>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100/80">
        {successMessage && (
          <div className="mb-6 p-4 bg-food-light text-food-dark rounded-2xl text-xs font-bold border border-emerald-100">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Item Title</label>
              <input 
                type="text" 
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-food-primary text-sm font-medium"
                placeholder="e.g. Fresh Organic Spinach Lots"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Food Category</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-food-primary text-sm font-medium bg-white"
              >
                <option value="Produce">Produce</option>
                <option value="Bakery">Bakery</option>
                <option value="Prepared">Prepared Meals</option>
                <option value="Dairy">Dairy & Refrigerated</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Donor / Business Name</label>
              <input 
                type="text" 
                required
                value={donor}
                onChange={(e) => setDonor(e.target.value)}
                className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-food-primary text-sm font-medium"
                placeholder="e.g. Green Valley Farm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Pickup Location</label>
              <input 
                type="text" 
                required
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-food-primary text-sm font-medium"
                placeholder="e.g. 123 Market St, Nairobi"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Weight / Quantity</label>
              <input 
                type="text" 
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-food-primary text-sm font-medium"
                placeholder="e.g. 15 kg or 20 loaves"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Expiration / Best-By Date</label>
              <input 
                type="text" 
                required
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
                className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-food-primary text-sm font-medium"
                placeholder="e.g. Tomorrow or In 2 days"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white font-bold py-4 rounded-2xl hover:bg-food-primary transition shadow-sm text-sm mt-8"
          >
            {loading ? 'Publishing Listing...' : 'Publish Surplus Lot'}
          </button>
        </form>
      </div>
    </div>
  );
}