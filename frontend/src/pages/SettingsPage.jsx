import React, { useState, useEffect } from 'react';
import {
  Settings,
  Database,
  RefreshCw,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Server,
  Layers,
  FileCode,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import api from '../services/api';
import Modal from '../components/Modal';
import Badge from '../components/Badge';
import LoadingSpinner from '../components/LoadingSpinner';

export default function SettingsPage({ dbStatus, refreshDbStatus, showToast }) {
  const [seedStatus, setSeedStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const fetchSeedStatus = async () => {
    try {
      setLoading(true);
      const res = await api.getSeedStatus();
      setSeedStatus(res.data);
    } catch (err) {
      console.error('Failed to get seed status:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeedStatus();
  }, []);

  const handleLoadDemoData = async () => {
    try {
      setActionLoading(true);
      const res = await api.loadSeedData();
      showToast(res.message || 'Demo data loaded successfully into MongoDB!', 'success');
      fetchSeedStatus();
      refreshDbStatus();
    } catch (err) {
      showToast(err.message || 'Failed to load demo data', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleResetDemoData = async () => {
    try {
      setActionLoading(true);
      const res = await api.resetSeedData();
      setIsResetModalOpen(false);
      showToast('Database reset and re-seeded with clean demo dataset!', 'success');
      fetchSeedStatus();
      refreshDbStatus();
    } catch (err) {
      showToast(err.message || 'Failed to reset database', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const counts = seedStatus?.counts || {};

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">System Settings & MongoDB Integration</h2>
          <p className="page-subtitle">
            Inspect real database connectivity, view collection counts, and review MongoDB Compass instructions.
          </p>
        </div>
      </div>

      {/* Grid: 2 columns */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem',
        }}
      >
        {/* Card 1: MongoDB Server & Compass Status */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Database size={18} color="var(--primary)" />
              <span>MongoDB Connection Status</span>
            </h3>
            <Badge variant={dbStatus?.connected ? 'green' : 'red'}>
              {dbStatus?.connected ? 'Live & Connected' : 'Offline'}
            </Badge>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid var(--border-light)' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>State:</span>
              <strong style={{ fontSize: '0.85rem', color: dbStatus?.connected ? 'var(--success-text)' : 'var(--danger-text)' }}>
                {dbStatus?.status || 'Unknown'} (State Code: {dbStatus?.stateCode ?? 1})
              </strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid var(--border-light)' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Active Database:</span>
              <code style={{ fontSize: '0.85rem', color: 'var(--primary)' }}>
                {dbStatus?.name || 'placementpro'}
              </code>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid var(--border-light)' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>MongoDB Host & Port:</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                {dbStatus?.host || '127.0.0.1'}:{dbStatus?.port || 27017}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid var(--border-light)' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Compass Connection String:</span>
              <code style={{ fontSize: '0.8rem', backgroundColor: 'var(--bg-subtle)', padding: '2px 6px', borderRadius: '4px' }}>
                {dbStatus?.compassUrl || 'mongodb://127.0.0.1:27017/placementpro'}
              </code>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={refreshDbStatus}
              >
                <RefreshCw size={14} />
                <span>Ping Database</span>
              </button>
            </div>
          </div>
        </div>

        {/* Card 2: MongoDB Demo Dataset Operations */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Layers size={18} color="var(--primary)" />
              <span>MongoDB Collection Statistics</span>
            </h3>
            <span className="badge badge-blue">Idempotent Seeder</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Students</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{counts.students ?? 0} docs</div>
            </div>
            <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>DSA Questions</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{counts.dsaQuestions ?? 0} docs</div>
            </div>
            <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Applications</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{counts.applications ?? 0} docs</div>
            </div>
            <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Company Guides</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{counts.companies ?? 0} docs</div>
            </div>
          </div>

          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            All operations interact directly with the Mongoose ODM layer and write real documents to MongoDB collections.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              className="btn btn-primary btn-sm"
              onClick={handleLoadDemoData}
              disabled={actionLoading}
            >
              <RefreshCw size={14} />
              <span>{actionLoading ? 'Loading...' : 'Load / Update Demo Data'}</span>
            </button>

            <button
              className="btn btn-secondary btn-sm"
              style={{ color: 'var(--danger)', borderColor: 'var(--border-subtle)' }}
              onClick={() => setIsResetModalOpen(true)}
              disabled={actionLoading}
            >
              <Trash2 size={14} />
              <span>Reset Database</span>
            </button>
          </div>
        </div>
      </div>

      {/* Step-by-Step MongoDB Compass Guide Card */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <BookOpen size={18} color="var(--primary)" />
            <span>How to Connect & Inspect in MongoDB Compass (Viva Demonstration)</span>
          </h3>
          <span className="badge badge-purple">Viva Ready</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', color: '#1e3a8a' }}>
            <strong>Faculty Demonstration Distinction:</strong> Explain that <em>MongoDB Compass</em> is the official GUI (Graphical User Interface) client, while <em>MongoDB Server (mongod)</em> is the underlying database engine. Compass connects over TCP port <code>27017</code>.
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', backgroundColor: '#ffffff' }}>
              <div style={{ fontWeight: 700, color: 'var(--primary)', marginBottom: '0.25rem' }}>
                Step 1: Open MongoDB Compass
              </div>
              <p style={{ fontSize: '0.85rem' }}>
                Launch <strong>MongoDB Compass</strong> from your Windows Start Menu or Desktop shortcut.
              </p>
            </div>

            <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', backgroundColor: '#ffffff' }}>
              <div style={{ fontWeight: 700, color: 'var(--primary)', marginBottom: '0.25rem' }}>
                Step 2: Enter Connection String
              </div>
              <p style={{ fontSize: '0.85rem' }}>
                In the URI input field, enter:
                <br />
                <code style={{ background: 'var(--bg-subtle)', padding: '2px 4px', borderRadius: '4px' }}>
                  mongodb://127.0.0.1:27017/placementpro
                </code>
                <br />
                Then click the green <strong>Connect</strong> button.
              </p>
            </div>

            <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', backgroundColor: '#ffffff' }}>
              <div style={{ fontWeight: 700, color: 'var(--primary)', marginBottom: '0.25rem' }}>
                Step 3: Open `placementpro` DB
              </div>
              <p style={{ fontSize: '0.85rem' }}>
                Click on the <strong>placementpro</strong> database in the left sidebar. You will see all 6 collections:
                <code>students</code>, <code>dsaquestions</code>, <code>applications</code>, <code>companypreparations</code>, <code>mockquestions</code>, <code>studyactivities</code>.
              </p>
            </div>

            <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', backgroundColor: '#ffffff' }}>
              <div style={{ fontWeight: 700, color: 'var(--primary)', marginBottom: '0.25rem' }}>
                Step 4: Live Verification
              </div>
              <p style={{ fontSize: '0.85rem' }}>
                Add or edit an application on this web portal, click the refresh button in Compass, and demonstrate to your faculty that the new BSON document appears in real time!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        title="Reset PlacementPro Database"
        maxWidth="500px"
      >
        <div>
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
            <AlertTriangle size={24} color="var(--danger)" flexShrink={0} />
            <div>
              <strong style={{ fontSize: '0.95rem' }}>Are you sure you want to reset all collections?</strong>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.35rem' }}>
                This will delete any customized questions or applications and reload the clean demo dataset with 22 DSA questions, 6 company guides, and 6 sample applications.
              </p>
            </div>
          </div>

          <div className="modal-footer" style={{ padding: 0, border: 'none', background: 'none' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsResetModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleResetDemoData}
              disabled={actionLoading}
            >
              <Trash2 size={16} />
              <span>{actionLoading ? 'Resetting...' : 'Confirm Reset & Reload'}</span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
