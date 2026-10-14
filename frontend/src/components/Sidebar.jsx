import React from 'react';
import {
  LayoutDashboard,
  UserCheck,
  Code2,
  Building2,
  Briefcase,
  MessageSquareCode,
  BarChart3,
  Settings,
  GraduationCap,
  X,
} from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'profile', label: 'My Profile', icon: UserCheck },
  { id: 'dsa', label: 'DSA Practice', icon: Code2 },
  { id: 'companies', label: 'Company Prep', icon: Building2 },
  { id: 'applications', label: 'Applications', icon: Briefcase },
  { id: 'mock', label: 'Mock Interviews', icon: MessageSquareCode },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({
  activePage,
  setActivePage,
  isOpen,
  setIsOpen,
  student,
}) {
  return (
    <>
      {isOpen && (
        <div
          className="modal-overlay"
          style={{ zIndex: 45 }}
          onClick={() => setIsOpen(false)}
        />
      )}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="brand">
            <div className="brand-icon">
              <GraduationCap size={22} />
            </div>
            <div className="brand-text">
              <h2>PlacementPro</h2>
              <span className="brand-badge">B.Tech Portal</span>
            </div>
          </div>
          {isOpen && (
            <button
              className="modal-close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
            >
              <X size={20} color="#94a3b8" />
            </button>
          )}
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section-title">Navigation</div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => {
                  setActivePage(item.id);
                  setIsOpen(false);
                }}
              >
                <div className="nav-item-icon">
                  <Icon size={19} />
                </div>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div
            className="student-mini-card"
            onClick={() => {
              setActivePage('profile');
              setIsOpen(false);
            }}
            style={{ cursor: 'pointer' }}
          >
            <div className="student-avatar">
              {student?.name ? student.name.charAt(0) : 'R'}
            </div>
            <div className="student-details">
              <div className="name">{student?.name || 'Rahul Sharma'}</div>
              <div className="role">
                {student?.preferredRole || 'CSE Candidate'}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
