import React, { useState } from 'react';
import {
  User,
  Mail,
  GraduationCap,
  Award,
  BookOpen,
  Briefcase,
  Building,
  FileText,
  Github,
  Linkedin,
  Edit3,
  CheckCircle,
  AlertCircle,
  Plus,
  X,
  Save,
} from 'lucide-react';
import api from '../services/api';
import Modal from '../components/Modal';

export default function ProfilePage({ student, setStudent, showToast }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: student?.name || '',
    email: student?.email || '',
    college: student?.college || '',
    degreeBranch: student?.degreeBranch || '',
    graduationYear: student?.graduationYear || 2025,
    cgpa: student?.cgpa || 8.5,
    skills: student?.skills || [],
    preferredRole: student?.preferredRole || '',
    preferredCompanies: student?.preferredCompanies || [],
    resumeUrl: student?.resumeUrl || '',
    githubUrl: student?.githubUrl || '',
    linkedinUrl: student?.linkedinUrl || '',
    bio: student?.bio || '',
  });

  const [newSkill, setNewSkill] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const completionPercentage = student?.completionPercentage || 85;

  const handleOpenEdit = () => {
    setFormData({
      name: student?.name || '',
      email: student?.email || '',
      college: student?.college || '',
      degreeBranch: student?.degreeBranch || '',
      graduationYear: student?.graduationYear || 2025,
      cgpa: student?.cgpa || 8.5,
      skills: [...(student?.skills || [])],
      preferredRole: student?.preferredRole || '',
      preferredCompanies: [...(student?.preferredCompanies || [])],
      resumeUrl: student?.resumeUrl || '',
      githubUrl: student?.githubUrl || '',
      linkedinUrl: student?.linkedinUrl || '',
      bio: student?.bio || '',
    });
    setErrors({});
    setIsEditing(true);
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errs.email = 'Invalid email format';
    }
    if (!formData.college.trim()) errs.college = 'College/University name is required';
    if (!formData.degreeBranch.trim()) errs.degreeBranch = 'Degree & Branch is required';
    if (!formData.graduationYear || formData.graduationYear < 2020 || formData.graduationYear > 2035) {
      errs.graduationYear = 'Graduation year must be between 2020 and 2035';
    }
    if (formData.cgpa === '' || formData.cgpa < 0 || formData.cgpa > 10) {
      errs.cgpa = 'CGPA must be between 0.0 and 10.0';
    }
    return errs;
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({ ...formData, skills: [...formData.skills, newSkill.trim()] });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s !== skillToRemove),
    });
  };

  const handleAddCompany = (e) => {
    e.preventDefault();
    if (newCompany.trim() && !formData.preferredCompanies.includes(newCompany.trim())) {
      setFormData({
        ...formData,
        preferredCompanies: [...formData.preferredCompanies, newCompany.trim()],
      });
      setNewCompany('');
    }
  };

  const handleRemoveCompany = (companyToRemove) => {
    setFormData({
      ...formData,
      preferredCompanies: formData.preferredCompanies.filter((c) => c !== companyToRemove),
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setSaving(true);
      const studentId = student?._id || 'demo';
      const res = await api.updateStudentProfile(studentId, formData);
      setStudent(res.data);
      setIsEditing(false);
      showToast('Student profile successfully updated in MongoDB!', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to update student profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Student Profile & Technical Resume</h2>
          <p className="page-subtitle">
            Manage your academic credentials, technical skills, target companies, and resume links.
          </p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={handleOpenEdit}>
          <Edit3 size={16} />
          <span>Edit Profile</span>
        </button>
      </div>

      {/* Demo Student Notice */}
      <div
        style={{
          padding: '1rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          backgroundColor: '#eff6ff',
          border: '1px solid #bfdbfe',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              backgroundColor: '#2563eb',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CheckCircle size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#1e3a8a' }}>
              Academic Demonstration Profile Connected
            </div>
            <div style={{ fontSize: '0.82rem', color: '#1d4ed8' }}>
              This profile data is actively retrieved from and stored in your MongoDB database (<code>students</code> collection).
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'right', minWidth: '160px' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1e3a8a', marginBottom: '4px' }}>
            Profile Completeness: {completionPercentage}%
          </div>
          <div className="progress-container">
            <div
              className="progress-bar"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Profile Main Card */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {/* Left Card: Academic & Contact */}
        <div className="card">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.25rem',
              marginBottom: '1.5rem',
              paddingBottom: '1.5rem',
              borderBottom: '1px solid var(--border-light)',
            }}
          >
            <div
              className="student-avatar"
              style={{ width: '64px', height: '64px', fontSize: '1.6rem' }}
            >
              {student?.name?.charAt(0) || 'R'}
            </div>
            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>{student?.name || 'Rahul Sharma'}</h3>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '2px' }}>
                {student?.preferredRole || 'Full Stack Software Engineer'}
              </div>
              <span className="badge badge-blue" style={{ marginTop: '6px' }}>
                Class of {student?.graduationYear || 2025}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Mail size={18} color="var(--primary)" />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Email</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{student?.email}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <GraduationCap size={18} color="var(--primary)" />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>College / University</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{student?.college}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <BookOpen size={18} color="var(--primary)" />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Degree & Branch</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{student?.degreeBranch}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Award size={18} color="var(--primary)" />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>CGPA</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--success-text)' }}>
                  {student?.cgpa} / 10.0
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <FileText size={18} color="var(--primary)" />
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Resume Link</div>
                <a
                  href={student?.resumeUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    textDecoration: 'underline',
                    wordBreak: 'break-all',
                  }}
                >
                  {student?.resumeUrl || 'Not provided'}
                </a>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              {student?.githubUrl && (
                <a
                  href={student.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary btn-sm"
                >
                  <Github size={15} />
                  <span>GitHub Profile</span>
                </a>
              )}
              {student?.linkedinUrl && (
                <a
                  href={student.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary btn-sm"
                >
                  <Linkedin size={15} />
                  <span>LinkedIn</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Right Card: Skills & Target Companies */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Technical Skills */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Technical Skills & Badges</h3>
              <span className="badge badge-purple">{student?.skills?.length || 0} Skills</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {student?.skills && student.skills.length > 0 ? (
                student.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    style={{
                      padding: '0.4rem 0.8rem',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'var(--bg-subtle)',
                      border: '1px solid var(--border-light)',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                    }}
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                  No skills added yet. Click Edit Profile to add technical skills.
                </span>
              )}
            </div>
          </div>

          {/* Target Companies */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Target & Preferred Companies</h3>
              <span className="badge badge-blue">
                {student?.preferredCompanies?.length || 0} Companies
              </span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {student?.preferredCompanies && student.preferredCompanies.length > 0 ? (
                student.preferredCompanies.map((comp, idx) => (
                  <span
                    key={idx}
                    style={{
                      padding: '0.4rem 0.85rem',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: '#eff6ff',
                      border: '1px solid #bfdbfe',
                      color: '#1d4ed8',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                    }}
                  >
                    🏢 {comp}
                  </span>
                ))
              ) : (
                <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                  No target companies listed.
                </span>
              )}
            </div>
          </div>

          {/* Professional Bio */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Professional Bio & Statement</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              {student?.bio || 'No personal bio added yet.'}
            </p>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        title="Edit Student Profile (MongoDB)"
        maxWidth="750px"
      >
        <form onSubmit={handleSave}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                className="form-control"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              {errors.name && <div className="form-error">{errors.name}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                className="form-control"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              {errors.email && <div className="form-error">{errors.email}</div>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">College / University *</label>
              <input
                type="text"
                className="form-control"
                value={formData.college}
                onChange={(e) => setFormData({ ...formData, college: e.target.value })}
              />
              {errors.college && <div className="form-error">{errors.college}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Degree & Branch *</label>
              <input
                type="text"
                className="form-control"
                value={formData.degreeBranch}
                onChange={(e) => setFormData({ ...formData, degreeBranch: e.target.value })}
              />
              {errors.degreeBranch && <div className="form-error">{errors.degreeBranch}</div>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Graduation Year *</label>
              <input
                type="number"
                className="form-control"
                value={formData.graduationYear}
                onChange={(e) => setFormData({ ...formData, graduationYear: Number(e.target.value) })}
              />
              {errors.graduationYear && <div className="form-error">{errors.graduationYear}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">CGPA (out of 10) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                className="form-control"
                value={formData.cgpa}
                onChange={(e) => setFormData({ ...formData, cgpa: Number(e.target.value) })}
              />
              {errors.cgpa && <div className="form-error">{errors.cgpa}</div>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Preferred Job Role</label>
              <input
                type="text"
                className="form-control"
                value={formData.preferredRole}
                onChange={(e) => setFormData({ ...formData, preferredRole: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Resume URL</label>
              <input
                type="url"
                className="form-control"
                value={formData.resumeUrl}
                onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
              />
            </div>
          </div>

          {/* Skills Management */}
          <div className="form-group">
            <label className="form-label">Technical Skills</label>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <input
                type="text"
                placeholder="Add skill (e.g. React, C++, SQL)..."
                className="form-control"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill(e);
                  }
                }}
              />
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleAddSkill}
              >
                <Plus size={16} />
                <span>Add</span>
              </button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {formData.skills.map((skill, index) => (
                <span
                  key={index}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.3rem 0.65rem',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--bg-subtle)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                  }}
                >
                  {skill}
                  <X
                    size={13}
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleRemoveSkill(skill)}
                  />
                </span>
              ))}
            </div>
          </div>

          {/* Preferred Companies Management */}
          <div className="form-group">
            <label className="form-label">Preferred Companies</label>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <input
                type="text"
                placeholder="Add target company (e.g. Google, TCS, Infosys)..."
                className="form-control"
                value={newCompany}
                onChange={(e) => setNewCompany(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCompany(e);
                  }
                }}
              />
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleAddCompany}
              >
                <Plus size={16} />
                <span>Add</span>
              </button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {formData.preferredCompanies.map((c, index) => (
                <span
                  key={index}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.3rem 0.65rem',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: '#eff6ff',
                    color: '#1d4ed8',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                  }}
                >
                  {c}
                  <X
                    size={13}
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleRemoveCompany(c)}
                  />
                </span>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Professional Bio</label>
            <textarea
              className="form-textarea"
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            />
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsEditing(false)}
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
    </div>
  );
}
