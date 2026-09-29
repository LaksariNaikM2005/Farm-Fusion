import { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { FaHeartbeat, FaPlus, FaSyringe, FaShieldAlt, FaExclamationTriangle, FaUserMd, FaBookOpen } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function VeterinaryCare() {
  const [animals, setAnimals] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [symptomForm, setSymptomForm] = useState({ animalType: 'Cattle (Cow)', symptoms: '', durationDays: 2 });
  const [symptomResult, setSymptomResult] = useState(null);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    fetchVeterinaryData();
  }, []);

  const fetchVeterinaryData = async () => {
    try {
      const [animRes, recRes] = await Promise.all([
        api.get('/veterinary/animals'),
        api.get('/veterinary/records'),
      ]);
      if (animRes.data.success) setAnimals(animRes.data.animals);
      if (recRes.data.success) setRecords(recRes.data.records);
    } catch (err) {
      console.error('Failed to fetch veterinary data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSymptomCheck = async (e) => {
    e.preventDefault();
    if (!symptomForm.symptoms.trim()) {
      toast.error('Please describe symptoms');
      return;
    }
    setChecking(true);
    try {
      const { data } = await api.post('/veterinary/ai-symptom-check', symptomForm);
      if (data.success) {
        setSymptomResult(data.provisionalAnalysis);
      }
    } catch (err) {
      toast.error('Failed to check animal symptoms');
    } finally {
      setChecking(false);
    }
  };

  if (loading) return <div className="spinner-wrap"><div className="spinner"></div></div>;

  return (
    <div className="fade-in max-w-6xl mx-auto">
      <div className="page-header flex justify-between items-start mb-8">
        <div>
          <h1 className="page-title flex items-center gap-3">
            <FaHeartbeat className="text-danger-light" /> Veterinary & Animal Husbandry Module
          </h1>
          <p className="page-subtitle">Livestock registry, vaccination schedules, safety-guided symptom triage, and veterinary consultations.</p>
        </div>
        <Link to="/farmer/experts" className="btn btn-primary flex items-center gap-2">
          <FaUserMd /> Consult Veterinary Doctor
        </Link>
      </div>

      {/* Safety Notice Banner */}
      <div className="card p-4 mb-8 bg-warning/10 border-l-4 border-warning flex items-center gap-3">
        <FaExclamationTriangle className="text-xl text-warning shrink-0" />
        <p className="text-xs text-text-primary leading-relaxed">
          <strong>Veterinary Safety Notice:</strong> AI advice is strictly advisory and grounded in IVRI compendiums for preliminary triage. It does NOT replace physical examination by a licensed veterinarian.
        </p>
      </div>

      {/* Livestock Registry Section */}
      <div className="card p-6 mb-8">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-primary-light">
          🐄 Registered Farm Livestock ({animals.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {animals.map((anim) => (
            <div key={anim._id} className="p-5 rounded-2xl bg-bg-surface border border-border flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-base text-gold">{anim.name} ({anim.tagNumber})</h4>
                  <span className="badge badge-primary !text-[10px]">{anim.status}</span>
                </div>
                <p className="text-xs text-text-muted mb-2">{anim.animalType} • Breed: {anim.breed}</p>
                <div className="text-xs text-text-secondary space-y-1 mb-4">
                  <p>Age: {anim.ageMonths} Months • Weight: {anim.weightKg} kg</p>
                  <p>Daily Milk Yield: <strong className="text-text-primary">{anim.dailyYieldLiters} L/day</strong></p>
                </div>
              </div>
              <div className="border-t border-border pt-3 flex justify-between items-center text-xs">
                <span className="text-text-muted">Status: {anim.lactationStatus}</span>
                <span className="text-primary-light font-bold">Vaccinated ✓</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Grid: Vaccination History & Symptom Checker */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Vaccination Timeline */}
        <div className="card p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gold">
            <FaSyringe /> Vaccination & Healthcare Ledger
          </h3>
          <div className="space-y-4">
            {records.map((r) => (
              <div key={r._id} className="p-4 rounded-xl bg-bg-surface border border-border">
                <div className="flex justify-between items-start mb-1">
                  <h5 className="font-bold text-sm text-text-primary">{r.title}</h5>
                  <span className="badge badge-success !text-[9px]">{r.status}</span>
                </div>
                <p className="text-xs text-text-muted">Animal: {r.animal?.name} ({r.animal?.tagNumber}) • Doctor: {r.veterinarianName}</p>
                <p className="text-xs text-text-secondary mt-2">Medicine: {r.medicines?.join(', ')}</p>
                {r.nextDueDate && (
                  <p className="text-[11px] text-gold font-bold mt-2">
                    Next Due: {new Date(r.nextDueDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Animal Symptom Safety Triage */}
        <div className="card p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-danger-light">
            <FaShieldAlt /> AI Animal Symptom Safety Triage
          </h3>
          <form onSubmit={handleSymptomCheck} className="space-y-4">
            <div>
              <label className="form-label">Livestock Category</label>
              <select
                className="form-input"
                value={symptomForm.animalType}
                onChange={(e) => setSymptomForm({ ...symptomForm, animalType: e.target.value })}
              >
                <option value="Cattle (Cow)">Cattle (Cow)</option>
                <option value="Buffalo">Buffalo</option>
                <option value="Goat">Goat / Sheep</option>
                <option value="Poultry">Poultry</option>
              </select>
            </div>
            <div>
              <label className="form-label">Describe Observed Symptoms</label>
              <textarea
                className="form-input h-24 resize-none"
                value={symptomForm.symptoms}
                onChange={(e) => setSymptomForm({ ...symptomForm, symptoms: e.target.value })}
                placeholder="e.g. Hard swollen udder, milk contains yellowish clots, reduced feed intake for 2 days..."
              ></textarea>
            </div>
            <button type="submit" disabled={checking} className="btn btn-primary w-full">
              {checking ? 'Analyzing with IVRI Protocols...' : 'Run Safety Triage & Advisory'}
            </button>
          </form>

          {symptomResult && (
            <div className="mt-6 p-5 rounded-2xl bg-bg-surface border border-gold/40 fade-in">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-sm text-gold">Suspected Condition(s):</h4>
                <span className="badge badge-danger !text-[9px]">{symptomResult.urgency}</span>
              </div>
              <ul className="text-xs text-text-primary space-y-1 mb-3">
                {symptomResult.possibleConditions?.map((c, i) => (
                  <li key={i}>• {c}</li>
                ))}
              </ul>
              <div className="border-t border-border pt-3">
                <p className="text-xs font-bold text-primary-light mb-1">First-Aid Protocol:</p>
                <p className="text-xs text-text-secondary leading-relaxed">{symptomResult.provisionalFirstAidAdvisory}</p>
              </div>
              <p className="text-[10px] text-text-muted italic mt-3">{symptomResult.disclaimer}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
