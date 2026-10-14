import React, { useState, useEffect } from 'react';
import {
  MessageSquareCode,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Award,
  Clock,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  History,
  FileCheck,
  ChevronRight,
  Info,
} from 'lucide-react';
import api from '../services/api';
import Modal from '../components/Modal';
import Badge from '../components/Badge';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';

const CATEGORIES = [
  'DSA',
  'JavaScript',
  'React',
  'Node.js',
  'MongoDB',
  'HR',
  'Aptitude',
];

export default function MockInterviewsPage({ showToast }) {
  const [selectedCategory, setSelectedCategory] = useState('JavaScript');
  const [interviewState, setInterviewState] = useState('idle'); // 'idle' | 'in_progress' | 'completed'

  // Active Interview Session State
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { [index]: { text, optionIndex, confidence } }
  const [evaluating, setEvaluating] = useState(false);
  const [sessionResult, setSessionResult] = useState(null);

  // History State
  const [history, setHistory] = useState([]);
  const [historyStats, setHistoryStats] = useState({ totalSessions: 0, overallAvgScore: 0 });
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [reviewModalSession, setReviewModalSession] = useState(null);

  const fetchHistory = async () => {
    try {
      setLoadingHistory(true);
      const res = await api.getMockInterviewHistory();
      setHistory(res.data);
      if (res.stats) setHistoryStats(res.stats);
    } catch (err) {
      console.error('Failed to load history:', err.message);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleStartInterview = async () => {
    try {
      setEvaluating(true);
      const res = await api.getMockQuestions(selectedCategory, 5);
      if (res.data.length === 0) {
        showToast(`No questions found in question bank for ${selectedCategory}`, 'warning');
        return;
      }
      setQuestions(res.data);
      setCurrentIndex(0);
      setUserAnswers({});
      setSessionResult(null);
      setInterviewState('in_progress');
    } catch (err) {
      showToast(err.message || 'Failed to start mock session', 'error');
    } finally {
      setEvaluating(false);
    }
  };

  const handleAnswerChange = (val) => {
    const currentAns = userAnswers[currentIndex] || { confidence: 'Medium' };
    setUserAnswers({
      ...userAnswers,
      [currentIndex]: { ...currentAns, text: val },
    });
  };

  const handleOptionSelect = (optionIndex) => {
    const currentAns = userAnswers[currentIndex] || { confidence: 'Medium' };
    setUserAnswers({
      ...userAnswers,
      [currentIndex]: { ...currentAns, optionIndex },
    });
  };

  const handleConfidenceSelect = (confidence) => {
    const currentAns = userAnswers[currentIndex] || {};
    setUserAnswers({
      ...userAnswers,
      [currentIndex]: { ...currentAns, confidence },
    });
  };

  const handleSubmitInterview = async () => {
    try {
      setEvaluating(true);
      const formattedResponses = questions.map((q, idx) => {
        const ans = userAnswers[idx] || {};
        return {
          questionId: q._id,
          questionText: q.questionText,
          questionType: q.questionType,
          userAnswer: ans.text || '',
          selectedOptionIndex: ans.optionIndex,
          confidence: ans.confidence || 'Medium',
        };
      });

      const res = await api.evaluateMockInterview({
        category: selectedCategory,
        responses: formattedResponses,
      });

      setSessionResult(res.data);
      setInterviewState('completed');
      showToast('Mock interview evaluated and recorded in MongoDB!', 'success');
      fetchHistory();
    } catch (err) {
      showToast(err.message || 'Failed to evaluate interview', 'error');
    } finally {
      setEvaluating(false);
    }
  };

  const currentQ = questions[currentIndex];
  const currentAnswer = userAnswers[currentIndex] || { confidence: 'Medium' };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Interactive Mock Interview Simulator</h2>
          <p className="page-subtitle">
            Simulate viva & technical rounds with rule-based evaluation, confidence metrics, and MongoDB history.
          </p>
        </div>
      </div>

      {/* State 1: Idle Setup Screen */}
      {interviewState === 'idle' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem', alignItems: 'start' }}>
          {/* Main Setup Card */}
          <div className="card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: '#eff6ff',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Sparkles size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Start New Mock Assessment</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                  Choose a technical domain or HR category to begin a 5-question mock interview.
                </p>
              </div>
            </div>

            {/* Category Selectors */}
            <div style={{ marginBottom: '1.75rem' }}>
              <label className="form-label" style={{ marginBottom: '0.75rem' }}>
                Select Domain / Subject:
              </label>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                  gap: '0.75rem',
                }}
              >
                {CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      className={`btn ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                      style={{
                        padding: '0.85rem 0.5rem',
                        fontSize: '0.9rem',
                        fontWeight: 700,
                        justifyContent: 'center',
                      }}
                      onClick={() => setSelectedCategory(cat)}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Academic Evaluation Notice */}
            <div
              style={{
                padding: '1rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#f8fafc',
                border: '1px solid var(--border-light)',
                marginBottom: '1.75rem',
                display: 'flex',
                gap: '0.75rem',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
              }}
            >
              <Info size={18} color="var(--primary)" flexShrink={0} />
              <div>
                <strong>Rule-Based Evaluator Architecture:</strong> Evaluates answers using keyword pattern matching, depth analysis, and multiple-choice verification. Demonstrates full MERN data flow without requiring paid third-party AI API keys.
              </div>
            </div>

            <button
              className="btn btn-primary"
              style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}
              onClick={handleStartInterview}
              disabled={evaluating}
            >
              <Sparkles size={18} />
              <span>{evaluating ? 'Loading Questions...' : `Start ${selectedCategory} Interview`}</span>
            </button>
          </div>

          {/* Right Sidebar: Historical Performance */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <History size={16} />
                <span>Past Attempts</span>
              </h3>
              <span className="badge badge-purple">{historyStats.totalSessions} Sessions</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div
                style={{
                  padding: '0.85rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-subtle)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Average Score</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>
                  {historyStats.overallAvgScore}%
                </div>
              </div>

              {loadingHistory ? (
                <div style={{ textAlign: 'center', padding: '1rem' }}>Loading past tests...</div>
              ) : history.length === 0 ? (
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1rem' }}>
                  No interview sessions recorded yet.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '300px', overflowY: 'auto' }}>
                  {history.map((sess) => (
                    <div
                      key={sess._id}
                      style={{
                        padding: '0.65rem 0.85rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-light)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        fontSize: '0.82rem',
                      }}
                      onClick={() => setReviewModalSession(sess)}
                    >
                      <div>
                        <strong>{sess.category}</strong>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          {new Date(sess.completedAt).toLocaleDateString()}
                        </div>
                      </div>
                      <Badge variant={sess.scorePercentage >= 70 ? 'green' : 'amber'}>
                        {sess.scorePercentage}%
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* State 2: In-Progress Interview Screen */}
      {interviewState === 'in_progress' && currentQ && (
        <div className="card" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
          {/* Progress Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.25rem',
              paddingBottom: '1rem',
              borderBottom: '1px solid var(--border-light)',
            }}
          >
            <div>
              <span className="badge badge-blue">{currentQ.category}</span>
              <span className="badge badge-gray" style={{ marginLeft: '0.5rem' }}>
                Question {currentIndex + 1} of {questions.length}
              </span>
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                if (window.confirm('Cancel this mock interview session?')) {
                  setInterviewState('idle');
                }
              }}
            >
              Exit Session
            </button>
          </div>

          {/* Question Text */}
          <h3
            style={{
              fontSize: '1.2rem',
              fontWeight: 700,
              lineHeight: 1.5,
              marginBottom: '1.5rem',
            }}
          >
            {currentQ.questionText}
          </h3>

          {/* Answer Area: MCQ vs Subjective */}
          {currentQ.questionType === 'mcq' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <label className="form-label">Select the best answer option:</label>
              {currentQ.options?.map((opt, optIdx) => {
                const isSelected = currentAnswer.optionIndex === optIdx;
                return (
                  <div
                    key={optIdx}
                    style={{
                      padding: '0.85rem 1.25rem',
                      borderRadius: 'var(--radius-md)',
                      border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-light)',
                      backgroundColor: isSelected ? 'var(--primary-light)' : '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                    }}
                    onClick={() => handleOptionSelect(optIdx)}
                  >
                    <input
                      type="radio"
                      name={`mcq-${currentIndex}`}
                      checked={isSelected}
                      onChange={() => handleOptionSelect(optIdx)}
                    />
                    <span style={{ fontSize: '0.9rem', fontWeight: isSelected ? 600 : 400 }}>
                      {opt}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Type your explanation / technical answer:</label>
              <textarea
                className="form-textarea"
                rows={5}
                placeholder="Structure your answer with definitions, core principles, time complexity, and practical examples..."
                value={currentAnswer.text || ''}
                onChange={(e) => handleAnswerChange(e.target.value)}
              />
            </div>
          )}

          {/* Confidence Self-Assessment */}
          <div style={{ marginBottom: '2rem', padding: '1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-subtle)' }}>
            <label className="form-label" style={{ marginBottom: '0.5rem' }}>
              Rate your confidence on this question:
            </label>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {['Low', 'Medium', 'High'].map((conf) => (
                <button
                  key={conf}
                  type="button"
                  className={`btn btn-sm ${currentAnswer.confidence === conf ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => handleConfidenceSelect(conf)}
                >
                  {conf === 'High' ? '🌟 High Confidence' : conf === 'Medium' ? '⚖️ Moderate' : '🌱 Needs Review (Low)'}
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Controls */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '1rem',
              borderTop: '1px solid var(--border-light)',
            }}
          >
            <button
              className="btn btn-secondary"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex(currentIndex - 1)}
            >
              <ArrowLeft size={16} />
              <span>Previous</span>
            </button>

            {currentIndex < questions.length - 1 ? (
              <button
                className="btn btn-primary"
                onClick={() => setCurrentIndex(currentIndex + 1)}
              >
                <span>Next Question</span>
                <ArrowRight size={16} />
              </button>
            ) : (
              <button
                className="btn btn-success"
                onClick={handleSubmitInterview}
                disabled={evaluating}
              >
                <CheckCircle2 size={16} />
                <span>{evaluating ? 'Evaluating...' : 'Submit & Finish Mock Test'}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* State 3: Completed Evaluation & Summary Screen */}
      {interviewState === 'completed' && sessionResult && (
        <div className="card" style={{ maxWidth: '850px', margin: '0 auto', padding: '2rem' }}>
          {/* Header Score Banner */}
          <div
            style={{
              textAlign: 'center',
              padding: '2rem',
              borderRadius: 'var(--radius-lg)',
              background: 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)',
              border: '1px solid #bfdbfe',
              marginBottom: '2rem',
            }}
          >
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                backgroundColor: 'var(--primary)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
              }}
            >
              <Award size={32} />
            </div>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Overall Score: {sessionResult.scorePercentage}%
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '500px', margin: '0.5rem auto 1rem' }}>
              {sessionResult.feedbackSummary}
            </p>
            <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
              <Badge variant="blue">Domain: {sessionResult.category}</Badge>
              <Badge variant="purple">Confidence: {sessionResult.averageConfidence}</Badge>
              <Badge variant="green">Saved to MongoDB</Badge>
            </div>
          </div>

          {/* Question-by-Question Detailed Review */}
          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
            Detailed Response Breakdown & Academic Feedback
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
            {sessionResult.responses?.map((resp, idx) => (
              <div
                key={idx}
                style={{
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-light)',
                  backgroundColor: '#ffffff',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.5rem' }}>
                  <strong style={{ fontSize: '0.95rem' }}>
                    Q{idx + 1}. {resp.questionText}
                  </strong>
                  <Badge variant={resp.isCorrect ? 'green' : 'amber'}>
                    {resp.isCorrect ? 'Satisfactory' : 'Needs Expansion'}
                  </Badge>
                </div>

                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                  <strong>Your Answer:</strong>{' '}
                  {resp.userAnswer || (resp.selectedOptionIndex !== undefined ? `Option ${resp.selectedOptionIndex + 1}` : 'No response provided')}
                </div>

                <div
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--bg-subtle)',
                    fontSize: '0.85rem',
                  }}
                >
                  {resp.feedback}
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <button
              className="btn btn-primary"
              onClick={() => {
                setInterviewState('idle');
                setSessionResult(null);
              }}
            >
              <RotateCcw size={16} />
              <span>Take Another Mock Interview</span>
            </button>
          </div>
        </div>
      )}

      {/* Review Past Session Modal */}
      <Modal
        isOpen={!!reviewModalSession}
        onClose={() => setReviewModalSession(null)}
        title={`Past Interview Review: ${reviewModalSession?.category || ''}`}
        maxWidth="750px"
      >
        {reviewModalSession && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div>
                <strong>Score: {reviewModalSession.scorePercentage}%</strong>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Completed on {new Date(reviewModalSession.completedAt).toLocaleString()}
                </div>
              </div>
              <Badge variant="blue">{reviewModalSession.averageConfidence} Confidence</Badge>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {reviewModalSession.responses?.map((r, i) => (
                <div key={i} style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>
                    Q{i + 1}. {r.questionText}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    {r.userAnswer}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--primary)', marginTop: '4px' }}>
                    {r.feedback}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
