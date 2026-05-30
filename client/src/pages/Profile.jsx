import React, { useState, useContext, useEffect } from 'react';
import { User, Key, MapPin, Plus, Trash2, ShieldCheck, AlertCircle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/Loader';

const Profile = () => {
  const { user, updateProfile, loading } = useContext(AuthContext);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Address fields
  const [addresses, setAddresses] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('United States');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setAddresses(user.addresses || []);
    }
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (password && password !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const payload = { name, email };
      if (password) payload.password = password;
      await updateProfile(payload);
      setSuccessMsg('Profile updated successfully!');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update profile');
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!street || !city || !state || !zipCode) {
      setErrorMsg('Please fill in all address fields');
      return;
    }
    setErrorMsg('');
    setSuccessMsg('');
    const newAddress = { street, city, state, zipCode, country, isDefault: addresses.length === 0 };
    const updatedAddresses = [...addresses, newAddress];

    try {
      await updateProfile({ name, email, addresses: updatedAddresses });
      setAddresses(updatedAddresses);
      setSuccessMsg('New shipping address saved successfully!');
      // Clear form
      setStreet('');
      setCity('');
      setState('');
      setZipCode('');
      setShowAddressForm(false);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save address');
    }
  };

  const handleDeleteAddress = async (index) => {
    const updatedAddresses = addresses.filter((_, idx) => idx !== index);
    // Adjust defaults if we deleted default address
    if (updatedAddresses.length > 0 && !updatedAddresses.some(a => a.isDefault)) {
      updatedAddresses[0].isDefault = true;
    }
    try {
      await updateProfile({ name, email, addresses: updatedAddresses });
      setAddresses(updatedAddresses);
      setSuccessMsg('Address removed successfully');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to remove address');
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Title */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
          <User className="text-primary animate-pulse" size={28} />
          <span>My Profile Dashboard</span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Manage your account profile, credentials, and saved shipping addresses.
        </p>
      </div>

      {/* Messages */}
      {errorMsg && (
        <div className="p-3.5 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-xl text-red-500 flex items-start gap-2 text-xs font-semibold">
          <AlertCircle size={16} className="mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}
      {successMsg && (
        <div className="p-3.5 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/30 rounded-xl text-green-500 flex items-start gap-2 text-xs font-semibold">
          <ShieldCheck size={16} className="mt-0.5" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Layout Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Profile Settings form column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <h3 className="text-sm font-bold text-slate-850 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Key size={16} className="text-primary" />
              <span>Security & Identity Settings</span>
            </h3>

            <form onSubmit={handleProfileSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 rounded-xl text-sm focus:ring-1 focus:ring-primary text-slate-800 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 rounded-xl text-sm focus:ring-1 focus:ring-primary text-slate-800 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400">New Password (Optional)</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-855 rounded-xl text-sm focus:ring-1 focus:ring-primary text-slate-800 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400">Confirm Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-855 rounded-xl text-sm focus:ring-1 focus:ring-primary text-slate-800 dark:text-white"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="sm:col-span-2 h-12 bg-primary hover:bg-primary-dark disabled:bg-primary/50 text-white font-bold text-sm rounded-xl shadow transition-all flex items-center justify-center gap-2 mt-4"
              >
                {loading ? <Loader size="small" color="white" /> : 'Save Profile Changes'}
              </button>
            </form>
          </div>
        </div>

        {/* Saved Addresses list column */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-850 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <MapPin size={16} className="text-primary" />
                <span>Shipping Addresses</span>
              </h3>
              
              {!showAddressForm && (
                <button
                  onClick={() => setShowAddressForm(true)}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 hover:text-primary transition-all"
                  aria-label="Add Address"
                >
                  <Plus size={16} />
                </button>
              )}
            </div>

            {/* Form to add address */}
            {showAddressForm && (
              <form onSubmit={handleAddAddress} className="space-y-3 bg-slate-50 dark:bg-slate-855 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 animate-fade-in text-xs">
                <h4 className="font-bold text-slate-750 dark:text-white uppercase">Add New Address</h4>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-400">Street Address</label>
                  <input
                    type="text"
                    required
                    placeholder="123 Shopping Blvd"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg focus:ring-1 focus:ring-primary text-slate-800 dark:text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-400">City</label>
                    <input
                      type="text"
                      required
                      placeholder="San Jose"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg focus:ring-1 focus:ring-primary text-slate-800 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-400">State / Region</label>
                    <input
                      type="text"
                      required
                      placeholder="CA"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg focus:ring-1 focus:ring-primary text-slate-800 dark:text-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-400">Zip / Postal Code</label>
                    <input
                      type="text"
                      required
                      placeholder="95112"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg focus:ring-1 focus:ring-primary text-slate-800 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-400">Country</label>
                    <input
                      type="text"
                      required
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg focus:ring-1 focus:ring-primary text-slate-800 dark:text-white"
                    />
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-bold"
                  >
                    Save Address
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddressForm(false)}
                    className="px-3 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg font-semibold hover:bg-slate-250"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* List of saved addresses */}
            {addresses.length === 0 ? (
              <p className="text-xs text-slate-400 leading-relaxed">
                You have no saved addresses. Add a shipping location above to use it during checkout.
              </p>
            ) : (
              <div className="space-y-3.5 divide-y divide-slate-100 dark:divide-slate-800">
                {addresses.map((addr, idx) => (
                  <div key={idx} className={`pt-3.5 flex justify-between items-start text-xs ${idx === 0 ? 'pt-0 border-t-0' : ''}`}>
                    <div className="space-y-0.5 leading-relaxed text-slate-650 dark:text-slate-350">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-850 dark:text-white">Address #{idx + 1}</span>
                        {addr.isDefault && (
                          <span className="bg-primary/10 text-primary font-bold px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider">
                            Default
                          </span>
                        )}
                      </div>
                      <p>{addr.street}</p>
                      <p>{addr.city}, {addr.state} {addr.zipCode}</p>
                      <p>{addr.country}</p>
                    </div>

                    <button
                      onClick={() => handleDeleteAddress(idx)}
                      className="p-1.5 text-slate-400 hover:text-red-500 transition-colors border border-slate-100 dark:border-slate-800 rounded-lg hover:bg-red-50/50"
                      aria-label="Delete Address"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
export { Profile };
