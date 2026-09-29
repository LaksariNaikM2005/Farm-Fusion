import { useState } from 'react';
import { FaChartLine, FaStore, FaCalendarAlt, FaMapMarkerAlt, FaCoins, FaInfoCircle, FaSearch } from 'react-icons/fa';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

const MANDI_DATA = {
  Tomato: {
    currentPrice: 22,
    unit: '₹ / kg',
    modalPriceQuintal: 2200,
    minPrice: 1800,
    maxPrice: 2600,
    mandi: 'APMC Bandipalya, Mysuru',
    lastUpdated: '2026-09-29 08:30 AM',
    trend7Day: [
      { date: 'Sep 23', price: 18.5 },
      { date: 'Sep 24', price: 19.0 },
      { date: 'Sep 25', price: 20.2 },
      { date: 'Sep 26', price: 21.0 },
      { date: 'Sep 27', price: 21.8 },
      { date: 'Sep 28', price: 22.5 },
      { date: 'Sep 29', price: 22.0 },
    ],
    mandiComparison: [
      { mandi: 'Mysuru (Bandipalya)', price: 2200, arrival: '420 Quintals' },
      { mandi: 'Mandya (APMC)', price: 2150, arrival: '310 Quintals' },
      { mandi: 'Bengaluru (K.R. Market)', price: 2450, arrival: '850 Quintals' },
      { mandi: 'Kolar (APMC)', price: 2380, arrival: '1200 Quintals' },
    ],
    priceOutlook: 'Bullish trend expected over next 10-14 days due to moderate arrivals in southern production belts.',
  },
  'Ragi (Finger Millet)': {
    currentPrice: 38,
    unit: '₹ / kg',
    modalPriceQuintal: 3800,
    minPrice: 3500,
    maxPrice: 4100,
    mandi: 'APMC Mandya',
    lastUpdated: '2026-09-29 09:00 AM',
    trend7Day: [
      { date: 'Sep 23', price: 36.5 },
      { date: 'Sep 24', price: 37.0 },
      { date: 'Sep 25', price: 37.2 },
      { date: 'Sep 26', price: 37.8 },
      { date: 'Sep 27', price: 38.0 },
      { date: 'Sep 28', price: 38.5 },
      { date: 'Sep 29', price: 38.0 },
    ],
    mandiComparison: [
      { mandi: 'Mysuru (Bandipalya)', price: 3750, arrival: '150 Quintals' },
      { mandi: 'Mandya (APMC)', price: 3800, arrival: '220 Quintals' },
      { mandi: 'Hassan (APMC)', price: 3720, arrival: '180 Quintals' },
      { mandi: 'Tumakuru (APMC)', price: 3850, arrival: '290 Quintals' },
    ],
    priceOutlook: 'Stable high prices supported by minimum support price (MSP) procurement and urban health grain demand.',
  },
  'Chilli (Byadgi)': {
    currentPrice: 185,
    unit: '₹ / kg',
    modalPriceQuintal: 18500,
    minPrice: 16500,
    maxPrice: 21000,
    mandi: 'APMC Byadgi / Haveri',
    lastUpdated: '2026-09-29 07:45 AM',
    trend7Day: [
      { date: 'Sep 23', price: 175 },
      { date: 'Sep 24', price: 178 },
      { date: 'Sep 25', price: 180 },
      { date: 'Sep 26', price: 182 },
      { date: 'Sep 27', price: 184 },
      { date: 'Sep 28', price: 186 },
      { date: 'Sep 29', price: 185 },
    ],
    mandiComparison: [
      { mandi: 'Byadgi (Main Hub)', price: 18500, arrival: '2400 Bags' },
      { mandi: 'Hubballi (APMC)', price: 18200, arrival: '800 Bags' },
      { mandi: 'Guntur (APMC)', price: 19100, arrival: '5200 Bags' },
    ],
    priceOutlook: 'High export demand for high-colour oleoresin extraction grades.',
  },
};

