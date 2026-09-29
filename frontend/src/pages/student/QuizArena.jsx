import { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { FaAward, FaCheckCircle, FaTimesCircle, FaClock, FaRedo, FaBook } from 'react-icons/fa';

export default function QuizArena() {
  const [quizzes, setQuizzes] = useState([]);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const { data } = await api.get('/student/quizzes');
      if (data.quizzes) {
        setQuizzes(data.quizzes);
      }
    } catch (err) {
      console.error('Failed to fetch quizzes', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuiz = (q) => {
    setActiveQuiz(q);
    setAnswers({});
    setResult(null);
  };

  const handleSelectOption = (qIdx, optIdx) => {
    setAnswers({ ...answers, [qIdx]: optIdx });
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < activeQuiz.questions.length) {
      if (!window.confirm('You have unanswered questions. Submit anyway?')) return;
    }

    setSubmitting(true);
    try {
      const { data } = await api.post(`/student/quizzes/${activeQuiz._id}/submit`, {
        answers,
        timeTakenSeconds: 150,
      });
      if (data.success) {
        setResult(data.result);
        toast.success(data.result.passed ? 'Congratulations! You passed!' : 'Quiz completed.');
      }
    } catch (err) {
      toast.error('Failed to submit quiz');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="spinner-wrap"><div className="spinner"></div></div>;

  return (
    <div className="fade-in max-w-5xl mx-auto">
      <div className="page-header mb-8">
        <h1 className="page-title flex items-center gap-3">
          <FaAward className="text-gold" /> ICAR JRF/SRF MCQ & Quiz Arena
        </h1>
        <p className="page-subtitle">Practice multiple choice assessments with instant scientific explanations and curriculum sources.</p>
      </div>

      {!activeQuiz ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quizzes.map((q) => (
            <div key={q._id} className="card p-6 border-l-4 border-gold hover:border-primary-light transition flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="badge badge-gold !text-[10px]">{q.subject}</span>
                  <span className="badge badge-primary !text-[10px]">{q.difficulty}</span>
                </div>
                <h3 className="text-xl font-bold mb-2">{q.title}</h3>
                <p className="text-xs text-text-muted mb-4">{q.questions?.length} MCQs • Passing Score: {q.passingScorePercentage}%</p>
              </div>
              <button onClick={() => handleStartQuiz(q)} className="btn btn-primary w-full">
                Start Test Arena
              </button>
            </div>
          ))}
        </div>
      ) : !result ? (
        <div className="card p-8">
          <div className="flex justify-between items-center mb-8 border-b border-border pb-4">
            <div>
              <span className="badge badge-primary mb-1">{activeQuiz.subject}</span>
              <h2 className="text-2xl font-bold">{activeQuiz.title}</h2>
            </div>
            <button onClick={() => setActiveQuiz(null)} className="btn btn-secondary btn-sm">
              Exit Quiz
            </button>
          </div>

          <div className="space-y-8">
            {activeQuiz.questions?.map((q, qIdx) => (
              <div key={qIdx} className="p-6 rounded-2xl bg-bg-surface border border-border">
                <h4 className="font-bold text-base mb-4 text-text-primary">
                  Question {qIdx + 1}: {q.questionText}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {q.options?.map((opt, oIdx) => (
                    <button
                      key={oIdx}
                      type="button"
                      onClick={() => handleSelectOption(qIdx, oIdx)}
                      className={`p-4 rounded-xl text-left text-sm transition border ${
                        answers[qIdx] === oIdx
                          ? 'border-primary bg-primary text-white font-bold'
                          : 'border-border bg-bg-card hover:bg-bg-elevated text-text-secondary'
                      }`}
                    >
                      {String.fromCharCode(65 + oIdx)}. {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-4 mt-8 pt-4 border-t border-border">
            <button onClick={handleSubmit} disabled={submitting} className="btn btn-gold btn-lg px-8">
              {submitting ? 'Evaluating...' : 'Submit Assessment'}
            </button>
          </div>
        </div>
      ) : (
        /* Result Screen */
        <div className="card p-8">
          <div className="text-center mb-8">
            <div className={`w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl shadow-2xl ${
              result.passed ? 'bg-success/20 text-success-light border-4 border-success' : 'bg-danger/20 text-danger-light border-4 border-danger'
            }`}>
              {result.passed ? <FaCheckCircle /> : <FaTimesCircle />}
            </div>
            <h2 className="text-3xl font-black">{result.passed ? 'Assessment Passed! 🎓' : 'Needs Revision'}</h2>
            <p className="text-xl font-bold text-gold mt-2">Score: {result.score} / {result.totalQuestions} ({result.percentage}%)</p>
          </div>

          <div className="space-y-6 my-8">
            <h3 className="text-lg font-bold text-text-primary">Question Review & Scientific Explanations:</h3>
            {result.questionsWithExplanations?.map((q, idx) => (
              <div key={idx} className={`p-6 rounded-2xl border ${q.isCorrect ? 'border-success/40 bg-success/5' : 'border-danger/40 bg-danger/5'}`}>
                <div className="flex justify-between items-start mb-2">
                  <h5 className="font-bold text-sm text-text-primary">Q{idx + 1}: {q.questionText}</h5>
                  <span className={`badge !text-[10px] ${q.isCorrect ? 'badge-success' : 'badge-danger'}`}>
                    {q.isCorrect ? 'Correct ✓' : 'Incorrect ✗'}
                  </span>
                </div>
                <p className="text-xs text-text-secondary mb-1">
                  Correct Answer: <strong className="text-success-light">{q.options[q.correctOptionIndex]}</strong>
                </p>
                <div className="p-3 rounded-lg bg-bg-card border border-border mt-3">
                  <p className="text-xs text-text-muted leading-relaxed"><strong>Explanation:</strong> {q.explanation}</p>
                  <p className="text-[10px] text-gold mt-1">Source: {q.academicSource}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-4">
            <button onClick={() => setActiveQuiz(null)} className="btn btn-primary">
              Back to Quiz Arena
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
