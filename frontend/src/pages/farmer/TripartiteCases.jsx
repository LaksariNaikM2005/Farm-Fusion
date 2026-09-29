import { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { FaGraduationCap, FaUserMd, FaUserCheck, FaPlus, FaCheckCircle, FaBookOpen } from 'react-icons/fa';

export default function TripartiteCases() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Plant Pathology',
    cropOrAnimal: 'Tomato',
    description: '',
    symptoms: '',
  });

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      const { data } = await api.get('/cases');
      if (data.success) {
        setCases(data.cases);
      }
    } catch (err) {
      console.error('Failed to fetch cases', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/cases', {
        ...formData,
        symptoms: formData.symptoms.split(',').map((s) => s.trim()),
      });
      if (data.success) {
        toast.success('Case submitted to academic study & expert validation pool!');
        setShowModal(false);
        fetchCases();
      }
    } catch (err) {
      toast.error('Failed to submit case');
    }
  };

  if (loading) return <div className="spinner-wrap"><div className="spinner"></div></div>;

  return (
    <div className="fade-in max-w-6xl mx-auto">
      <div className="page-header flex justify-between items-start mb-8">
        <div>
          <h1 className="page-title flex items-center gap-3">
            <FaGraduationCap className="text-gold" /> Farmer ↔ Student ↔ Expert Tripartite Hub
          </h1>
          <p className="page-subtitle">Real farm problems are analyzed by agriculture students and certified by verified scientists.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary flex items-center gap-2">
          <FaPlus /> Submit Field Problem for Study
        </button>
      </div>

      <div className="space-y-6">
        {cases.map((c) => (
          <div key={c._id} className="card p-8 border-l-4 border-gold bg-bg-card">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="badge badge-primary !text-xs mb-2">{c.category} • {c.cropOrAnimal}</span>
                <h3 className="text-xl font-bold text-text-primary">{c.title}</h3>
                <p className="text-xs text-text-muted">Farmer: {c.farmer?.name} ({c.location?.district}, {c.location?.state})</p>
              </div>
              <span className={`badge !text-xs font-bold ${c.status === 'Expert Validated' ? 'badge-success' : 'badge-gold'}`}>
                {c.status}
              </span>
            </div>

            <p className="text-sm text-text-secondary mb-6 leading-relaxed bg-bg-surface p-4 rounded-xl border border-border">
              {c.description}
            </p>

            {/* Student Analysis Section */}
            {c.studentAnalyses?.length > 0 && (
              <div className="card p-5 bg-info/5 border border-info/20 mb-6">
                <h4 className="font-bold text-sm text-info flex items-center gap-2 mb-2">
                  <FaGraduationCap /> Student Academic Proposal ({c.studentAnalyses[0].student?.name})
                </h4>
                <p className="text-xs text-text-primary mb-2"><strong>Diagnostic Hypothesis:</strong> {c.studentAnalyses[0].hypothesis}</p>
                <p className="text-xs text-text-secondary leading-relaxed"><strong>Recommended Protocol:</strong> {c.studentAnalyses[0].recommendedIntervention}</p>
                <p className="text-[11px] text-text-muted mt-2">Ref: {c.studentAnalyses[0].referencedLiterature}</p>
              </div>
            )}

            {/* Expert Certification Section */}
            {c.expertValidation?.officialDiagnosis && (
              <div className="card p-5 bg-success/5 border border-success-light/30">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold text-sm text-success-light flex items-center gap-2">
                    <FaUserCheck /> Certified Scientific Validation ({c.expertValidation.expert?.name})
                  </h4>
                  <span className="badge badge-success !text-[10px]">Official Verdict: {c.expertValidation.verdict}</span>
                </div>
                <p className="text-xs text-text-primary mb-1"><strong>Official Diagnosis:</strong> {c.expertValidation.officialDiagnosis}</p>
                <p className="text-xs text-text-secondary leading-relaxed mb-2"><strong>Validated Action Plan:</strong> {c.expertValidation.validatedActionPlan}</p>
                <p className="text-[11px] text-text-muted italic">Expert Feedback: "{c.expertValidation.comments}"</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Submit Case Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="card max-w-lg w-full p-8 bg-bg-card border border-primary/30 relative">
            <h3 className="text-xl font-bold mb-6">Submit Field Problem as Case Study</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="form-label">Case Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Severe leaf necrosis following high humidity in Tomato"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Category</label>
                  <select
                    className="form-input"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="Plant Pathology">Plant Pathology</option>
                    <option value="Agronomy">Agronomy</option>
                    <option value="Soil Health">Soil Health</option>
                    <option value="Veterinary & Livestock">Veterinary & Livestock</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Crop / Animal</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.cropOrAnimal}
                    onChange={(e) => setFormData({ ...formData, cropOrAnimal: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="form-label">Field Description & Observations</label>
                <textarea
                  className="form-input h-28 resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe soil moisture, weather conditions, symptom timeline, and any initial sprays tried..."
                  required
                ></textarea>
              </div>
              <div>
                <label className="form-label">Symptoms (comma separated)</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.symptoms}
                  onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                  placeholder="e.g. Yellow leaf margin, dark brown concentric rings, stem rot"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit Case
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