export default function MarketIntelligence() {
  const [selectedCrop, setSelectedCrop] = useState('Tomato');
  const cropData = MANDI_DATA[selectedCrop] || MANDI_DATA['Tomato'];

  return (
    <div className="fade-in max-w-6xl mx-auto">
      <div className="page-header mb-8">
        <h1 className="page-title flex items-center gap-3">
          <FaChartLine className="text-gold" /> Real-Time APMC Market Intelligence & Mandi Trends
        </h1>
        <p className="page-subtitle">Track live commodity prices, 7-day trends, and cross-mandi price comparisons across Karnataka and national markets.</p>
      </div>

      {/* Crop Selector Tabs */}
      <div className="flex gap-3 overflow-x-auto pb-4 mb-6">
        {Object.keys(MANDI_DATA).map((crop) => (
          <button
            key={crop}
            onClick={() => setSelectedCrop(crop)}
            className={`btn btn-sm ${selectedCrop === crop ? 'btn-primary' : 'btn-outline'}`}
          >
            {crop}
          </button>
        ))}
      </div>

      {/* Main KPI Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card p-6 bg-gradient-to-br from-bg-card to-bg-elevated border-gold/40 text-center">
          <span className="text-xs uppercase text-text-muted font-bold">Current Modal Price</span>
          <h3 className="text-4xl font-black text-gold mt-2">₹{cropData.currentPrice} <span className="text-sm font-normal text-text-muted">/ kg</span></h3>
          <p className="text-xs text-text-muted mt-1">₹{cropData.modalPriceQuintal?.toLocaleString()} / Quintal</p>
        </div>
        <div className="card p-6 bg-gradient-to-br from-bg-card to-bg-elevated border-border text-center">
          <span className="text-xs uppercase text-text-muted font-bold">Primary Market</span>
          <h3 className="text-lg font-bold text-text-primary mt-2">{cropData.mandi}</h3>
          <p className="text-[10px] text-text-muted mt-1">Updated: {cropData.lastUpdated}</p>
        </div>
        <div className="card p-6 bg-gradient-to-br from-bg-card to-bg-elevated border-success-light/30 text-center">
          <span className="text-xs uppercase text-text-muted font-bold">Daily Price Range</span>
          <h3 className="text-xl font-bold text-success-light mt-2">₹{cropData.minPrice} - ₹{cropData.maxPrice}</h3>
          <p className="text-xs text-text-muted mt-1">per Quintal (100 kg)</p>
        </div>
        <div className="card p-6 bg-gradient-to-br from-bg-card to-bg-elevated border-info/30 text-center">
          <span className="text-xs uppercase text-text-muted font-bold">AI Market Outlook</span>
          <p className="text-xs text-text-secondary mt-2 leading-relaxed">{cropData.priceOutlook}</p>
          <span className="badge badge-gold !text-[9px] mt-1">Model Estimate</span>
        </div>
      </div>

      {/* Chart & Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* 7-Day Price Trend Chart */}
        <div className="card p-6">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-primary-light">
            <FaChartLine /> 7-Day Price Trajectory (₹/kg)
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cropData.trend7Day}>
                <CartesianGrid strokeDasharray="3 3" stroke="#21262d" />
                <XAxis dataKey="date" stroke="#8b949e" />
                <YAxis stroke="#8b949e" domain={['auto', 'auto']} />
                <Tooltip contentStyle={{ backgroundColor: '#1c2333', borderColor: '#f0b429' }} />
                <Line type="monotone" dataKey="price" stroke="#f0b429" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Mandi Comparison Table */}
        <div className="card p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gold">
            <FaStore /> Regional APMC Mandi Price Comparison
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-bg-surface text-xs uppercase text-text-muted">
                  <th className="p-3">APMC Market</th>
                  <th className="p-3">Modal Rate (₹/Qtl)</th>
                  <th className="p-3">Daily Arrival</th>
                </tr>
              </thead>
              <tbody>
                {cropData.mandiComparison?.map((m, idx) => (
                  <tr key={idx} className="border-b border-border hover:bg-bg-elevated transition">
                    <td className="p-3 text-xs font-bold text-text-primary flex items-center gap-1.5">
                      <FaMapMarkerAlt className="text-gold" /> {m.mandi}
                    </td>
                    <td className="p-3 text-sm font-black text-primary-light">₹{m.price?.toLocaleString()}</td>
                    <td className="p-3 text-xs text-text-muted">{m.arrival}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-bg-surface border border-border text-center text-xs text-text-muted">
        Data Source: AGMARKNET (Directorate of Marketing & Inspection, GoI) & Karnataka State Agricultural Marketing Board (KSAMB). Prices are indicative modal values.
      </div>
    </div>
  );
}
