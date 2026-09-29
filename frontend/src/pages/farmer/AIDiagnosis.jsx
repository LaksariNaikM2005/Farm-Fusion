import { useState, useRef } from 'react';
import api from '../../api/axios';
import { FaUpload, FaLeaf, FaArrowRight, FaSyncAlt, FaExclamationTriangle, FaCheckCircle, FaRobot, FaBookOpen, FaShieldAlt, FaUserMd } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function AIDiagnosis() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a leaf photo first');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Calls backend proxy route which orchestrates FastAPI YOLOv8 and enriches with ICAR protocol
      const { data } = await api.post('/disease/detect', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (data.success) {
        setResult(data.detection);
        toast.success('YOLOv8 deep vision analysis complete!');
      } else {
        toast.error(data.error || 'Failed to analyze leaf image');
      }
    } catch (err) {
      console.error(err);
      toast.error('Could not connect to AI Disease Service.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
  };

  return (
    <div className="fade-in max-w-5xl mx-auto">
      <div className="page-header text-center mb-8">
        <h1 className="page-title text-4xl mb-2 flex items-center justify-center gap-3">
          <FaLeaf className="text-primary-light" /> YOLOv8 Plant Disease Diagnostic Scanner
        </h1>
        <p className="page-subtitle text-base">Instant computer vision classification grounded with ICAR-certified treatment protocols.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Upload Box */}
        <div className="card p-8 border-dashed border-2 border-primary/40 flex flex-col items-center justify-center min-h-[380px] relative overflow-hidden bg-bg-card/50">
          {preview ? (
            <div className="w-full h-full flex flex-col items-center">
              <img src={preview} alt="Crop Leaf Preview" className="max-h-[300px] rounded-xl shadow-2xl mb-4 object-cover w-full" />
              {!result && (
                <div className="flex gap-4">
                  <button onClick={reset} className="btn btn-secondary btn-sm" disabled={loading}>
                    Change Photo
                  </button>
                  <button onClick={handleUpload} className="btn btn-primary btn-sm px-6" disabled={loading}>
                    {loading ? <><FaSyncAlt className="animate-spin mr-2" /> Running YOLOv8 Vision...</> : <><FaLeaf className="mr-2" /> Start Diagnostic Scan</>}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div
              className="w-full h-full cursor-pointer flex flex-col items-center justify-center p-8 hover:bg-primary/5 transition-colors group text-center"
              onClick={() => fileInputRef.current.click()}
            >
              <div className="w-20 h-20 rounded-full bg-primary-glow flex items-center justify-center mb-4 group-hover:scale-110 transition-transform text-primary-light">
                <FaUpload className="text-3xl" />
              </div>
              <h3 className="text-xl font-bold mb-2">Upload or Capture Leaf Photo</h3>
              <p className="text-xs text-text-muted max-w-xs">Supports JPG, PNG formats. Max 5MB. Ensure high resolution and good lighting on affected spots.</p>
              <input type="file" hidden ref={fileInputRef} onChange={handleFileChange} accept="image/*" />
            </div>
          )}

          {loading && (
            <div className="absolute inset-0 bg-bg-base/75 backdrop-blur-sm flex flex-col items-center justify-center z-10">
              <div className="scanner-line"></div>
              <div className="spinner mb-4"></div>
              <p className="font-bold text-primary-light animate-pulse">Deep Scanning Leaf Cellular Patterns...</p>
            </div>
          )}
        </div>

        {/* Results / Protocol Section */}
        <div className="space-y-6">
          {!result && !loading && (
            <div className="card p-8 bg-bg-card/40 border border-border h-full flex flex-col justify-center">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gold">
                <FaRobot /> How Vision Diagnostics Works
              </h3>
              <ul className="space-y-4 text-xs text-text-secondary">
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/20 text-primary-light flex items-center justify-center font-bold shrink-0">1</span>
                  <p>YOLOv8 deep neural network processes leaf texture, lesion margins, and chlorotic pigmentation.</p>
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/20 text-primary-light flex items-center justify-center font-bold shrink-0">2</span>
                  <p>Matches detected condition against ICAR/IIHR verified pathogen compendiums.</p>
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/20 text-primary-light flex items-center justify-center font-bold shrink-0">3</span>
                  <p>Generates dual-stage organic and chemical control protocols with expert escalation.</p>
                </li>
              </ul>
            </div>
          )}

          {result && (
            <div className="card p-8 border-t-4 border-primary fade-in space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold">Diagnostic Results</h3>
                <span className="badge badge-gold">YOLOv8 Vision Verified</span>
              </div>

              {/* Detected Disease Header */}
              <div className="p-4 bg-primary/10 rounded-2xl border border-primary/30 flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-primary-glow flex items-center justify-center text-primary-light text-2xl shrink-0">
                  <FaCheckCircle />
                </div>
                <div>
                  <p className="text-[10px] text-primary-light font-bold uppercase tracking-widest">Potential Issue Detected</p>
                  <h4 className="text-xl font-black text-text-primary">{result.potentialDisease}</h4>
                  <p className="text-xs text-text-muted mt-0.5">Model Confidence: <strong>{result.confidencePercentage}</strong></p>
                </div>
              </div>

              {/* Verified Symptoms */}
              <div>
                <h5 className="font-bold text-xs uppercase text-text-muted mb-2">Scientific Symptom Indicators:</h5>
                <ul className="text-xs text-text-secondary space-y-1">
                  {result.symptoms?.map((s, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-gold">•</span> {s}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Management Protocols: Organic vs Chemical */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-bg-surface border border-success/30">
                  <h5 className="font-bold text-xs text-success-light mb-2">🌿 Organic & Bio-Control</h5>
                  <ul className="text-xs text-text-secondary space-y-1">
                    {result.recommendedActions?.organic?.map((act, i) => (
                      <li key={i}>✓ {act}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 rounded-xl bg-bg-surface border border-info/30">
                  <h5 className="font-bold text-xs text-info mb-2">🧪 Targeted Chemical Control</h5>
                  <ul className="text-xs text-text-secondary space-y-1">
                    {result.recommendedActions?.chemical?.map((act, i) => (
                      <li key={i}>✓ {act}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Academic Source & Disclaimer */}
              <div className="border-t border-border pt-4">
                <p className="text-[11px] text-text-muted flex items-center gap-1">
                  <FaBookOpen className="text-gold" /> Reference Authority: {result.verifiedSource?.authority}
                </p>
                <p className="text-[10px] text-text-muted italic mt-1">{result.disclaimer}</p>
              </div>

              <div className="flex gap-4 pt-2">
                <button onClick={reset} className="btn btn-secondary flex-1">
                  Scan Another Leaf
                </button>
                <Link to="/farmer/experts" className="btn btn-primary flex-1 flex items-center justify-center gap-2">
                  <FaUserMd /> Consult Expert
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .scanner-line {
          position: absolute;
          width: 100%;
          height: 2px;
          background: var(--primary);
          box-shadow: 0 0 15px var(--primary);
          top: 0;
          animation: scan 2s linear infinite;
          z-index: 20;
        }
        @keyframes scan {
          0% { top: 0%; }
          100% { top: 100%; }
        }
      `}</style>
    </div>
  );
}
