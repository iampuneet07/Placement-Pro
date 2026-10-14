import React, { useState, useEffect } from 'react';
import {
  Code2,
  Search,
  Filter,
  Plus,
  ExternalLink,
  Edit,
  Trash2,
  FileText,
  CheckCircle,
  Clock,
  Circle,
  Tag,
  AlertCircle,
  Save,
} from 'lucide-react';
import api from '../services/api';
import Modal from '../components/Modal';
import Badge from '../components/Badge';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';

const TOPICS = [
  'All',
  'Arrays',
  'Strings',
  'Linked Lists',
  'Stacks and Queues',
  'Searching and Sorting',
  'Binary Trees',
  'Graphs',
  'Dynamic Programming',
];

const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard'];
const STATUSES = ['All', 'Not Started', 'In Progress', 'Solved'];

export default function DsaPracticePage({ showToast }) {
  const [questions, setQuestions] = useState([]);
  const [stats, setStats] = useState({ total: 0, solved: 0, inProgress: 0, notStarted: 0 });
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [activeQuestion, setActiveQuestion] = useState(null);
  const [formQuestion, setFormQuestion] = useState({
    title: '',
    topic: 'Arrays',
    difficulty: 'Easy',
    description: '',
    companyTags: '',
    practiceUrl: '',
    status: 'Not Started',
    notes: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (selectedTopic !== 'All') params.topic = selectedTopic;
      if (selectedDifficulty !== 'All') params.difficulty = selectedDifficulty;
      if (selectedStatus !== 'All') params.status = selectedStatus;

      const res = await api.getDsaQuestions(params);
      setQuestions(res.data);
      if (res.stats) setStats(res.stats);
    } catch (err) {
      showToast(err.message || 'Failed to load DSA questions', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [search, selectedTopic, selectedDifficulty, selectedStatus]);

  const handleOpenAdd = () => {
    setFormQuestion({
      title: '',
      topic: selectedTopic !== 'All' ? selectedTopic : 'Arrays',
      difficulty: 'Easy',
      description: '',
      companyTags: '',
      practiceUrl: '',
      status: 'Not Started',
      notes: '',
    });
    setFormErrors({});
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (q) => {
    setActiveQuestion(q);
    setFormQuestion({
      title: q.title,
      topic: q.topic,
      difficulty: q.difficulty,
      description: q.description || '',
      companyTags: Array.isArray(q.companyTags) ? q.companyTags.join(', ') : '',
      practiceUrl: q.practiceUrl || '',
      status: q.status || 'Not Started',
      notes: q.notes || '',
    });
    setFormErrors({});
    setIsEditModalOpen(true);
  };

  const handleOpenNotes = (q) => {
    setActiveQuestion(q);
    setFormQuestion({ ...formQuestion, notes: q.notes || '' });
    setIsNotesModalOpen(true);
  };

  const handleOpenDelete = (q) => {
    setActiveQuestion(q);
    setIsDeleteModalOpen(true);
  };

  const handleStatusQuickChange = async (q, newStatus) => {
    try {
      const res = await api.updateDsaQuestion(q._id, { status: newStatus });
      setQuestions(questions.map((item) => (item._id === q._id ? res.data : item)));
      showToast(`Question status updated to ${newStatus} in MongoDB`, 'success');
      fetchQuestions();
    } catch (err) {
      showToast(err.message || 'Failed to update status', 'error');
    }
  };

  const validateQuestionForm = () => {
    const errs = {};
    if (!formQuestion.title.trim()) errs.title = 'Title is required';
    if (!formQuestion.topic) errs.topic = 'Topic is required';
    return errs;
  };

  const handleSaveAdd = async (e) => {
    e.preventDefault();
    const errs = validateQuestionForm();
    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }

    try {
      setSaving(true);
      await api.createDsaQuestion(formQuestion);
      setIsAddModalOpen(false);
      showToast('New DSA question added to MongoDB!', 'success');
      fetchQuestions();
    } catch (err) {
      showToast(err.message || 'Failed to add question', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    const errs = validateQuestionForm();
    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }

    try {
      setSaving(true);
      await api.updateDsaQuestion(activeQuestion._id, formQuestion);
      setIsEditModalOpen(false);
      showToast('DSA question updated in MongoDB!', 'success');
      fetchQuestions();
    } catch (err) {
      showToast(err.message || 'Failed to update question', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotes = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.updateDsaQuestion(activeQuestion._id, { notes: formQuestion.notes });
      setIsNotesModalOpen(false);
      showToast('Personal notes saved in MongoDB!', 'success');
      fetchQuestions();
    } catch (err) {
      showToast(err.message || 'Failed to save notes', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      setSaving(true);
      await api.deleteDsaQuestion(activeQuestion._id);
      setIsDeleteModalOpen(false);
      showToast('DSA question removed from MongoDB', 'success');
      fetchQuestions();
    } catch (err) {
      showToast(err.message || 'Failed to delete question', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Data Structures & Algorithms Tracker</h2>
          <p className="page-subtitle">
            Curated campus placement questions organized by topic and difficulty level.
          </p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={handleOpenAdd}>
          <Plus size={16} />
          <span>Add DSA Question</span>
        </button>
      </div>

      {/* Progress Cards */}
      <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="stat-card">
          <div className="stat-icon-wrapper blue">
            <Code2 size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Total Questions</div>
            <div className="stat-value">{stats.total}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper green">
            <CheckCircle size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Solved</div>
            <div className="stat-value" style={{ color: 'var(--success-text)' }}>
              {stats.solved}
            </div>
            <div className="stat-subtext">
              {stats.total > 0 ? `${Math.round((stats.solved / stats.total) * 100)}%` : '0%'}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper amber">
            <Clock size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">In Progress</div>
            <div className="stat-value" style={{ color: 'var(--warning-text)' }}>
              {stats.inProgress}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper purple">
            <Circle size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Not Started</div>
            <div className="stat-value">{stats.notStarted}</div>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="card" style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
        <div className="filter-bar" style={{ margin: 0 }}>
          <div className="search-input-wrapper">
            <Search size={18} />
            <input
              type="text"
              className="form-control"
              placeholder="Search by title, description, or company tag..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-actions">
            <div>
              <select
                className="form-select"
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
              >
                {TOPICS.map((t) => (
                  <option key={t} value={t}>
                    {t === 'All' ? 'All Topics' : t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                className="form-select"
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
              >
                {DIFFICULTIES.map((d) => (
                  <option key={d} value={d}>
                    {d === 'All' ? 'All Difficulties' : d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                className="form-select"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s === 'All' ? 'All Statuses' : s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Questions Table */}
      {loading ? (
        <LoadingSpinner text="Filtering and loading questions from MongoDB..." />
      ) : questions.length === 0 ? (
        <EmptyState
          icon={Code2}
          title="No questions match your criteria"
          description="Try clearing search filters or add a new DSA question to MongoDB."
          actionLabel="Add New Question"
          onAction={handleOpenAdd}
        />
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>Status</th>
                <th>Problem Title</th>
                <th>Topic</th>
                <th>Difficulty</th>
                <th>Company Tags</th>
                <th>Notes</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((q) => (
                <tr key={q._id}>
                  {/* Status Toggle Quick Pill */}
                  <td>
                    <button
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                      }}
                      title={`Click to cycle status. Current: ${q.status}`}
                      onClick={() => {
                        const nextStatus =
                          q.status === 'Solved'
                            ? 'Not Started'
                            : q.status === 'In Progress'
                            ? 'Solved'
                            : 'In Progress';
                        handleStatusQuickChange(q, nextStatus);
                      }}
                    >
                      {q.status === 'Solved' ? (
                        <CheckCircle size={20} color="var(--success)" />
                      ) : q.status === 'In Progress' ? (
                        <Clock size={20} color="var(--warning)" />
                      ) : (
                        <Circle size={20} color="var(--border-subtle)" />
                      )}
                    </button>
                  </td>

                  {/* Title & Practice Link */}
                  <td>
                    <div className="table-title-cell">{q.title}</div>
                    {q.practiceUrl && (
                      <a
                        href={q.practiceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: '0.78rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          marginTop: '2px',
                        }}
                      >
                        <span>Practice Online</span>
                        <ExternalLink size={11} />
                      </a>
                    )}
                  </td>

                  {/* Topic */}
                  <td>
                    <span style={{ fontWeight: 600, fontSize: '0.82rem' }}>{q.topic}</span>
                  </td>

                  {/* Difficulty */}
                  <td>
                    <Badge variant={q.difficulty}>{q.difficulty}</Badge>
                  </td>

                  {/* Company Tags */}
                  <td>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                      {q.companyTags && q.companyTags.length > 0 ? (
                        q.companyTags.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            style={{
                              fontSize: '0.72rem',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              backgroundColor: 'var(--bg-subtle)',
                              color: 'var(--text-secondary)',
                            }}
                          >
                            {tag}
                          </span>
                        ))
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>-</span>
                      )}
                      {q.companyTags && q.companyTags.length > 3 && (
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          +{q.companyTags.length - 3}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Notes Icon */}
                  <td>
                    <button
                      className="btn btn-secondary btn-icon-only"
                      title={q.notes ? 'View/Edit Notes' : 'Add Notes'}
                      style={{
                        padding: '0.35rem 0.6rem',
                        fontSize: '0.78rem',
                        color: q.notes ? 'var(--primary)' : 'var(--text-muted)',
                      }}
                      onClick={() => handleOpenNotes(q)}
                    >
                      <FileText size={14} />
                      {q.notes ? <span style={{ marginLeft: '4px' }}>Notes</span> : null}
                    </button>
                  </td>

                  {/* Actions */}
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                      <button
                        className="btn btn-secondary btn-icon-only"
                        title="Edit question"
                        onClick={() => handleOpenEdit(q)}
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        className="btn btn-secondary btn-icon-only"
                        title="Delete question"
                        style={{ color: 'var(--danger)' }}
                        onClick={() => handleOpenDelete(q)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Question Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New DSA Question (MongoDB)"
      >
        <form onSubmit={handleSaveAdd}>
          <div className="form-group">
            <label className="form-label">Problem Title *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Valid Anagram, LRU Cache..."
              value={formQuestion.title}
              onChange={(e) => setFormQuestion({ ...formQuestion, title: e.target.value })}
            />
            {formErrors.title && <div className="form-error">{formErrors.title}</div>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Topic Category *</label>
              <select
                className="form-select"
                value={formQuestion.topic}
                onChange={(e) => setFormQuestion({ ...formQuestion, topic: e.target.value })}
              >
                {TOPICS.filter((t) => t !== 'All').map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Difficulty Level</label>
              <select
                className="form-select"
                value={formQuestion.difficulty}
                onChange={(e) => setFormQuestion({ ...formQuestion, difficulty: e.target.value })}
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Completion Status</label>
              <select
                className="form-select"
                value={formQuestion.status}
                onChange={(e) => setFormQuestion({ ...formQuestion, status: e.target.value })}
              >
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Solved">Solved</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Practice URL (LeetCode/GFG)</label>
              <input
                type="url"
                className="form-control"
                placeholder="https://leetcode.com/problems/..."
                value={formQuestion.practiceUrl}
                onChange={(e) => setFormQuestion({ ...formQuestion, practiceUrl: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Company Tags (comma separated)</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. TCS, Infosys, Amazon, Accenture"
              value={formQuestion.companyTags}
              onChange={(e) => setFormQuestion({ ...formQuestion, companyTags: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Problem Description / Approach</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="Brief problem statement or notes..."
              value={formQuestion.description}
              onChange={(e) => setFormQuestion({ ...formQuestion, description: e.target.value })}
            />
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              <Save size={16} />
              <span>{saving ? 'Saving...' : 'Add to MongoDB'}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Question Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit DSA Question"
      >
        <form onSubmit={handleSaveEdit}>
          <div className="form-group">
            <label className="form-label">Problem Title *</label>
            <input
              type="text"
              className="form-control"
              value={formQuestion.title}
              onChange={(e) => setFormQuestion({ ...formQuestion, title: e.target.value })}
            />
            {formErrors.title && <div className="form-error">{formErrors.title}</div>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Topic *</label>
              <select
                className="form-select"
                value={formQuestion.topic}
                onChange={(e) => setFormQuestion({ ...formQuestion, topic: e.target.value })}
              >
                {TOPICS.filter((t) => t !== 'All').map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Difficulty</label>
              <select
                className="form-select"
                value={formQuestion.difficulty}
                onChange={(e) => setFormQuestion({ ...formQuestion, difficulty: e.target.value })}
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={formQuestion.status}
                onChange={(e) => setFormQuestion({ ...formQuestion, status: e.target.value })}
              >
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Solved">Solved</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Practice URL</label>
              <input
                type="url"
                className="form-control"
                value={formQuestion.practiceUrl}
                onChange={(e) => setFormQuestion({ ...formQuestion, practiceUrl: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Company Tags</label>
            <input
              type="text"
              className="form-control"
              value={formQuestion.companyTags}
              onChange={(e) => setFormQuestion({ ...formQuestion, companyTags: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Personal Notes & Solution Insights</label>
            <textarea
              className="form-textarea"
              rows={3}
              value={formQuestion.notes}
              onChange={(e) => setFormQuestion({ ...formQuestion, notes: e.target.value })}
            />
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              <Save size={16} />
              <span>{saving ? 'Updating...' : 'Update Question'}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Personal Notes Modal */}
      <Modal
        isOpen={isNotesModalOpen}
        onClose={() => setIsNotesModalOpen(false)}
        title={`Notes: ${activeQuestion?.title || 'DSA Problem'}`}
      >
        <form onSubmit={handleSaveNotes}>
          <div className="form-group">
            <label className="form-label">
              Personal Revision Notes & Complexity Analysis:
            </label>
            <textarea
              className="form-textarea"
              rows={6}
              placeholder="Record intuition, edge cases, time complexity O(n), and space complexity..."
              value={formQuestion.notes}
              onChange={(e) => setFormQuestion({ ...formQuestion, notes: e.target.value })}
            />
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsNotesModalOpen(false)}
            >
              Close
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              <Save size={16} />
              <span>Save Notes to MongoDB</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Deletion"
        maxWidth="480px"
      >
        <div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            Are you sure you want to permanently delete{' '}
            <strong>"{activeQuestion?.title}"</strong> from your MongoDB database?
          </p>
          <div className="modal-footer" style={{ padding: 0, border: 'none', background: 'none' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleDeleteConfirm}
              disabled={saving}
            >
              <Trash2 size={16} />
              <span>{saving ? 'Deleting...' : 'Delete Record'}</span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
