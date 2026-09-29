import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { FaLeaf, FaTint, FaFlask, FaRecycle, FaCheckCircle, FaExclamationCircle, FaShieldAlt } from 'react-icons/fa';

export default function SustainabilityScore() {
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScore = async () => {
      try {
        const { data } = await api.get('/sustainability/score');
        if (data.success) {
          setAssessment(data.assessment);
        }
      } catch (err) {
        console.error('Failed to fetch sustainability score', err);
      } finally {
        setLoading(false);
      }
    };
    fetchScore();
  }, []);

  if (loading) return <div className="spinner-wrap"><div className="spinner"></div></div>;

  return (
    <div className="fade-in max-w-5xl mx-auto">
      <div className="page-header mb-8">
        <h1 className="page-title flex items-center gap-3">
          <FaLeaf className="text-success-light" /> Farm Sustainability & Eco-Index Score
        </h1>
        <p className="page-subtitle">Scientific scoring of farm resource stewardship across water, soil, biological diversity, and input efficiency.</p>
      </div>

      {/* Main Score Hero Card */}
      <div className="card p-8 mb-8 bg-gradient-to-r from-bg-card via-bg-elevated to-bg-card border-primary/40 flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <span className="badge badge-primary mb-3">Farm Fusion Eco-Index v2.0</span>
          <h2 className="text-3xl font-bold mb-2">Overall Farm Sustainability Rating</h2>
          <p className="text-sm text-text-muted max-w-lg">
            Calculated based on your recorded adoption of drip irrigation, crop diversity, organic bio-inputs, and farm waste recycling.
          </p>
        </div>
        <div className="w-40 h-40 rounded-full border-8 border-primary-light/40 flex flex-col items-center justify-center bg-primary-glow/30 shadow-2xl shrink-0">
          <span className="text-5xl font-black text-primary-light">{assessment?.overallScore}</span>
          <span className="text-xs uppercase font-bold text-text-muted mt-1">/ 100 Score</span>
        </div>
      </div>

      {/* Category Sub-Scores */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="card p-5 text-center bg-bg-surface border-border">
          <div className="text-2xl text-blue-400 mb-2 flex justify-center"><FaTint /></div>
          <p className="text-xs font-bold text-text-muted uppercase">Water Efficiency</p>
          <h4 className="text-2xl font-black text-blue-400 mt-1">{assessment?.waterEfficiencyScore}%</h4>
        </div>
        <div className="card p-5 text-center bg-bg-surface border-border">
          <div className="text-2xl text-gold mb-2 flex justify-center"><FaFlask /></div>
          <p className="text-xs font-bold text-text-muted uppercase">Soil Health</p>
          <h4 className="text-2xl font-black text-gold mt-1">{assessment?.soilHealthScore}%</h4>
        </div>
        <div className="card p-5 text-center bg-bg-surface border-border">
          <div className="text-2xl text-primary-light mb-2 flex justify-center"><FaLeaf /></div>
          <p className="text-xs font-bold text-text-muted uppercase">Crop Diversity</p>
          <h4 className="text-2xl font-black text-primary-light mt-1">{assessment?.cropDiversityScore}%</h4>
        </div>
        <div className="card p-5 text-center bg-bg-surface border-border">
          <div className="text-2xl text-purple-400 mb-2 flex justify-center"><FaShieldAlt /></div>
          <p className="text-xs font-bold text-text-muted uppercase">Input Management</p>
          <h4 className="text-2xl font-black text-purple-400 mt-1">{assessment?.inputManagementScore}%</h4>
        </div>
        <div className="card p-5 text-center bg-bg-surface border-border">
          <div className="text-2xl text-success-light mb-2 flex justify-center"><FaRecycle /></div>
          <p className="text-xs font-bold text-text-muted uppercase">Waste Recycling</p>
          <h4 className="text-2xl font-black text-success-light mt-1">{assessment?.wasteManagementScore}%</h4>
        </div>
      </div>

      {/* Strengths & Actionable Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="card p-6 border-l-4 border-success-light">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-success-light">
            <FaCheckCircle /> Validated Ecological Strengths
          </h3>
          <ul className="space-y-3">
            {assessment?.strengths?.map((s, idx) => (
              <li key={idx} className="text-sm text-text-secondary flex items-start gap-2">
                <span className="text-success-light font-bold">✓</span> {s}
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-6 border-l-4 border-gold">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gold">
            <FaExclamationCircle /> Actionable Pathways to 90+ Score
          </h3>
          <ul className="space-y-3">
            {assessment?.recommendationsForImprovement?.map((r, idx) => (
              <li key={idx} className="text-sm text-text-secondary flex items-start gap-2">
                <span className="text-gold font-bold">→</span> {r}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-bg-surface border border-border text-center text-xs text-text-muted">
        {assessment?.disclaimer} • Methodology: {assessment?.scoringMethodologyVersion}
      </div>
    </div>
  );
}
