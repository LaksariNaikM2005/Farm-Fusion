import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import {
  FaCloudSun,
  FaTint,
  FaWind,
  FaArrowRight,
  FaNewspaper,
  FaCalendarCheck,
  FaVirus,
  FaStore,
  FaUserMd,
  FaFileContract,
  FaSeedling,
  FaRobot,
  FaMicrophone,
  FaTractor,
  FaHeartbeat,
  FaChartLine,
  FaLeaf,
  FaFileInvoiceDollar,
  FaGraduationCap,
} from 'react-icons/fa';
import { format } from 'date-fns';
import VoiceAssistantModal from '../../components/VoiceAssistantModal';
import { translations } from '../../i18n/translations';

export default function FarmerHome() {
  const { user } = useSelector((s) => s.auth);
  const [weather, setWeather] = useState(null);
  const [news, setNews] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [lifecycle, setLifecycle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [lang, setLang] = useState('en');

  const t = translations[lang] || translations.en;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [weatherRes, newsRes, apptRes, cycleRes] = await Promise.all([
          api.get('/external/weather?city=Mysuru'),
          api.get('/external/news?q=agriculture India'),
          api.get('/appointments?status=accepted&limit=3'),
          api.get('/lifecycle'),
        ]);
        setWeather(weatherRes.data);
        setNews(newsRes.data.articles?.slice(0, 4) || []);
        setAppointments(apptRes.data.appointments || []);
        if (cycleRes.data.cycles?.length > 0) {
          setLifecycle(cycleRes.data.cycles[0]);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="spinner-wrap"><div className="spinner"></div></div>;

  const quickNav = [
    { to: '/farmer/copilot', label: t.aiCopilot, desc: t.aiCopilotDesc, icon: <FaRobot />, color: 'primary' },
    { to: '/farmer/crops', label: t.cropIntelligence, desc: t.cropIntelligenceDesc, icon: <FaSeedling />, color: 'gold' },
    { to: '/farmer/diagnosis', label: t.diseaseDiagnosis, desc: t.diseaseDiagnosisDesc, icon: <FaVirus />, color: 'danger' },
    { to: '/farmer/schemes', label: t.schemeMatch, desc: t.schemeMatchDesc, icon: <FaFileContract />, color: 'gold' },
    { to: '/farmer/lifecycle', label: t.farmLifecycle, desc: t.farmLifecycleDesc, icon: <FaSeedling />, color: 'primary' },
    { to: '/farmer/expenses', label: t.expenses, desc: t.expensesDesc, icon: <FaFileInvoiceDollar />, color: 'gold' },
    { to: '/farmer/analytics', label: 'Farm Analytics', desc: 'ROI, cost per acre & yield charts', icon: <FaChartLine />, color: 'info' },
    { to: '/farmer/sustainability', label: t.sustainability, desc: t.sustainabilityDesc, icon: <FaLeaf />, color: 'primary' },
    { to: '/farmer/equipment', label: t.equipmentRental, desc: t.equipmentRentalDesc, icon: <FaTractor />, color: 'gold' },
    { to: '/farmer/veterinary', label: t.veterinaryCare, desc: t.veterinaryCareDesc, icon: <FaHeartbeat />, color: 'danger' },
    { to: '/farmer/cases', label: 'Tripartite Cases', desc: 'Farmer-Student-Expert ecosystem', icon: <FaGraduationCap />, color: 'info' },
    { to: '/farmer/marketplace', label: 'Marketplace', desc: 'Shop inputs & tools with crop match', icon: <FaStore />, color: 'gold' },
  ];

  return (
    <div className="fade-in">
      {/* Top Banner with Language Selector & Voice Launch */}
      <div className="page-header flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="page-title">{t.welcome}, {user?.name?.split(' ')[0]}! 🌾</h1>
          <p className="page-subtitle">{t.commandCenter}</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <div className="flex bg-bg-surface border border-border rounded-xl p-1">
            <button onClick={() => setLang('en')} className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${lang === 'en' ? 'bg-primary text-white' : 'text-text-muted hover:text-white'}`}>EN</button>
            <button onClick={() => setLang('kn')} className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${lang === 'kn' ? 'bg-primary text-white' : 'text-text-muted hover:text-white'}`}>ಕನ್ನಡ</button>
            <button onClick={() => setLang('hi')} className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${lang === 'hi' ? 'bg-primary text-white' : 'text-text-muted hover:text-white'}`}>हिंदी</button>
          </div>

          <button onClick={() => setVoiceOpen(true)} className="btn btn-gold flex items-center gap-2 shadow-lg animate-pulse">
            <FaMicrophone /> Voice Assistant
          </button>
        </div>
      </div>

      {/* Active Farm Lifecycle Progress Banner */}
      {lifecycle && (
        <div className="card p-6 mb-8 bg-gradient-to-r from-bg-card via-bg-elevated to-bg-card border-l-4 border-primary">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="badge badge-primary !text-[10px] mb-1">Active Farm Lifecycle Cycle ({lifecycle.season})</span>
              <h3 className="text-xl font-bold text-text-primary">{lifecycle.cropName}</h3>
              <p className="text-xs text-text-muted">Plot: {lifecycle.plotName} ({lifecycle.allocatedArea} Acres) • Current Stage: <strong className="text-gold">{lifecycle.stage}</strong></p>
            </div>
            <Link to="/farmer/lifecycle" className="btn btn-primary btn-sm flex items-center gap-2">
              View 8-Stage Timeline <FaArrowRight />
            </Link>
          </div>
        </div>
      )}

      {/* Grid of 12 Farm Fusion 2.0 Intelligence Modules */}
      <h2 className="text-xl font-bold mb-4 text-text-primary flex items-center gap-2">
        <FaSeedling className="text-primary-light" /> {t.quickActions}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
        {quickNav.map((item, i) => (
          <Link
            key={i}
            to={item.to}
            className="card p-5 flex flex-col justify-between hover:-translate-y-1.5 transition-all group border-border hover:border-primary-light"
          >
            <div>
              <div className={`w-12 h-12 rounded-xl mb-3 flex items-center justify-center text-2xl transition-transform group-hover:scale-110 ${
                item.color === 'primary' ? 'bg-primary-glow text-primary-light' : item.color === 'gold' ? 'bg-gold-glow text-gold' : item.color === 'danger' ? 'bg-danger/10 text-danger-light' : 'bg-info/10 text-blue-400'
              }`}>
                {item.icon}
              </div>
              <h3 className="text-base font-bold mb-1 group-hover:text-primary-light transition-colors">{item.label}</h3>
              <p className="text-xs text-text-muted line-clamp-2">{item.desc}</p>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-gold font-bold mt-4">
              Open Module <FaArrowRight size={10} />
            </div>
          </Link>
        ))}
      </div>

      {/* Weather Intelligence + Appointments Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* Weather Intelligence Widget */}
        {weather && (
          <div className="card card-glass p-6 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, var(--primary-dark), var(--bg-card))' }}>
            <div className="absolute top-[-20px] right-[-20px] opacity-10 text-8xl"><FaCloudSun /></div>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2"><FaCloudSun /> {t.weatherTitle}</h3>
                <p className="text-xs text-gray-300">{weather.city?.name || 'Mysuru'}, Karnataka • Microclimate Sensor</p>
              </div>
              <div className="text-4xl font-black text-gold">{Math.round(weather.current?.main?.temp || 28)}°C</div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">{t.humidity}</p>
                <p className="flex items-center gap-2 font-bold"><FaTint className="text-blue-400" /> {weather.current?.main?.humidity || 62}%</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">{t.windSpeed}</p>
                <p className="flex items-center gap-2 font-bold"><FaWind className="text-gold" /> {weather.current?.wind?.speed || 4.5} m/s</p>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-black/20 border border-white/10 text-xs text-gray-200">
              💡 <strong>Agronomy Suggestion:</strong> Ideal relative humidity for drip fertigation. No heavy rainfall forecast in next 24h; maintain scheduled irrigation for tomato plot.
            </div>
          </div>
        )}

        {/* Consultations Card */}
        <div className="card p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2"><FaCalendarCheck className="text-primary-light" /> Certified Expert Consultations</h3>
            <Link to="/farmer/appointments" className="text-xs text-gold hover:underline">{t.viewAll}</Link>
          </div>
          {appointments.length > 0 ? (
            <div className="flex flex-col gap-3">
              {appointments.map((apt) => (
                <div key={apt._id} className="flex justify-between items-center p-4 rounded-xl bg-bg-elevated border border-border">
                  <div className="flex items-center gap-4">
                    <div className="avatar-sm avatar-placeholder rounded-lg">{apt.expert?.name?.[0] || 'E'}</div>
                    <div>
                      <p className="text-sm font-bold">{apt.expert?.name}</p>
                      <p className="text-[10px] text-text-muted">{format(new Date(apt.date), 'MMMM dd')} at {apt.timeSlot}</p>
                    </div>
                  </div>
                  <Link to="/farmer/appointments" className="btn btn-outline btn-sm !py-1 !px-3">Join</Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <p className="text-sm text-text-muted mb-4">No pending consultation sessions for today.</p>
              <Link to="/farmer/experts" className="btn btn-primary btn-sm">Find Certified Agronomist</Link>
            </div>
          )}
        </div>
      </div>

      {/* Agriculture News Hub */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-black flex items-center gap-2"><FaNewspaper className="text-gold" /> Agricultural Market & Policy News</h2>
          <p className="text-sm text-text-muted">Verified ICAR bulletins and government agricultural updates.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {news.map((article, i) => (
          <a key={i} href={article.url} target="_blank" rel="noreferrer" className="card p-0 overflow-hidden group border-none bg-bg-surface">
            <div className="relative h-36 overflow-hidden">
              <img src={article.urlToImage || 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=400'} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-bg-surface to-transparent"></div>
              <span className="absolute bottom-2 left-2 badge badge-gold !text-[8px]">Trending</span>
            </div>
            <div className="p-4">
              <h4 className="font-bold text-xs line-clamp-2 mb-1 group-hover:text-primary-light transition-colors">{article.title}</h4>
              <p className="text-[10px] text-text-muted line-clamp-2">{article.description}</p>
            </div>
          </a>
        ))}
      </div>

      {/* Voice Assistant Modal */}
      <VoiceAssistantModal isOpen={voiceOpen} onClose={() => setVoiceOpen(false)} initialLang={lang} />
    </div>
  );
}
