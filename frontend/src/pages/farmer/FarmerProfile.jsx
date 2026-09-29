import { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { FaUser, FaTractor, FaSeedling, FaMapMarkerAlt, FaFlask, FaTint, FaCoins, FaSave, FaCheckCircle } from 'react-icons/fa';

export default function FarmerProfile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    personal: { age: 38, preferredLanguage: 'en', experienceYears: 12, education: 'Higher Secondary' },
    location: { state: 'Karnataka', district: 'Mysuru', taluk: 'Hunsur', village: 'Bilikere', pincode: '571105' },
    farmDetails: {
      totalLandArea: 2.5,
      landUnit: 'acres',
      soilType: 'Red',
      soilPh: 6.8,
      nitrogen: 160,
      phosphorus: 45,
      potassium: 190,
      irrigationType: 'Borewell / Tube Well',
      waterAvailability: 'Moderate (Seasonal)',
      farmingMethod: 'Conventional',
    },
    financial: {
      annualBudget: 85000,
      inputBudget: 45000,
      primaryGoal: 'Max Profit',
    },
    currentCrops: ['Tomato', 'Ragi'],
    previousCrops: ['Paddy'],
    machinery: ['Tractor', 'Power Sprayer'],
    livestock: [{ animalType: 'Cattle', count: 2, breed: 'Hallikar' }],
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/farmer-profile/me');
        if (data.profile) {
          setProfile(data.profile);
        }
      } catch (err) {
        console.error('Failed to fetch profile', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put('/farmer-profile/me', profile);
      if (data.success) {
        toast.success('AI Farmer Profile updated successfully!');
      }
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="spinner-wrap"><div className="spinner"></div></div>;

  return (
    <div className="fade-in max-w-5xl mx-auto">
      <div className="page-header flex justify-between items-start mb-8">
        <div>
          <h1 className="page-title flex items-center gap-3">
            <FaSeedling className="text-primary-light" /> AI Farmer Profile & Soil Passport
          </h1>
          <p className="page-subtitle">Central intelligence context driving personalized recommendations, schemes, and copilot answers.</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn btn-primary btn-lg flex items-center gap-2">
          {saving ? 'Saving Profile...' : <><FaSave /> Save Profile</>}
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Section 1: Location & Land */}
        <div className="card p-8">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-gold">
            <FaMapMarkerAlt /> 1. Geo-Location & Landholding
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="form-group">
              <label className="form-label">State</label>
              <select
                className="form-input"
                value={profile.location?.state || 'Karnataka'}
                onChange={(e) => setProfile({ ...profile, location: { ...profile.location, state: e.target.value } })}
              >
                <option value="Karnataka">Karnataka</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Andhra Pradesh">Andhra Pradesh</option>
                <option value="Punjab">Punjab</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">District</label>
              <input
                type="text"
                className="form-input"
                value={profile.location?.district || ''}
                onChange={(e) => setProfile({ ...profile, location: { ...profile.location, district: e.target.value } })}
                placeholder="e.g. Mysuru"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Taluk / Village</label>
              <input
                type="text"
                className="form-input"
                value={profile.location?.village || ''}
                onChange={(e) => setProfile({ ...profile, location: { ...profile.location, village: e.target.value } })}
                placeholder="e.g. Bilikere, Hunsur"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Total Land Area (Acres)</label>
              <input
                type="number"
                step="0.1"
                className="form-input"
                value={profile.farmDetails?.totalLandArea || 2.5}
                onChange={(e) => setProfile({ ...profile, farmDetails: { ...profile.farmDetails, totalLandArea: Number(e.target.value) } })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Preferred Language</label>
              <select
                className="form-input"
                value={profile.personal?.preferredLanguage || 'en'}
                onChange={(e) => setProfile({ ...profile, personal: { ...profile.personal, preferredLanguage: e.target.value } })}
              >
                <option value="en">English</option>
                <option value="kn">ಕನ್ನಡ (Kannada)</option>
                <option value="hi">हिंदी (Hindi)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Soil Health & NPK Card */}
        <div className="card p-8">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-primary-light">
            <FaFlask /> 2. Soil Parameters & Nutrient Profile (Soil Health Card)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="form-group">
              <label className="form-label">Primary Soil Type</label>
              <select
                className="form-input"
                value={profile.farmDetails?.soilType || 'Red'}
                onChange={(e) => setProfile({ ...profile, farmDetails: { ...profile.farmDetails, soilType: e.target.value } })}
              >
                <option value="Red">Red Soil</option>
                <option value="Black">Black Cotton Soil</option>
                <option value="Alluvial">Alluvial Soil</option>
                <option value="Loamy">Loamy Soil</option>
                <option value="Laterite">Laterite Soil</option>
                <option value="Sandy">Sandy Loam</option>
                <option value="Clay">Clayey Soil</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Soil pH (0 - 14)</label>
              <input
                type="number"
                step="0.1"
                className="form-input"
                value={profile.farmDetails?.soilPh || 6.8}
                onChange={(e) => setProfile({ ...profile, farmDetails: { ...profile.farmDetails, soilPh: Number(e.target.value) } })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Nitrogen N (kg/ha)</label>
              <input
                type="number"
                className="form-input"
                value={profile.farmDetails?.nitrogen || 160}
                onChange={(e) => setProfile({ ...profile, farmDetails: { ...profile.farmDetails, nitrogen: Number(e.target.value) } })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Phosphorus P (kg/ha)</label>
              <input
                type="number"
                className="form-input"
                value={profile.farmDetails?.phosphorus || 45}
                onChange={(e) => setProfile({ ...profile, farmDetails: { ...profile.farmDetails, phosphorus: Number(e.target.value) } })}
              />
            </div>
          </div>
        </div>

        {/* Section 3: Water, Irrigation & Farming Method */}
        <div className="card p-8">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-info">
            <FaTint /> 3. Irrigation & Water Infrastructure
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="form-group">
              <label className="form-label">Irrigation System</label>
              <select
                className="form-input"
                value={profile.farmDetails?.irrigationType || 'Borewell / Tube Well'}
                onChange={(e) => setProfile({ ...profile, farmDetails: { ...profile.farmDetails, irrigationType: e.target.value } })}
              >
                <option value="Drip">Drip Irrigation (Micro-irrigation)</option>
                <option value="Sprinkler">Sprinkler System</option>
                <option value="Borewell / Tube Well">Borewell / Tube Well</option>
                <option value="Canal">Canal Water</option>
                <option value="Rainfed">Rainfed (No Permanent Irrigation)</option>
                <option value="Flood">Flood / Furrow</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Water Availability</label>
              <select
                className="form-input"
                value={profile.farmDetails?.waterAvailability || 'Moderate (Seasonal)'}
                onChange={(e) => setProfile({ ...profile, farmDetails: { ...profile.farmDetails, waterAvailability: e.target.value } })}
              >
                <option value="High (Year-round)">High (Year-round)</option>
                <option value="Moderate (Seasonal)">Moderate (Seasonal)</option>
                <option value="Low (Scare)">Low (Scare)</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Farming Practice Method</label>
              <select
                className="form-input"
                value={profile.farmDetails?.farmingMethod || 'Conventional'}
                onChange={(e) => setProfile({ ...profile, farmDetails: { ...profile.farmDetails, farmingMethod: e.target.value } })}
              >
                <option value="Conventional">Conventional Integrated</option>
                <option value="Organic">Certified Organic</option>
                <option value="Natural Farming (ZBNF)">Natural Farming (ZBNF / Subhash Palekar)</option>
                <option value="Mixed">Mixed Crop-Livestock</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 4: Current Crops & Economics */}
        <div className="card p-8">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-gold">
            <FaCoins /> 4. Crop Cycles & Financial Capacity
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="form-group">
              <label className="form-label">Current Primary Crop</label>
              <input
                type="text"
                className="form-input"
                value={profile.currentCrops?.[0] || 'Tomato'}
                onChange={(e) => setProfile({ ...profile, currentCrops: [e.target.value, ...(profile.currentCrops?.slice(1) || [])] })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Estimated Input Budget (₹)</label>
              <input
                type="number"
                className="form-input"
                value={profile.financial?.inputBudget || 45000}
                onChange={(e) => setProfile({ ...profile, financial: { ...profile.financial, inputBudget: Number(e.target.value) } })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Primary Farming Goal</label>
              <select
                className="form-input"
                value={profile.financial?.primaryGoal || 'Max Profit'}
                onChange={(e) => setProfile({ ...profile, financial: { ...profile.financial, primaryGoal: e.target.value } })}
              >
                <option value="Max Profit">Maximize Net Profit</option>
                <option value="Low Risk / High Stability">Low Risk & Income Stability</option>
                <option value="Organic Certification">Premium Organic Value Addition</option>
              </select>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
