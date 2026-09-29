import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Link } from 'react-router-dom';
import { FaGraduationCap, FaBook, FaCheckCircle, FaAward, FaArrowRight, FaMicroscope } from 'react-icons/fa';

export default function StudentDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/student/dashboard');
        if (res.data.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch student dashboard', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div className="spinner-wrap"><div className="spinner"></div></div>;

  return (
    <div className="fade-in max-w-6xl mx-auto">
      <div className="page-header mb-8">
        <h1 className="page-title flex items-center gap-3">
          <FaGraduationCap className="text-primary-light" /> Agriculture & Veterinary Student Academic Hub
        </h1>
        <p className="page-subtitle">ICAR-aligned courseware, competitive MCQ arena (JRF/SRF), and real-world farm case study analysis.</p>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card p-6 bg-gradient-to-br from-bg-card to-bg-elevated border-primary/40 text-center">
          <span className="text-xs uppercase text-text-muted font-bold">Enrolled Modules</span>
          <h3 className="text-3xl font-black text-primary-light mt-2">{data?.stats?.enrolledCoursesCount || 2}</h3>
          <p className="text-[11px] text-text-muted mt-1">ICAR Core Curriculum</p>
        </div>
        <div className="card p-6 bg-gradient-to-br from-bg-card to-bg-elevated border-gold/40 text-center">
          <span className="text-xs uppercase text-text-muted font-bold">Quizzes Attempted</span>
          <h3 className="text-3xl font-black text-gold mt-2">{data?.stats?.totalQuizzesTaken || 0}</h3>
          <p className="text-[11px] text-text-muted mt-1">Practice & Competitive</p>
        </div>
        <div className="card p-6 bg-gradient-to-br from-bg-card to-bg-elevated border-success-light/40 text-center">
          <span className="text-xs uppercase text-text-muted font-bold">Average MCQ Score</span>
          <h3 className="text-3xl font-black text-success-light mt-2">{data?.stats?.avgScore || 85}%</h3>
          <p className="text-[11px] text-text-muted mt-1">Passing standard: 60%</p>
        </div>
        <div className="card p-6 bg-gradient-to-br from-bg-card to-bg-elevated border-info/40 text-center">
          <span className="text-xs uppercase text-text-muted font-bold">Certifications Cleared</span>
          <h3 className="text-3xl font-black text-info mt-2">{data?.stats?.passedCount || 0}</h3>
          <p className="text-[11px] text-text-muted mt-1">Verified Masteries</p>
        </div>
      </div>

      {/* Courses & Quizzes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Featured Courses */}
        <div className="card p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold flex items-center gap-2 text-primary-light">
              <FaBook /> Active Academic Courses
            </h3>
            <Link to="/student/courses" className="text-xs text-gold hover:underline">View All</Link>
          </div>
          <div className="space-y-4">
            {data?.courses?.map((c) => (
              <div key={c._id} className="p-4 rounded-xl bg-bg-surface border border-border flex justify-between items-center">
                <div>
                  <span className="badge badge-primary !text-[9px] mb-1">{c.code} • {c.category}</span>
                  <h4 className="font-bold text-sm text-text-primary">{c.title}</h4>
                  <p className="text-xs text-text-muted">{c.instructor}</p>
                </div>
                <Link to="/student/courses" className="btn btn-outline btn-sm !py-1 !px-3">Study</Link>
              </div>
            ))}
          </div>
        </div>

        {/* Quiz Arena Showcase */}
        <div className="card p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold flex items-center gap-2 text-gold">
              <FaAward /> Competitive MCQ Arena
            </h3>
            <Link to="/student/quizzes" className="text-xs text-gold hover:underline">All Quizzes</Link>
          </div>
          <div className="space-y-4">
            {data?.recentQuizzes?.map((q) => (
              <div key={q._id} className="p-4 rounded-xl bg-bg-surface border border-border flex justify-between items-center">
                <div>
                  <span className="badge badge-gold !text-[9px] mb-1">{q.subject} • {q.difficulty}</span>
                  <h4 className="font-bold text-sm text-text-primary">{q.title}</h4>
                  <p className="text-xs text-text-muted">{q.questions?.length} MCQs • {q.durationMinutes} Mins</p>
                </div>
                <Link to="/student/quizzes" className="btn btn-primary btn-sm !py-1 !px-3">Take Test</Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
