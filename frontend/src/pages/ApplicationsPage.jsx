import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Search,
  Filter,
  Plus,
  Calendar,
  ExternalLink,
  Edit,
  Trash2,
  Building,
  MapPin,
  Clock,
  DollarSign,
  AlertCircle,
  Save,
  CheckCircle2,
} from 'lucide-react';
import api from '../services/api';
import Modal from '../components/Modal';
import Badge from '../components/Badge';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';

const STATUSES = [
  'All',
  'Wishlist',
  'Applied',
  'Online Assessment',
  'Interview',
  'Offer',
  'Rejected',
];

const JOB_TYPES = ['All', 'Full-time', 'Internship', 'Intern + PPO'];

export default function ApplicationsPage({ showToast, openAddTrigger, setOpenAddTrigger }) {
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({ total: 0, statusCounts: {} });
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [sortOption, setSortOption] = useState('newest');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [activeApp, setActiveApp] = useState(null);

  const [formApp, setFormApp] = useState({
    company: '',
    role: '',
    type: 'Full-time',
    location: 'Pan India',
    salaryPackage: '',
    applicationDate: new Date().toISOString().split('T')[0],
    deadline: '',
    status: 'Applied',
    jobUrl: '',
    recruiterNotes: '',
    interviewDate: '',
    notes: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Trigger from navbar / dashboard quick action
  useEffect(() => {
    if (openAddTrigger) {
      handleOpenAdd();
      if (setOpenAddTrigger) setOpenAddTrigger(false);
    }
  }, [openAddTrigger]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (selectedStatus !== 'All') params.status = selectedStatus;
      if (selectedType !== 'All') params.type = selectedType;
      if (sortOption) params.sort = sortOption;

      const res = await api.getApplications(params);
      setApplications(res.data);
      if (res.stats) setStats(res.stats);
    } catch (err) {
      showToast(err.message || 'Failed to load applications', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [search, selectedStatus, selectedType, sortOption]);

  const handleOpenAdd = () => {
    setFormApp({
      company: '',
      role: '',
      type: 'Full-time',
      location: 'Pan India',
      salaryPackage: '',
      applicationDate: new Date().toISOString().split('T')[0],
      deadline: '',
      status: 'Applied',
      jobUrl: '',
      recruiterNotes: '',
      interviewDate: '',
      notes: '',
    });
    setFormErrors({});
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (app) => {
    setActiveApp(app);
    setFormApp({
      company: app.company,
      role: app.role,
      type: app.type || 'Full-time',
      location: app.location || 'Pan India',
      salaryPackage: app.salaryPackage || '',
      applicationDate: app.applicationDate ? app.applicationDate.split('T')[0] : '',
      deadline: app.deadline ? app.deadline.split('T')[0] : '',
      status: app.status || 'Applied',
      jobUrl: app.jobUrl || '',
      recruiterNotes: app.recruiterNotes || '',
      interviewDate: app.interviewDate ? app.interviewDate.split('T')[0] : '',
      notes: app.notes || '',
    });
    setFormErrors({});
    setIsEditModalOpen(true);
  };

  const handleOpenDelete = (app) => {
    setActiveApp(app);
    setIsDeleteModalOpen(true);
  };

  const validateAppForm = () => {
    const errs = {};
    if (!formApp.company.trim()) errs.company = 'Company name is required';
    if (!formApp.role.trim()) errs.role = 'Job role is required';
    return errs;
  };

  const handleSaveAdd = async (e) => {
    e.preventDefault();
    const errs = validateAppForm();
    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }

    try {
      setSaving(true);
      await api.createApplication(formApp);
      setIsAddModalOpen(false);
      showToast(`Application for ${formApp.company} saved in MongoDB!`, 'success');
      fetchApplications();
    } catch (err) {
      showToast(err.message || 'Failed to create application', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    const errs = validateAppForm();
    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }

    try {
      setSaving(true);
      await api.updateApplication(activeApp._id, formApp);
      setIsEditModalOpen(false);
      showToast('Application updated in MongoDB!', 'success');
      fetchApplications();
    } catch (err) {
      showToast(err.message || 'Failed to update application', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      setSaving(true);
      await api.deleteApplication(activeApp._id);
      setIsDeleteModalOpen(false);
      showToast('Application record removed from MongoDB', 'success');
      fetchApplications();
    } catch (err) {
      showToast(err.message || 'Failed to delete application', 'error');
    } finally {
      setSaving(false);
    }
  };

  const statusCounts = stats.statusCounts || {};

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Placement Applications Tracker</h2>
          <p className="page-subtitle">
            Manage your company job applications, interview timelines, and offer letters.
          </p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={handleOpenAdd}>
          <Plus size={16} />
          <span>Add Application</span>
        </button>
      </div>

      {/* Summary KPI Cards for Applications */}
      <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="stat-card">
          <div className="stat-icon-wrapper blue">
            <Briefcase size={22} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Total Applied</div>
            <div className="stat-value">{stats.total}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper amber">
            <Clock size={22} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Online Assessments</div>
            <div className="stat-value" style={{ color: 'var(--warning-text)' }}>
              {statusCounts['Online Assessment'] || 0}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper purple">
            <Calendar size={22} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Interviews</div>
            <div className="stat-value" style={{ color: '#7c3aed' }}>
              {statusCounts['Interview'] || 0}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper green">
            <CheckCircle2 size={22} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Offers Received</div>
            <div className="stat-value" style={{ color: 'var(--success-text)' }}>
              {statusCounts['Offer'] || 0}
            </div>
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
              placeholder="Search by company name, job role, or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-actions">
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

            <div>
              <select
                className="form-select"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                {JOB_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t === 'All' ? 'All Job Types' : t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                className="form-select"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="newest">Sort: Newest Applied</option>
                <option value="oldest">Sort: Oldest Applied</option>
                <option value="company">Sort: Company Name (A-Z)</option>
                <option value="deadline">Sort: Upcoming Deadline</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      {loading ? (
        <LoadingSpinner text="Fetching applications from MongoDB..." />
      ) : applications.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No applications found"
          description="Track your placement applications here to never miss an interview deadline."
          actionLabel="Add Your First Application"
          onAction={handleOpenAdd}
        />
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Role & Type</th>
                <th>Package & Location</th>
                <th>Application Date</th>
                <th>Status</th>
                <th>Next Step / Interview</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app._id}>
                  {/* Company */}
                  <td>
                    <div className="table-title-cell">{app.company}</div>
                    {app.jobUrl && (
                      <a
                        href={app.jobUrl}
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
                        <span>Portal Link</span>
                        <ExternalLink size={11} />
                      </a>
                    )}
                  </td>

                  {/* Role & Type */}
                  <td>
                    <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{app.role}</div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {app.type}
                    </span>
                  </td>

                  {/* Package & Location */}
                  <td>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                      {app.salaryPackage || 'Not Disclosed'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {app.location || 'Pan India'}
                    </div>
                  </td>

                  {/* Applied Date */}
                  <td>
                    <div style={{ fontSize: '0.85rem' }}>
                      {app.applicationDate
                        ? new Date(app.applicationDate).toLocaleDateString()
                        : '-'}
                    </div>
                    {app.deadline && (
                      <div style={{ fontSize: '0.72rem', color: 'var(--danger-text)' }}>
                        Deadline: {new Date(app.deadline).toLocaleDateString()}
                      </div>
                    )}
                  </td>

                  {/* Status Badge */}
                  <td>
                    <Badge variant={app.status}>{app.status}</Badge>
                  </td>

                  {/* Next Step / Notes */}
                  <td>
                    {app.interviewDate ? (
                      <div
                        style={{
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          color: '#7c3aed',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                        }}
                      >
                        <Calendar size={13} />
                        <span>{new Date(app.interviewDate).toLocaleDateString()}</span>
                      </div>
                    ) : app.recruiterNotes ? (
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        {app.recruiterNotes}
                      </div>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>-</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                      <button
                        className="btn btn-secondary btn-icon-only"
                        title="Edit Application"
                        onClick={() => handleOpenEdit(app)}
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        className="btn btn-secondary btn-icon-only"
                        title="Delete Application"
                        style={{ color: 'var(--danger)' }}
                        onClick={() => handleOpenDelete(app)}
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

      {/* Add Application Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Placement Application (MongoDB)"
        maxWidth="700px"
      >
        <form onSubmit={handleSaveAdd}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Company Name *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. TCS, Infosys, Google..."
                value={formApp.company}
                onChange={(e) => setFormApp({ ...formApp, company: e.target.value })}
              />
              {formErrors.company && <div className="form-error">{formErrors.company}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Job Role *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Associate Software Engineer"
                value={formApp.role}
                onChange={(e) => setFormApp({ ...formApp, role: e.target.value })}
              />
              {formErrors.role && <div className="form-error">{formErrors.role}</div>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Job Type</label>
              <select
                className="form-select"
                value={formApp.type}
                onChange={(e) => setFormApp({ ...formApp, type: e.target.value })}
              >
                <option value="Full-time">Full-time</option>
                <option value="Internship">Internship</option>
                <option value="Intern + PPO">Intern + PPO</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Application Status</label>
              <select
                className="form-select"
                value={formApp.status}
                onChange={(e) => setFormApp({ ...formApp, status: e.target.value })}
              >
                <option value="Wishlist">Wishlist</option>
                <option value="Applied">Applied</option>
                <option value="Online Assessment">Online Assessment</option>
                <option value="Interview">Interview</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Salary Package / CTC</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. 7.5 LPA, 45,000/mo"
                value={formApp.salaryPackage}
                onChange={(e) => setFormApp({ ...formApp, salaryPackage: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Job Location</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Bangalore, Remote, Hyderabad"
                value={formApp.location}
                onChange={(e) => setFormApp({ ...formApp, location: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Application Date</label>
              <input
                type="date"
                className="form-control"
                value={formApp.applicationDate}
                onChange={(e) => setFormApp({ ...formApp, applicationDate: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Application Deadline</label>
              <input
                type="date"
                className="form-control"
                value={formApp.deadline}
                onChange={(e) => setFormApp({ ...formApp, deadline: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Interview Date (if scheduled)</label>
              <input
                type="date"
                className="form-control"
                value={formApp.interviewDate}
                onChange={(e) => setFormApp({ ...formApp, interviewDate: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Job / Portal URL</label>
              <input
                type="url"
                className="form-control"
                placeholder="https://nextstep.tcs.com..."
                value={formApp.jobUrl}
                onChange={(e) => setFormApp({ ...formApp, jobUrl: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Recruiter / Contact Notes</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. HR name, assessment portal credentials, round details..."
              value={formApp.recruiterNotes}
              onChange={(e) => setFormApp({ ...formApp, recruiterNotes: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Preparation & Additional Notes</label>
            <textarea
              className="form-textarea"
              rows={2}
              placeholder="Topics to revise for this specific company..."
              value={formApp.notes}
              onChange={(e) => setFormApp({ ...formApp, notes: e.target.value })}
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
              <span>{saving ? 'Saving...' : 'Save to MongoDB'}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Application Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`Edit Application: ${activeApp?.company || ''}`}
        maxWidth="700px"
      >
        <form onSubmit={handleSaveEdit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Company Name *</label>
              <input
                type="text"
                className="form-control"
                value={formApp.company}
                onChange={(e) => setFormApp({ ...formApp, company: e.target.value })}
              />
              {formErrors.company && <div className="form-error">{formErrors.company}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Job Role *</label>
              <input
                type="text"
                className="form-control"
                value={formApp.role}
                onChange={(e) => setFormApp({ ...formApp, role: e.target.value })}
              />
              {formErrors.role && <div className="form-error">{formErrors.role}</div>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Job Type</label>
              <select
                className="form-select"
                value={formApp.type}
                onChange={(e) => setFormApp({ ...formApp, type: e.target.value })}
              >
                <option value="Full-time">Full-time</option>
                <option value="Internship">Internship</option>
                <option value="Intern + PPO">Intern + PPO</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={formApp.status}
                onChange={(e) => setFormApp({ ...formApp, status: e.target.value })}
              >
                <option value="Wishlist">Wishlist</option>
                <option value="Applied">Applied</option>
                <option value="Online Assessment">Online Assessment</option>
                <option value="Interview">Interview</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Salary Package / CTC</label>
              <input
                type="text"
                className="form-control"
                value={formApp.salaryPackage}
                onChange={(e) => setFormApp({ ...formApp, salaryPackage: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Interview Date</label>
              <input
                type="date"
                className="form-control"
                value={formApp.interviewDate}
                onChange={(e) => setFormApp({ ...formApp, interviewDate: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Recruiter Notes</label>
            <input
              type="text"
              className="form-control"
              value={formApp.recruiterNotes}
              onChange={(e) => setFormApp({ ...formApp, recruiterNotes: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Additional Preparation Notes</label>
            <textarea
              className="form-textarea"
              rows={2}
              value={formApp.notes}
              onChange={(e) => setFormApp({ ...formApp, notes: e.target.value })}
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
              <span>{saving ? 'Updating...' : 'Update in MongoDB'}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Application"
        maxWidth="480px"
      >
        <div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            Are you sure you want to delete your application for{' '}
            <strong>{activeApp?.company}</strong> ({activeApp?.role}) from MongoDB?
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
              <span>{saving ? 'Deleting...' : 'Confirm Delete'}</span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
