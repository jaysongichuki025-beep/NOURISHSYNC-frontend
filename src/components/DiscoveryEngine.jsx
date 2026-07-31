import React, { useState } from 'react';

export default function DiscoveryEngine() {
  const [listings] = useState([
    {
      id: 1,
      title: 'Fresh Organic Tomatoes',
      category: 'Produce',
      quantity: '15 kg',
      pickup_location: 'Green Valley Supermarket',
      expiration_date: 'Tomorrow, 5:00 PM'
    },
    {
      id: 2,
      title: 'Assorted Sourdough Bread',
      category: 'Bakery',
      quantity: '30 loaves',
      pickup_location: 'Artisan Bakery Hub',
      expiration_date: 'Today, 9:00 PM'
    }
  ]);

  const [filterCategory, setFilterCategory] = useState('');

  const filteredListings = filterCategory 
    ? listings.filter(item => item.category === filterCategory)
    : listings;

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen bg-food-light">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-food-dark tracking-tight">
          Surplus Food Discovery Engine
        </h1>
        <p className="text-gray-600 mt-2">Browse available surplus food listings near your distribution center.</p>
      </div>
      
      <div className="mb-6 flex gap-4">
        <select 
          className="p-3 border border-gray-200 rounded-xl shadow-sm bg-white text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-food-primary"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Produce">Fresh Produce</option>
          <option value="Bakery">Bakery & Grains</option>
          <option value="Prepared">Prepared Meals</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.map(item => (
          <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <span className="text-xs font-bold px-3 py-1 bg-food-primary/10 text-food-primary rounded-full uppercase tracking-wide">
              {item.category}
            </span>
            <h3 className="text-2xl font-bold mt-3 text-gray-900">{item.title}</h3>
            <div className="space-y-1 mt-3 text-gray-600 text-sm">
              <p>📍 <span className="font-medium">Location:</span> {item.pickup_location}</p>
              <p>⚖️ <span className="font-medium">Quantity:</span> {item.quantity}</p>
            </div>
            <div className="mt-4 p-3 bg-food-accent/10 rounded-xl border border-food-accent/20 text-sm font-semibold text-amber-800">
              ⌛ Best by: {item.expiration_date}
            </div>
            <button className="mt-5 w-full bg-food-primary text-white font-semibold py-3 rounded-xl hover:bg-food-dark transition shadow-sm">
              Claim Donation Lot
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}