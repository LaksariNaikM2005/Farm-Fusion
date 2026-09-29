import { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { FaSeedling, FaCalendarAlt, FaCheckCircle, FaArrowRight, FaPlus, FaTools, FaChartLine, FaShieldAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const LIFECYCLE_STAGES = [
  { id: 'PLAN', label: '1. Plan', desc: 'Crop selection, soil NPK analysis, budget estimation', icon: <FaSeedling />, color: 'primary' },
  { id: 'PREPARE', label: '2. Prepare', desc: 'Tillage, equipment rental, basal manure application', icon: <FaTools />, color: 'gold' },
  { id: 'PLANT', label: '3. Plant', desc: 'Seed treatment, sowing / transplanting, drip setup', icon: <FaSeedling />, color: 'primary' },
  { id: 'GROW', label: '4. Grow', desc: 'Fertigation, growth monitoring, weather-based irrigation', icon: <FaTintIcon />, color: 'info' },
  { id: 'MONITOR', label: '5. Monitor', desc: 'AI disease scouting, pest trap alerts, crop health', icon: <FaShieldAlt />, color: 'danger' },
  { id: 'HARVEST', label: '6. Harvest', desc: 'Harvest timing, yield recording, grade classification', icon: <FaCalendarAlt />, color: 'gold' },
  { id: 'SELL', label: '7. Sell', desc: 'Mandi price intelligence, direct marketplace listing', icon: <FaChartLine />, color: 'primary' },
  { id: 'ANALYZE', label: '8. Analyze', desc: 'Net margin calculation, ROI, sustainability assessment', icon: <FaCheckCircle />, color: 'gold' },
];

function FaTintIcon() {
  return <span>💧</span>;
}

export default function FarmLifecycle() {
  const [cycles, setCycles] = useState([]);
  const [activeCycle, setActiveCycle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCycles();
  }, []);

  const fetchCycles = async () => {
    try {
      const { data } = await api.get('/lifecycle');
      if (data.cycles) {
        setCycles(data.cycles);
        setActiveCycle(data.cycles[0] || null);
      }
    } catch (err) {
      console.error('Failed to fetch crop cycles', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdvanceStage = async (nextStage) => {
    if (!activeCycle) return;
    try {
      const { data } = await api.put(`/lifecycle/${activeCycle._id}/stage`, {
        stage: nextStage,
        notes: `Advanced to ${nextStage} stage via Farm Lifecycle Navigator`,
      });
      if (data.success) {
        toast.success(`Crop cycle transitioned to ${nextStage}!`);
        fetchCycles();
      }
    } catch (err) {
      toast.error('Failed to transition stage');
    }
  };

  if (loading) return <div className="spinner-wrap"><div className="spinner"></div></div>;

  const currentStageIndex = LIFECYCLE_STAGES.findIndex((s) => s.id === activeCycle?.stage);

  return (
    <div className="fade-in max-w-6xl mx-auto">
      <div className="page-header flex justify-between items-start mb-8">
        <div>
          <h1 className="page-title flex items-center gap-3">
            <FaSeedling className="text-primary-light" /> Complete Farm Lifecycle Engine
          </h1>
          <p className="page-subtitle">Guiding every agricultural stage: Plan → Prepare → Plant → Grow → Monitor → Harvest → Sell → Analyze.</p>
        </div>
        <Link to="/farmer/crops" className="btn btn-primary btn-sm flex items-center gap-2">
          <FaPlus /> Plan New Crop Cycle
        </Link>
      </div>

      {activeCycle && (
        <div className="card p-8 mb-10 bg-gradient-to-r from-bg-card to-bg-elevated border-primary/30">
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className="badge badge-primary mb-2">Active Cycle — {activeCycle.season} 2026</span>
              <h2 className="text-2xl font-bold text-text-primary">{activeCycle.cropName}</h2>
              <p className="text-sm text-text-muted">Plot: {activeCycle.plotName} ({activeCycle.allocatedArea} Acres) • Variety: {activeCycle.variety}</p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase font-bold text-text-muted">Target Yield</p>
              <p className="text-xl font-bold text-gold">{activeCycle.targetYieldKg?.toLocaleString()} kg</p>
            </div>
          </div>

          {/* 8-Stage Interactive Timeline */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 my-6">
            {LIFECYCLE_STAGES.map((s, idx) => {
              const isPast = idx < currentStageIndex;
              const isCurrent = idx === currentStageIndex;
              return (
                <div
                  key={s.id}
                  onClick={() => handleAdvanceStage(s.id)}
                  className={`card p-4 text-center cursor-pointer transition-all border ${
                    isCurrent
                      ? 'border-primary bg-primary-glow/20 ring-2 ring-primary scale-105'
                      : isPast
                      ? 'border-success-light/40 bg-success/10'
                      : 'border-border opacity-60 hover:opacity-100'
                  }`}
                >
                  <div className="text-2xl mb-2 flex justify-center">{s.icon}</div>
                  <h4 className="text-xs font-bold mb-1">{s.label}</h4>
                  <span className={`badge !text-[8px] ${isCurrent ? 'badge-primary' : isPast ? 'badge-success' : 'badge-gold'}`}>
                    {isCurrent ? 'Current' : isPast ? 'Done' : 'Upcoming'}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Stage Action Guide & Tools */}
          <div className="card p-6 bg-bg-surface border border-white/5 mt-6">
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-gold">
              🎯 Tools & Action Checklist for "{activeCycle.stage}" Stage
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link to="/farmer/expenses" className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition flex items-center justify-between">
                <div>
                  <h5 className="font-bold text-sm">Log Stage Input Costs</h5>
                  <p className="text-xs text-text-muted">Record seed, labor, fertilizer expenses</p>
                </div>
                <FaArrowRight className="text-primary-light" />
              </Link>
              <Link to="/farmer/diagnosis" className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition flex items-center justify-between">
                <div>
                  <h5 className="font-bold text-sm">AI Health & Disease Check</h5>
                  <p className="text-xs text-text-muted">Scan leaves with YOLOv8 Vision</p>
                </div>
                <FaArrowRight className="text-primary-light" />
              </Link>
              <Link to="/farmer/copilot" className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition flex items-center justify-between">
                <div>
                  <h5 className="font-bold text-sm">Ask AI Copilot for Advice</h5>
                  <p className="text-xs text-text-muted">Stage-specific agronomy tips</p>
                </div>
                <FaArrowRight className="text-primary-light" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
