import React from 'react';
import { Menu, Database, PlusCircle, CheckCircle, AlertCircle } from 'lucide-react';

export default function Navbar({
  toggleSidebar,
  activePageTitle,
  dbStatus,
  onQuickAction,
  student,
}) {
  const isDbConnected = dbStatus?.connected;

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button
          className="menu-toggle-btn"
          onClick={toggleSidebar}
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} />
        </button>
        <h1 className="navbar-title">{activePageTitle}</h1>
      </div>

      <div className="navbar-right">
        {/* MongoDB Compass Connection Status Pill */}
        <div
          className={`db-status-pill ${
            isDbConnected ? '' : dbStatus?.mode === 'demo' ? 'demo' : 'disconnected'
          }`}
          title={
            isDbConnected
              ? `Connected to MongoDB database: ${dbStatus?.name} (${dbStatus?.host}:${dbStatus?.port})`
              : dbStatus?.mode === 'demo'
              ? 'Running in Demo & Offline Mode with local browser storage. Connect backend anytime for live MongoDB persistence.'
              : 'MongoDB is disconnected! Ensure local MongoDB service or Atlas is active.'
          }
        >
          <span className="status-dot"></span>
          <Database size={14} />
          <span>
            {isDbConnected
              ? 'MongoDB Connected'
              : dbStatus?.mode === 'demo'
              ? 'Demo Mode (Offline Active)'
              : 'MongoDB Offline'}
          </span>
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => onQuickAction('add-application')}
          >
            <PlusCircle size={15} />
            <span>Add Application</span>
          </button>
        </div>

        {/* Student Avatar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            paddingLeft: '0.5rem',
            borderLeft: '1px solid var(--border-light)',
          }}
        >
          <div
            className="student-avatar"
            style={{ width: '34px', height: '34px', fontSize: '0.8rem' }}
          >
            {student?.name ? student.name.charAt(0) : 'R'}
          </div>
          <span
            style={{
              fontSize: '0.85rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
            }}
          >
            {student?.name?.split(' ')[0] || 'Rahul'}
          </span>
        </div>
      </div>
    </header>
  );
}
