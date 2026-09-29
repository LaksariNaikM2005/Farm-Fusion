import { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { FaMicroscope, FaGraduationCap, FaUserCheck, FaPaperPlane, FaBookOpen } from 'react-icons/fa';

export default function CaseStudyAnalysis() {
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [hypothesis, setHypothesis] = useState('');
  const [intervention, setIntervention] = useState('');
  const [literature, setLiterature] = useState('ICAR Package of Practices / UAS Bulletin');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      const { data } = await api.get('/cases');
      if (data.success) {
        setCases(data.cases);
        setSelectedCase(data.cases[0] || null);
      }
    } catch (err) {
      console.error('Failed to fetch cases', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnalysis = async (e) => {
    e.preventDefault();
    if (!hypothesis.trim() || !intervention.trim()) {
      toast.error('Please complete both hypothesis and intervention protocol');
      return;
    }
    setSubmitting(true);
    try {
      const { data } = await api.post(`/cases/${selectedCase._id}/analyze`, {
        hypothesis,
        recommendedIntervention: intervention,
        referencedLiterature: literature,
      });
      if (data.success) {
        toast.success('Academic proposal submitted for Expert Scientific Review!');
        setHypothesis('');
        setIntervention('');
        fetchCases();
      }
    } catch (err) {
      toast.error('Failed to submit analysis');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="spinner-wrap"><div className="spinner"></div></div>;

  return (
    <div className="fade-in max-w-6xl mx-auto">
      <div className="page-header mb-8">
        <h1 className="page-title flex items-center gap-3">
          <FaMicroscope className="text-primary-light" /> Real-World Agricultural Case Studies
        </h1>
        <p className="page-subtitle">Analyze actual field pathology and agronomy problems submitted by farmers, draft diagnostic proposals, and receive expert validation.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cases List */}
        <div className="card p-6 lg:col-span-1 space-y-4">
          <h3 className="text-base font-bold text-gold mb-2">Farmer Case Pool</h3>
          {cases.map((c) => (
            <div
              key={c._id}
              onClick={() => setSelectedCase(c)}
              className={`p-4 rounded-xl cursor-pointer transition border ${
                selectedCase?._id === c._id ? 'border-primary bg-primary/10' : 'border-border bg-bg-surface hover:bg-bg-elevated'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="badge badge-primary !text-[9px]">{c.cropOrAnimal}</span>
                <span className={`badge !text-[9px] ${c.status === 'Expert Validated' ? 'badge-success' : 'badge-gold'}`}>{c.status}</span>
              </div>
              <h4 className="font-bold text-sm text-text-primary line-clamp-2">{c.title}</h4>
              <p className="text-xs text-text-muted mt-2">Location: {c.location?.district}, {c.location?.state}</p>
            </div>
          ))}
        </div>

        {/* Selected Case & Student Submission Form */}
        <div className="card p-8 lg:col-span-2">
          {selectedCase ? (
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="badge badge-gold">{selectedCase.category}</span>
                  <span className="text-xs text-text-muted">Reported by Farmer {selectedCase.farmer?.name}</span>
                </div>
                <h2 className="text-2xl font-bold">{selectedCase.title}</h2>
              </div>

              <div className="p-5 rounded-xl bg-bg-surface border border-border">
                <h4 className="text-xs uppercase font-bold text-text-muted mb-2">Field Symptoms & Farmer Description</h4>
                <p className="text-sm text-text-secondary leading-relaxed mb-4">{selectedCase.description}</p>
                <div className="flex flex-wrap gap-2">
                  {selectedCase.symptoms?.map((s, idx) => (
                    <span key={idx} className="badge badge-primary !text-xs">⚠️ {s}</span>
                  ))}
                </div>
              </div>

              {/* Expert Validation if already certified */}
              {selectedCase.expertValidation?.officialDiagnosis && (
                <div className="p-5 rounded-xl bg-success/10 border border-success-light/40">
                  <h4 className="font-bold text-sm text-success-light flex items-center gap-2 mb-2">
                    <FaUserCheck /> Certified Scientific Validation ({selectedCase.expertValidation.expert?.name})
                  </h4>
                  <p className="text-xs text-text-primary mb-1"><strong>Diagnosis:</strong> {selectedCase.expertValidation.officialDiagnosis}</p>
                  <p className="text-xs text-text-secondary leading-relaxed"><strong>Action Protocol:</strong> {selectedCase.expertValidation.validatedActionPlan}</p>
                </div>
              )}

              {/* Student Proposal Submission Form */}
              <form onSubmit={handleSubmitAnalysis} className="space-y-4 border-t border-border pt-6">
                <h3 className="text-lg font-bold flex items-center gap-2 text-primary-light">
                  <FaGraduationCap /> Submit Your Diagnostic & Management Proposal
                </h3>
                <div>
                  <label className="form-label">Diagnostic Hypothesis (Pathogen / Deficiency)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={hypothesis}
                    onChange={(e) => setHypothesis(e.target.value)}
                    placeholder="e.g. Suspected Alternaria solani (Early Blight) due to concentric ring formation"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Recommended Field Intervention & Dosages</label>
                  <textarea
                    className="form-input h-28 resize-none"
                    value={intervention}
                    onChange={(e) => setIntervention(e.target.value)}
                    placeholder="Propose cultural, biological (Trichoderma), or chemical (Mancozeb/Azoxystrobin) treatment protocols..."
                    required
                  ></textarea>
                </div>
                <div>
                  <label className="form-label">Academic / Scientific Literature Reference</label>
                  <input
                    type="text"
                    className="form-input"
                    value={literature}
                    onChange={(e) => setLiterature(e.target.value)}
                    placeholder="e.g. ICAR-IIHR Tomato Disease Bulletin 2025"
                  />
                </div>
                <button type="submit" disabled={submitting} className="btn btn-primary w-full flex items-center justify-center gap-2">
                  <FaPaperPlane /> {submitting ? 'Submitting to Scientist Pool...' : 'Submit Academic Proposal'}
                </button>
              </form>
            </div>
          ) : (
            <p className="text-center text-text-muted py-12">Select a case from the list to begin study.</p>
          )}
        </div>
      </div>
    </div>
  );
}
