import React, { useState, useEffect } from 'react';
import {
  Building2,
  CheckSquare,
  Square,
  BookOpen,
  Code,
  Users,
  Brain,
  HelpCircle,
  FileText,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Save,
} from 'lucide-react';
import api from '../services/api';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import Badge from '../components/Badge';

export default function CompanyPrepPage({ showToast }) {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pattern'); // 'pattern' | 'aptitude' | 'coding' | 'technical' | 'hr'
  const [studentNotes, setStudentNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const res = await api.getCompanies();
      setCompanies(res.data);
      if (res.data.length > 0 && !selectedCompany) {
        setSelectedCompany(res.data[0]);
        setStudentNotes(res.data[0].studentNotes || '');
      } else if (selectedCompany) {
        const updated = res.data.find((c) => c._id === selectedCompany._id);
        if (updated) {
          setSelectedCompany(updated);
          setStudentNotes(updated.studentNotes || '');
        }
      }
    } catch (err) {
      showToast(err.message || 'Failed to load company guides', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleSelectCompany = (comp) => {
    setSelectedCompany(comp);
    setStudentNotes(comp.studentNotes || '');
    setActiveTab('pattern');
  };

  const handleToggleItem = async (section, itemId, currentStatus) => {
    if (!selectedCompany) return;

    try {
      const res = await api.toggleCompanyTopic(
        selectedCompany._id,
        section,
        itemId,
        !currentStatus
      );
      setSelectedCompany(res.data);
      setCompanies(companies.map((c) => (c._id === res.data._id ? res.data : c)));
      showToast('Checklist item updated in MongoDB', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to toggle item', 'error');
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedCompany) return;

    try {
      setSavingNotes(true);
      const res = await api.updateCompany(selectedCompany._id, {
        studentNotes,
      });
      setSelectedCompany(res.data);
      setCompanies(companies.map((c) => (c._id === res.data._id ? res.data : c)));
      showToast('Preparation notes saved to MongoDB', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to save notes', 'error');
    } finally {
      setSavingNotes(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading company recruitment guides from MongoDB..." />;
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Company-Specific Interview Preparation</h2>
          <p className="page-subtitle">
            Curated recruitment patterns, checklists, and viva guides for top Tier-1 & Mass Recruiters.
          </p>
        </div>
      </div>

      {/* Academic Disclaimer Notice */}
      <div
        style={{
          padding: '0.85rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          backgroundColor: '#fffbeb',
          border: '1px solid #fde68a',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          fontSize: '0.85rem',
          color: '#92400e',
        }}
      >
        <AlertCircle size={18} flexShrink={0} />
        <div>
          <strong>Preparation Material Notice:</strong> Company patterns and syllabus represent curated academic preparation guides from recent college campus drives. All topic checklists are editable and persist to MongoDB.
        </div>
      </div>

      {/* Main Grid: Companies List on Left, Deep Dive on Right */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(280px, 320px) 1fr',
          gap: '1.5rem',
          alignItems: 'start',
        }}
      >
        {/* Left Column: Company Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-muted)' }}>
            Select Target Company
          </h3>
          {companies.map((comp) => {
            const isSelected = selectedCompany?._id === comp._id;
            const progress = comp.progressPercentage || 0;

            return (
              <div
                key={comp._id}
                className="card"
                style={{
                  padding: '1.1rem 1.25rem',
                  cursor: 'pointer',
                  borderColor: isSelected ? 'var(--primary)' : 'var(--border-light)',
                  boxShadow: isSelected ? '0 0 0 2px var(--primary-light)' : 'var(--shadow-sm)',
                  backgroundColor: isSelected ? '#ffffff' : '#ffffff',
                }}
                onClick={() => handleSelectCompany(comp)}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: comp.badgeColor || '#2563eb',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '0.75rem',
                      }}
                    >
                      {comp.companyName.substring(0, 3)}
                    </div>
                    <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                      {comp.companyName}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)' }}>
                    {progress}%
                  </span>
                </div>

                <div className="progress-container" style={{ height: '6px', marginBottom: '0.5rem' }}>
                  <div
                    className="progress-bar"
                    style={{
                      width: `${progress}%`,
                      backgroundColor: comp.badgeColor || '#2563eb',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <span>{comp.recruitmentPattern?.length || 4} Rounds</span>
                  <span>
                    {(comp.aptitudeTopics?.length || 0) + (comp.codingTopics?.length || 0) + (comp.technicalTopics?.length || 0)} Topics
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Company Preparation Deep Dive */}
        {selectedCompany && (
          <div className="card" style={{ padding: '1.75rem' }}>
            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '1.25rem',
                borderBottom: '1px solid var(--border-light)',
                marginBottom: '1.5rem',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span
                    style={{
                      fontSize: '1.45rem',
                      fontWeight: 800,
                      color: 'var(--text-primary)',
                    }}
                  >
                    {selectedCompany.companyName}
                  </span>
                  <span className="badge badge-blue">
                    {selectedCompany.progressPercentage || 0}% Prepared
                  </span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>
                  {selectedCompany.overview}
                </p>
              </div>

              {selectedCompany.hiringTiers && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {selectedCompany.hiringTiers.map((tier, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontSize: '0.75rem',
                        padding: '3px 8px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--bg-subtle)',
                        fontWeight: 600,
                      }}
                    >
                      {tier}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Navigation Tabs */}
            <div
              style={{
                display: 'flex',
                gap: '0.5rem',
                borderBottom: '1px solid var(--border-light)',
                marginBottom: '1.5rem',
                overflowX: 'auto',
              }}
            >
              <button
                className={`btn btn-sm ${activeTab === 'pattern' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setActiveTab('pattern')}
              >
                <BookOpen size={14} />
                <span>Rounds & Pattern</span>
              </button>
              <button
                className={`btn btn-sm ${activeTab === 'aptitude' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setActiveTab('aptitude')}
              >
                <Brain size={14} />
                <span>Aptitude Checklist</span>
              </button>
              <button
                className={`btn btn-sm ${activeTab === 'coding' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setActiveTab('coding')}
              >
                <Code size={14} />
                <span>Coding Topics</span>
              </button>
              <button
                className={`btn btn-sm ${activeTab === 'technical' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setActiveTab('technical')}
              >
                <FileText size={14} />
                <span>Technical Topics</span>
              </button>
              <button
                className={`btn btn-sm ${activeTab === 'hr' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setActiveTab('hr')}
              >
                <Users size={14} />
                <span>HR & Behavioral</span>
              </button>
            </div>

            {/* Tab 1: Recruitment Pattern */}
            {activeTab === 'pattern' && (
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>
                  Recruitment Process Rounds
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {selectedCompany.recruitmentPattern?.map((round, index) => (
                    <div
                      key={index}
                      style={{
                        padding: '1rem',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--bg-subtle)',
                        border: '1px solid var(--border-light)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                        <span
                          style={{
                            width: 22,
                            height: 22,
                            borderRadius: '50%',
                            backgroundColor: 'var(--primary)',
                            color: 'white',
                            fontSize: '0.75rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                          }}
                        >
                          {round.roundNumber || index + 1}
                        </span>
                        <strong style={{ fontSize: '0.95rem' }}>{round.roundName}</strong>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginLeft: '2rem' }}>
                        {round.details}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 2: Aptitude Checklist */}
            {activeTab === 'aptitude' && (
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>
                  Aptitude Preparation Checklist (Click to mark completed)
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {selectedCompany.aptitudeTopics?.map((item) => (
                    <div
                      key={item.id || item._id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.85rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-light)',
                        backgroundColor: item.completed ? '#f0fdf4' : '#ffffff',
                        cursor: 'pointer',
                      }}
                      onClick={() => handleToggleItem('aptitudeTopics', item.id || item._id, item.completed)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {item.completed ? (
                          <CheckSquare size={18} color="var(--success)" />
                        ) : (
                          <Square size={18} color="var(--text-muted)" />
                        )}
                        <span
                          style={{
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            textDecoration: item.completed ? 'line-through' : 'none',
                            color: item.completed ? 'var(--text-muted)' : 'var(--text-primary)',
                          }}
                        >
                          {item.topic}
                        </span>
                      </div>
                      <Badge variant="blue">{item.category}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Coding Topics Checklist */}
            {activeTab === 'coding' && (
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>
                  Coding Topics & Algorithms Checklist
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {selectedCompany.codingTopics?.map((item) => (
                    <div
                      key={item.id || item._id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.85rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-light)',
                        backgroundColor: item.completed ? '#f0fdf4' : '#ffffff',
                        cursor: 'pointer',
                      }}
                      onClick={() => handleToggleItem('codingTopics', item.id || item._id, item.completed)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {item.completed ? (
                          <CheckSquare size={18} color="var(--success)" />
                        ) : (
                          <Square size={18} color="var(--text-muted)" />
                        )}
                        <span
                          style={{
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            textDecoration: item.completed ? 'line-through' : 'none',
                            color: item.completed ? 'var(--text-muted)' : 'var(--text-primary)',
                          }}
                        >
                          {item.topic}
                        </span>
                      </div>
                      <Badge variant={item.difficulty || 'Easy'}>{item.difficulty || 'Easy'}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 4: Technical Topics */}
            {activeTab === 'technical' && (
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>
                  Core CS & Technical Interview Topics
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {selectedCompany.technicalTopics?.map((item) => (
                    <div
                      key={item.id || item._id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.85rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-light)',
                        backgroundColor: item.completed ? '#f0fdf4' : '#ffffff',
                        cursor: 'pointer',
                      }}
                      onClick={() => handleToggleItem('technicalTopics', item.id || item._id, item.completed)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {item.completed ? (
                          <CheckSquare size={18} color="var(--success)" />
                        ) : (
                          <Square size={18} color="var(--text-muted)" />
                        )}
                        <span
                          style={{
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            textDecoration: item.completed ? 'line-through' : 'none',
                            color: item.completed ? 'var(--text-muted)' : 'var(--text-primary)',
                          }}
                        >
                          {item.topic}
                        </span>
                      </div>
                      <Badge variant={item.completed ? 'green' : 'gray'}>
                        {item.completed ? 'Mastered' : 'Pending'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 5: HR & Behavioral Questions */}
            {activeTab === 'hr' && (
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>
                  HR Interview Questions & Answering Strategies
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {selectedCompany.hrQuestions?.map((item) => (
                    <div
                      key={item.id || item._id}
                      style={{
                        padding: '1rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-light)',
                        backgroundColor: item.completed ? '#f0fdf4' : '#ffffff',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          justifyContent: 'space-between',
                          gap: '1rem',
                          marginBottom: '0.5rem',
                        }}
                      >
                        <strong style={{ fontSize: '0.95rem' }}>{item.question}</strong>
                        <button
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                          onClick={() => handleToggleItem('hrQuestions', item.id || item._id, item.completed)}
                        >
                          {item.completed ? 'Completed' : 'Mark Prepared'}
                        </button>
                      </div>
                      {item.tip && (
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', background: 'var(--bg-subtle)', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)' }}>
                          💡 <strong>Viva / Interview Tip:</strong> {item.tip}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Personal Preparation Notes for this Company */}
            <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>
                  Personal Notes for {selectedCompany.companyName}
                </h4>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={handleSaveNotes}
                  disabled={savingNotes}
                >
                  <Save size={14} />
                  <span>{savingNotes ? 'Saving...' : 'Save Notes to MongoDB'}</span>
                </button>
              </div>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder={`Record personal notes, test dates, registration IDs, or specific interview tips for ${selectedCompany.companyName}...`}
                value={studentNotes}
                onChange={(e) => setStudentNotes(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
