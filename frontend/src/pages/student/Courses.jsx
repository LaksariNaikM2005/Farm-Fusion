import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { FaBook, FaGraduationCap, FaCheckCircle, FaVideo, FaBookOpen } from 'react-icons/fa';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await api.get('/student/courses');
        if (data.courses) {
          setCourses(data.courses);
          setSelectedCourse(data.courses[0]);
          setSelectedLesson(data.courses[0]?.syllabus?.[0]);
        }
      } catch (err) {
        console.error('Failed to fetch courses', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) return <div className="spinner-wrap"><div className="spinner"></div></div>;

  return (
    <div className="fade-in max-w-6xl mx-auto">
      <div className="page-header mb-8">
        <h1 className="page-title flex items-center gap-3">
          <FaBook className="text-primary-light" /> ICAR Academic Courseware & Study Modules
        </h1>
        <p className="page-subtitle">Standardized syllabi in Agronomy, Pathology, Soil Science, and Animal Husbandry.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Course List & Syllabus */}
        <div className="card p-6 lg:col-span-1 space-y-6">
          <div>
            <h3 className="text-base font-bold mb-3 text-gold">Available Courses</h3>
            <div className="space-y-2">
              {courses.map((c) => (
                <button
                  key={c._id}
                  onClick={() => {
                    setSelectedCourse(c);
                    setSelectedLesson(c.syllabus?.[0]);
                  }}
                  className={`w-full text-left p-3 rounded-xl transition border ${
                    selectedCourse?._id === c._id ? 'border-primary bg-primary/10 text-white' : 'border-border bg-bg-surface text-text-secondary'
                  }`}
                >
                  <p className="text-xs font-bold text-primary-light">{c.code}</p>
                  <p className="text-sm font-bold line-clamp-1">{c.title}</p>
                </button>
              ))}
            </div>
          </div>

          {selectedCourse && (
            <div className="border-t border-border pt-4">
              <h4 className="text-sm font-bold mb-3 text-text-primary">Syllabus Lessons</h4>
              <div className="space-y-2">
                {selectedCourse.syllabus?.map((les, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedLesson(les)}
                    className={`w-full text-left p-3 rounded-lg text-xs transition ${
                      selectedLesson?.title === les.title ? 'bg-primary-glow text-white font-bold' : 'bg-bg-card hover:bg-bg-elevated text-text-muted'
                    }`}
                  >
                    {les.title}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Lesson Reader */}
        <div className="card p-8 lg:col-span-2">
          {selectedLesson ? (
            <div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="badge badge-primary mb-2">{selectedCourse?.code} • {selectedLesson.duration}</span>
                  <h2 className="text-2xl font-bold text-text-primary">{selectedLesson.title}</h2>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-bg-surface border border-border prose prose-invert max-w-none text-sm leading-relaxed mb-6 whitespace-pre-line text-text-secondary">
                {selectedLesson.contentMarkdown}
              </div>

              {selectedLesson.keyTakeaways?.length > 0 && (
                <div className="p-4 rounded-xl bg-gold/10 border border-gold/30 mb-6">
                  <h4 className="font-bold text-xs text-gold uppercase tracking-wider mb-2">📌 Key Takeaways for Viva / Exams:</h4>
                  <ul className="text-xs text-text-primary space-y-1">
                    {selectedLesson.keyTakeaways.map((t, idx) => (
                      <li key={idx}>• {t}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="border-t border-border pt-4 text-xs text-text-muted flex items-center gap-2">
                <FaBookOpen className="text-primary-light" /> Reference: {selectedLesson.referenceSource}
              </div>
            </div>
          ) : (
            <p className="text-center text-text-muted py-12">Select a lesson from syllabus to begin reading.</p>
          )}
        </div>
      </div>
    </div>
  );
}
