import { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { FaFileContract, FaCheckCircle, FaExclamationCircle, FaExternalLinkAlt, FaSearch, FaFilter, FaBookOpen } from 'react-icons/fa';

export default function Schemes() {
  const [schemes, setSchemes] = useState([]);
  const [farmerCriteria, setFarmerCriteria] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchMatchedSchemes();
  }, []);

  const fetchMatchedSchemes = async () => {
    try {
      const { data } = await api.post('/schemes/match', {});
      if (data.success) {
        setSchemes(data.matchedSchemes || []);
        setFarmerCriteria(data.farmerCriteria);
      }
    } catch (err) {
      console.error('Failed to fetch matched schemes', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredSchemes = selectedCategory === 'all'
    ? schemes
    : schemes.filter((s) => s.category?.toLowerCase() === selectedCategory.toLowerCase());

  if (loading) return <div className="spinner-wrap"><div className="spinner"></div></div>;

  return (
    <div className="fade-in max-w-6xl mx-auto">
      <div className="page-header flex justify-between items-start mb-8">
        <div>
          <h1 className="page-title flex items-center gap-3">
            <FaFileContract className="text-gold" /> Personalized Government Schemes & Subsidies
          </h1>
          <p className="page-subtitle">Eligibility matched against your landholding ({farmerCriteria?.landArea || 2.5} Acres), state ({farmerCriteria?.state || 'Karnataka'}), and active crops.</p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
        {['all', 'subsidy', 'insurance', 'loan', 'equipment', 'training'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`btn btn-sm capitalize ${selectedCategory === cat ? 'btn-primary' : 'btn-outline'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Schemes Grid */}
      <div className="space-y-6">
        {filteredSchemes.map((s) => (
          <div key={s._id} className="card p-8 border-l-4 border-gold bg-bg-card hover:border-primary-light transition-all">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
              <div>
                <span className="badge badge-primary !text-xs mb-2 uppercase">{s.category} • {s.authority}</span>
                <h3 className="text-2xl font-bold text-text-primary">{s.title}</h3>
              </div>
              <div className="text-right">
                <span className="badge badge-gold !text-sm px-4 py-1 font-bold">
                  {s.matchPercentage}% Potential Match
                </span>
                <p className="text-[10px] text-text-muted mt-1">Verified {new Date(s.lastVerifiedDate).toLocaleDateString()}</p>
              </div>
            </div>

            <p className="text-sm text-text-secondary leading-relaxed mb-6">{s.description}</p>

            {/* Match Breakdown Checklist */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6 bg-bg-surface p-5 rounded-2xl border border-border">
              <div>
                <h5 className="font-bold text-xs uppercase text-success-light mb-2 flex items-center gap-1">
                  <FaCheckCircle /> Matched Eligibility Factors:
                </h5>
                <ul className="text-xs text-text-secondary space-y-1">
                  {s.matchedConditions?.map((m, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-success-light font-bold">✓</span> {m}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h5 className="font-bold text-xs uppercase text-gold mb-2 flex items-center gap-1">
                  <FaBookOpen /> Required Documents:
                </h5>
                <ul className="text-xs text-text-secondary space-y-1">
                  {s.requiredDocuments?.map((doc, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-gold">•</span> {doc}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Benefits & Actions */}
            <div className="border-t border-border pt-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="text-xs text-text-muted">
                <strong>Financial Benefits:</strong> {s.benefits || 'Direct Bank Transfer / Subsidy assistance'}
              </div>
              <a
                href={s.officialSourceUrl || s.link}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary btn-sm flex items-center gap-2"
              >
                Apply on Official Portal <FaExternalLinkAlt size={12} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
