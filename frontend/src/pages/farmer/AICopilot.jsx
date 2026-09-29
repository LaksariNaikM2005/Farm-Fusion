import { useState, useRef, useEffect } from 'react';
import api from '../../api/axios';
import { FaRobot, FaPaperPlane, FaMicrophone, FaMicrophoneSlash, FaBookOpen, FaUserMd, FaLeaf, FaCoins, FaShieldAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function AICopilot() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello! I am your **Farm Fusion 2.0 AI Copilot** 🌾.\n\nI have active context of your farm (2.5 Acres in Mysuru, Red Soil, cultivating Tomato & Ragi). How can I assist you with crop health, fertilizer dosages, government schemes, or farm economics today?`,
      groundingSources: [
        {
          title: 'Farm Fusion Agronomy Knowledge Base',
          source: 'ICAR & UAS Bangalore Certified Repositories',
          verificationLevel: 'ICAR / AGRICULTURAL UNIVERSITY',
        },
      ],
      recommendedActions: ['Ask about leaf spots or early blight', 'Check scheme match for solar pump', 'Calculate break-even yield for tomato'],
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.onresult = (e) => {
        const text = e.results[0][0].transcript;
        setInput(text);
        setIsListening(false);
      };
      rec.onend = () => setIsListening(false);
      rec.onerror = () => setIsListening(false);
      recognitionRef.current = rec;
    }
  }, []);

  const toggleMic = () => {
    if (!recognitionRef.current) {
      toast.error('Voice recognition is not supported in this browser.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleSend = async (userQuery) => {
    const q = userQuery || input;
    if (!q.trim()) return;

    const userMsg = { role: 'user', content: q };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const { data } = await api.post('/ai/copilot', { query: q });
      if (data.success) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: data.response.answer,
            groundingSources: data.response.groundingSources,
            recommendedActions: data.response.recommendedActions,
            escalatedToExpert: data.response.escalatedToExpert,
            disclaimer: data.response.disclaimer,
          },
        ]);
      }
    } catch (err) {
      toast.error('Failed to get answer from AI Copilot');
    } finally {
      setLoading(false);
    }
  };

  const samplePrompts = [
    'My tomato leaves have yellow halos and brown spots.',
    'Which government schemes match my 2.5 acre farm?',
    'What is my estimated cost and profit margin for tomato?',
    'How should I vaccinate my dairy cows before the monsoon?',
  ];

  return (
    <div className="fade-in max-w-5xl mx-auto flex flex-col h-[calc(100vh-140px)]">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FaRobot className="text-primary-light" /> AI Farmer Copilot (Grounded RAG Assistant)
          </h1>
          <p className="text-xs text-text-muted">Personalized decisions grounded in ICAR, KVK, and government knowledge bases.</p>
        </div>
        <span className="badge badge-primary !text-xs">Context: Mysuru • Tomato • 2.5 Acres</span>
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 overflow-y-auto card p-6 space-y-6 mb-4 bg-bg-surface border-border">
        {messages.map((m, i) => (
          <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div
              className={`max-w-[85%] rounded-2xl p-5 shadow-lg ${
                m.role === 'user'
                  ? 'bg-primary text-white rounded-tr-none'
                  : 'bg-bg-card border border-border text-text-primary rounded-tl-none'
              }`}
            >
              <p className="text-sm whitespace-pre-line leading-relaxed">{m.content}</p>

              {/* Grounding Source Badge */}
              {m.groundingSources?.length > 0 && (
                <div className="border-t border-border mt-3 pt-3">
                  <p className="text-[11px] font-bold text-gold flex items-center gap-1 mb-1">
                    <FaBookOpen /> Grounded Official Sources:
                  </p>
                  {m.groundingSources.map((src, sIdx) => (
                    <div key={sIdx} className="text-xs text-text-muted flex justify-between items-center mt-1">
                      <span>• {src.title}</span>
                      <span className="badge badge-primary !text-[8px]">{src.verificationLevel}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Recommended Action Pills */}
              {m.recommendedActions?.length > 0 && (
                <div className="mt-3 pt-2 flex flex-wrap gap-2">
                  {m.recommendedActions.map((act, aIdx) => (
                    <button
                      key={aIdx}
                      onClick={() => handleSend(act)}
                      className="badge badge-gold hover:scale-105 transition-transform !text-[10px] cursor-pointer"
                    >
                      → {act}
                    </button>
                  ))}
                </div>
              )}

              {/* Expert Escalation */}
              {m.escalatedToExpert && (
                <div className="mt-3 p-3 rounded-lg bg-info/10 border border-info/30 flex justify-between items-center">
                  <span className="text-xs text-info flex items-center gap-1 font-bold">
                    <FaUserMd /> Complex field condition detected
                  </span>
                  <a href="/farmer/experts" className="btn btn-outline btn-sm !py-1 !px-3 text-xs">
                    Consult Expert
                  </a>
                </div>
              )}

              {m.disclaimer && (
                <p className="text-[9px] text-text-muted italic mt-2">{m.disclaimer}</p>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-xs text-text-muted animate-pulse">
            <FaRobot className="text-primary-light" /> Copilot is consulting verified agronomy knowledge...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested quick queries */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-2">
        {samplePrompts.map((prompt, pIdx) => (
          <button
            key={pIdx}
            onClick={() => handleSend(prompt)}
            className="text-xs bg-bg-card hover:bg-bg-elevated border border-border px-3 py-1.5 rounded-full whitespace-nowrap text-text-secondary hover:text-white transition"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex gap-3 items-center"
      >
        <button
          type="button"
          onClick={toggleMic}
          className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg transition-all ${
            isListening ? 'bg-danger text-white animate-pulse' : 'bg-bg-card border border-border text-gold hover:bg-bg-elevated'
          }`}
          title="Voice input"
        >
          {isListening ? <FaMicrophone /> : <FaMicrophoneSlash />}
        </button>
        <input
          type="text"
          className="form-input flex-1 h-12 text-sm"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Copilot about diseases, fertilizer, schemes, livestock, or costs..."
        />
        <button type="submit" disabled={loading || !input.trim()} className="btn btn-primary h-12 px-6 flex items-center gap-2">
          <FaPaperPlane /> Send
        </button>
      </form>
    </div>
  );
}
