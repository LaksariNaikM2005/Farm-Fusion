import { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { FaSeedling, FaCalculator, FaCheckCircle, FaCoins, FaInfoCircle, FaSyncAlt } from 'react-icons/fa';

export default function CropIntelligence() {
  const [activeTab, setActiveTab] = useState('recommendation');
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  
  // Crop Recommendation Inputs
  const [recInputs, setRecInputs] = useState({
    soilType: 'Red',
    soilPh: 6.8,
    nitrogen: 160,
    phosphorus: 45,
    potassium: 190,
    irrigationType: 'Borewell / Tube Well',
  });

  // Profit Calculator Inputs
  const [profitInputs, setProfitInputs] = useState({
    cropName: 'Tomato',
    landArea: 1.5,
    seedCost: 7500,
    fertilizerCost: 9200,
    pesticideCost: 3500,
    laborCost: 8000,
    machineryCost: 4500,
    irrigationCost: 3000,
    transportCost: 2500,
    expectedYieldKg: 24000,
    marketPricePerKg: 22,
  });
  const [profitResult, setProfitResult] = useState(null);

  useEffect(() => {
    handleGetRecommendations();
    handleCalculateProfit();
  }, []);

  const handleGetRecommendations = async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/crops/recommend', recInputs);
      if (data.success) {
        setRecommendations(data.topRecommendations || []);
      }
    } catch (err) {
      toast.error('Failed to compute crop recommendations');
    } finally {
      setLoading(false);
    }
  };

  const handleCalculateProfit = async () => {
    try {
      const { data } = await api.post('/crops/profit-estimate', profitInputs);
      if (data.success) {
        setProfitResult(data);
      }
    } catch (err) {
      toast.error('Failed to calculate profit estimates');
    }
  };

  return (
    <div className="fade-in max-w-6xl mx-auto">
      <div className="page-header mb-8">
        <h1 className="page-title flex items-center gap-3">
          <FaSeedling className="text-primary-light" /> Crop Intelligence & Profitability Engine
        </h1>
        <p className="page-subtitle">ML-based agronomic suitability matching and detailed crop cost & revenue forecasting.</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-4 border-b border-border mb-8">
        <button
          onClick={() => setActiveTab('recommendation')}
          className={`pb-4 px-2 font-bold text-sm border-b-2 flex items-center gap-2 ${
            activeTab === 'recommendation' ? 'border-primary text-primary-light' : 'border-transparent text-text-muted hover:text-white'
          }`}
        >
          <FaSeedling /> 1. ML Crop Recommendation
        </button>
        <button
          onClick={() => setActiveTab('profit')}
          className={`pb-4 px-2 font-bold text-sm border-b-2 flex items-center gap-2 ${
            activeTab === 'profit' ? 'border-gold text-gold' : 'border-transparent text-text-muted hover:text-white'
          }`}
        >
          <FaCalculator /> 2. Crop Profit & Margin Calculator
        </button>
      </div>

      {/* Tab 1: Crop Recommendation */}
      {activeTab === 'recommendation' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="card p-6 lg:col-span-1">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-primary-light">
              Soil & Field Parameters
            </h3>
            <div className="space-y-4">
              <div>
                <label className="form-label">Soil Type</label>
                <select
                  className="form-input"
                  value={recInputs.soilType}
                  onChange={(e) => setRecInputs({ ...recInputs, soilType: e.target.value })}
                >
                  <option value="Red">Red Soil</option>
                  <option value="Black">Black Cotton Soil</option>
                  <option value="Alluvial">Alluvial Soil</option>
                  <option value="Loamy">Loamy Soil</option>
                  <option value="Laterite">Laterite</option>
                </select>
              </div>
              <div>
                <label className="form-label">Soil pH ({recInputs.soilPh})</label>
                <input
                  type="range"
                  min="4.5"
                  max="9.0"
                  step="0.1"
                  className="w-full"
                  value={recInputs.soilPh}
                  onChange={(e) => setRecInputs({ ...recInputs, soilPh: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="form-label">Irrigation System</label>
                <select
                  className="form-input"
                  value={recInputs.irrigationType}
                  onChange={(e) => setRecInputs({ ...recInputs, irrigationType: e.target.value })}
                >
                  <option value="Borewell / Tube Well">Borewell / Drip</option>
                  <option value="Rainfed">Rainfed (Dryland)</option>
                  <option value="Canal">Canal Irrigation</option>
                </select>
              </div>
              <button onClick={handleGetRecommendations} disabled={loading} className="btn btn-primary w-full mt-4 flex items-center justify-center gap-2">
                {loading ? <><FaSyncAlt className="animate-spin" /> Evaluating...</> : <><FaSeedling /> Run ML Suitability Engine</>}
              </button>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            {recommendations.map((crop, i) => (
              <div key={i} className="card p-6 border-l-4 border-primary hover:border-primary-light transition-all">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="text-xl font-bold">{crop.crop}</h4>
                    <p className="text-xs text-text-muted">Duration: {crop.growthDurationDays} • Avg Yield: {crop.avgYieldPerAcreKg?.toLocaleString()} kg/Acre</p>
                  </div>
                  <div className="text-right">
                    <span className="badge badge-primary !text-sm px-3 py-1 font-bold">
                      {crop.recommendationScore}% Match
                    </span>
                    <p className="text-[10px] text-text-muted mt-1">{crop.modelVersion}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 my-4 bg-bg-surface p-3 rounded-xl">
                  <div>
                    <span className="text-[10px] text-text-muted uppercase">Recommended Varieties</span>
                    <p className="text-xs font-bold text-gold">{crop.bestVarieties?.join(', ')}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-text-muted uppercase">Estimated Cost/Acre</span>
                    <p className="text-xs font-bold text-text-primary">₹{crop.costPerAcreEstimate?.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-text-muted uppercase">Benchmark Market Rate</span>
                    <p className="text-xs font-bold text-success-light">₹{crop.avgMarketPricePerKg}/kg</p>
                  </div>
                </div>

                <div className="border-t border-border pt-3">
                  <p className="text-[11px] text-text-muted flex items-center gap-1">
                    <FaInfoCircle className="text-primary-light" /> Source: {crop.academicSource}
                  </p>
                  <p className="text-[10px] text-text-muted italic mt-1">{crop.disclaimer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Profitability Calculator */}
      {activeTab === 'profit' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="card p-6 lg:col-span-1">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gold">
              Cost & Yield Inputs
            </h3>
            <div className="space-y-3">
              <div>
                <label className="form-label">Crop Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={profitInputs.cropName}
                  onChange={(e) => setProfitInputs({ ...profitInputs, cropName: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Land (Acres)</label>
                  <input
                    type="number"
                    step="0.5"
                    className="form-input"
                    value={profitInputs.landArea}
                    onChange={(e) => setProfitInputs({ ...profitInputs, landArea: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="form-label">Expected Yield (kg)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={profitInputs.expectedYieldKg}
                    onChange={(e) => setProfitInputs({ ...profitInputs, expectedYieldKg: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div>
                <label className="form-label">Expected Market Price (₹/kg)</label>
                <input
                  type="number"
                  className="form-input"
                  value={profitInputs.marketPricePerKg}
                  onChange={(e) => setProfitInputs({ ...profitInputs, marketPricePerKg: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="form-label">Seed & Planting Cost (₹)</label>
                <input
                  type="number"
                  className="form-input"
                  value={profitInputs.seedCost}
                  onChange={(e) => setProfitInputs({ ...profitInputs, seedCost: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="form-label">Fertilizer & Nutrition (₹)</label>
                <input
                  type="number"
                  className="form-input"
                  value={profitInputs.fertilizerCost}
                  onChange={(e) => setProfitInputs({ ...profitInputs, fertilizerCost: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="form-label">Labor & Machinery (₹)</label>
                <input
                  type="number"
                  className="form-input"
                  value={profitInputs.laborCost + profitInputs.machineryCost}
                  onChange={(e) => setProfitInputs({ ...profitInputs, laborCost: Number(e.target.value) })}
                />
              </div>
              <button onClick={handleCalculateProfit} className="btn btn-gold w-full mt-4 flex items-center justify-center gap-2">
                <FaCoins /> Calculate Crop Economics
              </button>
            </div>
          </div>

          {profitResult && (
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="card p-6 bg-gradient-to-br from-bg-card to-bg-elevated border-gold/30 text-center">
                  <span className="text-xs uppercase text-text-muted font-bold">Estimated Total Revenue</span>
                  <h3 className="text-3xl font-black text-gold mt-2">₹{profitResult.economics?.totalRevenue?.toLocaleString()}</h3>
                  <p className="text-[11px] text-text-muted mt-1">₹{profitResult.economics?.revenuePerAcre?.toLocaleString()}/Acre</p>
                </div>
                <div className="card p-6 bg-gradient-to-br from-bg-card to-bg-elevated border-danger/30 text-center">
                  <span className="text-xs uppercase text-text-muted font-bold">Estimated Total Cost</span>
                  <h3 className="text-3xl font-black text-danger-light mt-2">₹{profitResult.economics?.totalCost?.toLocaleString()}</h3>
                  <p className="text-[11px] text-text-muted mt-1">₹{profitResult.economics?.costPerAcre?.toLocaleString()}/Acre</p>
                </div>
                <div className="card p-6 bg-gradient-to-br from-bg-card to-bg-elevated border-primary/40 text-center">
                  <span className="text-xs uppercase text-text-muted font-bold">Projected Net Margin</span>
                  <h3 className="text-3xl font-black text-success-light mt-2">₹{profitResult.economics?.netMargin?.toLocaleString()}</h3>
                  <span className="badge badge-primary !text-xs mt-1">ROI: {profitResult.economics?.returnOnInvestmentPercent}%</span>
                </div>
              </div>

              <div className="card p-6">
                <h4 className="font-bold text-base mb-4 text-text-primary">⚖️ Break-Even Analysis</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-bg-surface border border-border">
                    <span className="text-xs text-text-muted">Break-Even Selling Price</span>
                    <p className="text-xl font-bold text-primary-light">₹{profitResult.economics?.breakEvenPricePerKg} / kg</p>
                    <p className="text-[10px] text-text-muted">Minimum price needed to recover costs</p>
                  </div>
                  <div className="p-4 rounded-xl bg-bg-surface border border-border">
                    <span className="text-xs text-text-muted">Break-Even Yield Threshold</span>
                    <p className="text-xl font-bold text-gold">{profitResult.economics?.breakEvenYieldKg?.toLocaleString()} kg</p>
                    <p className="text-[10px] text-text-muted">Minimum harvest needed at market price</p>
                  </div>
                </div>
                <p className="text-[11px] text-text-muted italic mt-4">{profitResult.disclaimer}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
