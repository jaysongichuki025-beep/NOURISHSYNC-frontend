import React, { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [data, setData] = useState({ users: [], listings: [], total_listings: 0, total_claims: 0 });
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const dashData = await res.json();
      if (res.ok) {
        setData(dashData);
      }
      setLoading(false);
    } catch (err) {
      console.error("Error loading admin data:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleDepublishListing = async (listingId) => {
    if (!window.confirm("Are you sure you want to depublish or remove this donation lot?")) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/admin/listings/${listingId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        alert("Donation successfully removed.");
        fetchAdminData();
      } else {
        alert("Failed to remove listing.");
      }
    } catch (err) {
      console.error("Error deleting listing:", err);
    }
  };

  if (loading) {
    return <div className="text-center py-20 font-bold text-gray-500">Loading System Master Control...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 min-h-screen bg-[#F8FAF7]">
      <div className="mb-12 pb-6 border-b border-gray-200">
        <span className="text-xs font-bold tracking-widest text-food-primary uppercase block mb-2">System Administrator Panel</span>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight font-serif">Platform Master Control Center</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Accounts</p>
          <p className="text-4xl font-black text-gray-900 mt-2">{data.users.length}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Donations Created</p>
          <p className="text-4xl font-black text-gray-900 mt-2">{data.listings.length}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Claims Processed</p>
          <p className="text-4xl font-black text-gray-900 mt-2">{data.total_claims}</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">All Platform Accounts</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-xs font-bold text-gray-400 uppercase">
                <th className="pb-4">ID</th>
                <th className="pb-4">Username</th>
                <th className="pb-4">Organization Name</th>
                <th className="pb-4">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {data.users.map(u => (
                <tr key={u.id} className="hover:bg-gray-50/50 transition">
                  <td className="py-4 text-gray-400 font-medium">#{u.id}</td>
                  <td className="py-4 font-bold text-gray-900">{u.username}</td>
                  <td className="py-4 text-gray-600">{u.organization_name}</td>
                  <td className="py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      u.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                      u.role === 'donor' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Donation Tracking & Claims Audit</h2>
        <div className="space-y-4">
          {data.listings.length === 0 ? (
            <p className="text-sm text-gray-500">No donations registered in the system.</p>
          ) : (
            data.listings.map(item => (
              <div key={item.listing.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-5 rounded-2xl bg-gray-50 border border-gray-100 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
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
                  <p className="text-xs text-gray-500">
                    <strong className="text-gray-700">Donor:</strong> {item.listing.donor} | <strong className="text-gray-700">Qty:</strong> {item.listing.quantity} | <strong className="text-gray-700">Claimed By:</strong> <span className="text-indigo-600 font-semibold">{item.claimed_by}</span>
                  </p>
                </div>

                <button
                  onClick={() => handleDepublishListing(item.listing.id)}
                  className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm whitespace-nowrap"
                >
                  Depublish / Remove Lot
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}