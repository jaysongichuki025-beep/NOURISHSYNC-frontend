import React, { useState } from 'react';

export default function DonorPortal() {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Produce',
    quantity: '',
    expiration_date: '',
    pickup_location: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting surplus donation:", formData);
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 min-h-screen bg-[#F8FAF7]">
      {/* Editorial Header */}
      <div className="mb-12 pb-6 border-b border-gray-200/60">
        <span className="text-xs font-bold tracking-widest text-food-primary uppercase block mb-2">Partner Contribution</span>
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight font-serif">
          Post Surplus Food.
        </h1>
        <p className="text-gray-600 mt-2 font-medium">Publish available edible stock instantly to connect with nearby distribution centers.</p>
      </div>

      {submitted ? (
        <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100 text-center">
          <div className="w-16 h-16 bg-food-light text-food-primary rounded-2xl mx-auto flex items-center justify-center text-3xl mb-6">🎉</div>
          <h3 className="text-3xl font-black text-gray-900 tracking-tight">Listing Published Successfully</h3>
          <p className="text-gray-600 mt-3 max-w-md mx-auto">Your surplus food lot is now live in the marketplace for local partners to claim.</p>
          <button 
            onClick={() => { setSubmitted(false); setFormData({ title: '', category: 'Produce', quantity: '', expiration_date: '', pickup_location: '' }); }}
            className="mt-8 bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-food-primary transition shadow-sm text-sm"
          >
            Post Another Lot
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100/80 space-y-8">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Food Title / Description</label>
            <input 
              type="text" 
              name="title" 
              required
              placeholder="e.g., Fresh Organic Carrots & Potatoes"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-4 border border-gray-200/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-food-primary bg-gray-50/50 font-medium text-gray-900 transition"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Food Category</label>
              <select 
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-4 border border-gray-200/80 rounded-2xl bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-food-primary font-medium text-gray-900 transition"
              >
                <option value="Produce">Fresh Produce</option>
                <option value="Bakery">Bakery & Grains</option>
                <option value="Prepared">Prepared Meals</option>
                <option value="Dairy">Dairy & Eggs</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Quantity / Weight</label>
              <input 
                type="text" 
                name="quantity" 
                required
                placeholder="e.g., 20 kg or 40 boxes"
                value={formData.quantity}
                onChange={handleChange}
                className="w-full p-4 border border-gray-200/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-food-primary bg-gray-50/50 font-medium text-gray-900 transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Expiration / Best-By Date & Time</label>
              <input 
                type="text" 
                name="expiration_date" 
                required
                placeholder="e.g., Tomorrow, 4:00 PM"
                value={formData.expiration_date}
                onChange={handleChange}
                className="w-full p-4 border border-gray-200/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-food-primary bg-gray-50/50 font-medium text-gray-900 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Precise Pickup Location</label>
              <input 
                type="text" 
                name="pickup_location" 
                required
                placeholder="e.g., 123 Market Street, Dock B"
                value={formData.pickup_location}
                onChange={handleChange}
                className="w-full p-4 border border-gray-200/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-food-primary bg-gray-50/50 font-medium text-gray-900 transition"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-gray-900 text-white font-bold py-4 rounded-2xl hover:bg-food-primary transition shadow-sm text-base"
          >
            Publish Surplus Listing
          </button>
        </form>
      )}
    </div>
  );
}