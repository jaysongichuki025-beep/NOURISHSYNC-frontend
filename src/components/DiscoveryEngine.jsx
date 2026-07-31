import React, { useState, useEffect } from 'react';

export default function DiscoveryEngine() {
  const [listings, setListings] = useState([]);
  const [filterCategory, setFilterCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/listings')
      .then(res => res.json())
      .then(data => {
        setListings(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching listings:", err);
        setLoading(false);
      });
  }, []);

  const handleClaim = async (listingId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in as a recipient to claim surplus lots.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/claim', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ listing_id: listingId })
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
      } else {
        alert(data.error || 'Failed to claim lot.');
      }
    } catch (err) {
      console.error("Error claiming lot:", err);
      alert('Network error while claiming lot.');
    }
  };

  const filteredListings = filterCategory 
    ? listings.filter(item => item.category === filterCategory)
    : listings;

  if (loading) {
    return <div className="text-center py-20 font-bold text-gray-500">Loading live marketplace data...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 min-h-screen bg-[#F8FAF7]">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-gray-200/60 gap-6">
        <div>
          <span className="text-xs font-bold tracking-widest text-food-primary uppercase block mb-2">Live Inventory Feed</span>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight font-serif">
            Surplus & Rescue Marketplace.
          </h1>
        </div>
        
        <div className="flex gap-2 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100">
          {['', 'Produce', 'Bakery', 'Prepared'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${filterCategory === cat ? 'bg-food-dark text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
            >
              {cat === '' ? 'All Lots' : cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredListings.map(item => (
          <div key={item.id} className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100/80 flex flex-col justify-between group">
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 bg-food-light text-food-dark rounded-full">
                  {item.category}
                </span>
                <span className="text-xs text-gray-400 font-medium">{item.donor}</span>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 group-hover:text-food-primary transition tracking-tight">
                {item.title}
              </h3>
              
              <div className="mt-6 space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center text-xs">📍</span>
                  <span className="font-medium text-gray-700">{item.pickup_location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center text-xs">⚖️</span>
                  <span className="font-medium text-gray-700">{item.quantity}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-50">
              <div className="mb-4 flex items-center justify-between text-xs font-bold text-amber-800 bg-amber-50/70 p-3 rounded-2xl border border-amber-100/50">
                <span>⌛ Expires</span>
                <span>{item.expiration_date}</span>
              </div>
              
              <button 
                onClick={() => handleClaim(item.id)}
                className="w-full bg-gray-900 text-white font-bold py-3.5 rounded-2xl hover:bg-food-primary transition shadow-sm text-sm"
              >
                Claim Lot
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}