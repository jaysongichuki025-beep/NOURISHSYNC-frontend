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
    // Here you would normally call your backend API via fetchWithAuth('/listings', { method: 'POST', body: JSON.stringify(formData) })
    console.log("Submitting surplus donation:", formData);
    setSubmitted(true);
  };

  return (
    <div className="p-8 max-w-3xl mx-auto min-h-screen bg-food-light">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-food-dark tracking-tight">
          Donor Portal: Post Surplus Food
        </h1>
        <p className="text-gray-600 mt-2">Publish available edible surplus to connect with local distribution centers instantly.</p>
      </div>

      {submitted ? (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-food-primary/30 text-center">
          <div className="text-5xl mb-3">🎉</div>
          <h3 className="text-2xl font-bold text-food-dark">Listing Published Successfully!</h3>
          <p className="text-gray-600 mt-2">Your surplus food lot is now live in the Discovery Engine for nearby centers to claim.</p>
          <button 
            onClick={() => { setSubmitted(false); setFormData({ title: '', category: 'Produce', quantity: '', expiration_date: '', pickup_location: '' }); }}
            className="mt-6 bg-food-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-food-dark transition"
          >
            Post Another Listing
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Food Title / Description</label>
            <input 
              type="text" 
              name="title" 
              required
              placeholder="e.g., Fresh Organic Carrots & Potatoes"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-food-primary"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Food Category</label>
              <select 
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-food-primary"
              >
                <option value="Produce">Fresh Produce</option>
                <option value="Bakery">Bakery & Grains</option>
                <option value="Prepared">Prepared Meals</option>
                <option value="Dairy">Dairy & Eggs</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Quantity / Weight</label>
              <input 
                type="text" 
                name="quantity" 
                required
                placeholder="e.g., 20 kg or 40 boxes"
                value={formData.quantity}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-food-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Expiration / Best-By Date & Time</label>
              <input 
                type="text" 
                name="expiration_date" 
                required
                placeholder="e.g., Tomorrow, 4:00 PM"
                value={formData.expiration_date}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-food-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Precise Pickup Location</label>
              <input 
                type="text" 
                name="pickup_location" 
                required
                placeholder="e.g., 123 Market Street, Dock B"
                value={formData.pickup_location}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-food-primary"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-food-primary text-white font-semibold py-4 rounded-xl hover:bg-food-dark transition shadow-sm text-lg"
          >
            Publish Surplus Listing
          </button>
        </form>
      )}
    </div>
  );
}