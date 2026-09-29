import { useState, useEffect, useRef } from 'react';
import { FaMicrophone, FaMicrophoneSlash, FaVolumeUp, FaTimes, FaRobot, FaCheckCircle, FaBookOpen } from 'react-icons/fa';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function VoiceAssistantModal({ isOpen, onClose, initialLang = 'en' }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lang, setLang] = useState(initialLang);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Initialize Web Speech API if supported in browser
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = lang === 'kn' ? 'kn-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN';

      recognition.onresult = (event) => {
        const current = event.resultIndex;
        const text = event.results[current][0].transcript;
        setTranscript(text);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [lang]);

  if (!isOpen) return null;

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast.error('Voice input is not supported in this browser. Please type below.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      setResponse(null);
      try {
        recognitionRef.current.lang = lang === 'kn' ? 'kn-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN';
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Recognition start error:', err);
      }
    }
  };

  const handleAsk = async () => {
    if (!transcript.trim()) {
      toast.error('Please speak or type a query first');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/ai/copilot', {
        query: transcript,
        language: lang,
      });

      if (data.success) {
        setResponse(data.response);
        // Text-to-speech playback if supported
        if ('speechSynthesis' in window) {
          const cleanText = data.response.answer.replace(/[#*`_]/g, '');
          const utterance = new SpeechSynthesisUtterance(cleanText);
          utterance.lang = lang === 'kn' ? 'kn-IN' : lang === 'hi' ? 'hi-IN' : 'en-US';
          window.speechSynthesis.speak(utterance);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to connect to AI Copilot service');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="card max-w-2xl w-full p-8 border border-primary/40 relative shadow-2xl bg-bg-card">
        <button onClick={onClose} className="absolute top-4 right-4 text-text-muted hover:text-white text-xl">
          <FaTimes />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-primary-glow text-primary-light flex items-center justify-center text-2xl">
            <FaRobot />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Multimodal Voice Copilot</h2>
            <p className="text-xs text-text-muted">Speak or type in English, Kannada, or Hindi</p>
          </div>
        </div>

        {/* Language selector */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'en', label: 'English' },
            { id: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
            { id: 'hi', label: 'हिंदी (Hindi)' },
          ].map((l) => (
            <button
              key={l.id}
              onClick={() => setLang(l.id)}
              className={`btn btn-sm ${lang === l.id ? 'btn-primary' : 'btn-outline'}`}
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* Mic toggle & animation */}
        <div className="flex flex-col items-center justify-center py-6 mb-4">
          <button
            onClick={toggleListening}
            className={`w-24 h-24 rounded-full flex items-center justify-center text-3xl shadow-xl transition-all ${
              isListening
                ? 'bg-danger text-white animate-pulse ring-8 ring-danger/30'
                : 'bg-primary text-white hover:scale-105 ring-4 ring-primary-glow'
            }`}
          >
            {isListening ? <FaMicrophone /> : <FaMicrophoneSlash />}
          </button>
          <p className="text-sm font-bold mt-4 text-center">
            {isListening ? (
              <span className="text-danger-light animate-pulse">● Listening... Speak clearly</span>
            ) : (
              <span className="text-text-secondary">Click microphone to speak or type query below</span>
            )}
          </p>
        </div>

        {/* Query Input */}
        <div className="mb-4">
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="e.g. My tomato leaves have yellow spots with dark circles, what should I do?"
            className="form-input w-full h-24 resize-none"
          />
        </div>

        <div className="flex justify-between items-center mb-6">
          <button onClick={() => setTranscript('')} className="text-xs text-text-muted hover:text-white">
            Clear Text
          </button>
          <button onClick={handleAsk} disabled={loading || !transcript.trim()} className="btn btn-primary px-8">
            {loading ? 'Consulting Knowledge Base...' : 'Ask AI Copilot'}
          </button>
        </div>

        {/* Response display */}
        {response && (
          <div className="card p-6 bg-bg-surface border-t-2 border-gold fade-in">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold flex items-center gap-2 text-primary-light">
                <FaCheckCircle /> Grounded Advisory
              </h4>
              <span className="badge badge-gold !text-[10px]">Verified ICAR/KVK</span>
            </div>
            <p className="text-sm text-text-primary whitespace-pre-line leading-relaxed mb-4">{response.answer}</p>

            {response.groundingSources?.length > 0 && (
              <div className="border-t border-border pt-3">
                <p className="text-[11px] text-text-muted font-bold mb-2 flex items-center gap-1">
                  <FaBookOpen className="text-gold" /> Reference Source:
                </p>
                {response.groundingSources.map((s, idx) => (
                  <div key={idx} className="text-xs text-gold flex items-center justify-between">
                    <span>{s.title}</span>
                    <span className="badge badge-primary !text-[9px]">{s.verificationLevel}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
