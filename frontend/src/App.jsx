import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Toast from './components/Toast';

// Pages
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import DsaPracticePage from './pages/DsaPracticePage';
import CompanyPrepPage from './pages/CompanyPrepPage';
import ApplicationsPage from './pages/ApplicationsPage';
import MockInterviewsPage from './pages/MockInterviewsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';

import api from './services/api';

const PAGE_TITLES = {
  dashboard: 'Placement Dashboard',
  profile: 'Student Profile',
  dsa: 'DSA Practice & Tracking',
  companies: 'Company-Specific Preparation',
  applications: 'Applications Tracker',
  mock: 'Mock Interview Simulator',
  analytics: 'Placement Analytics',
  settings: 'Database & System Settings',
};

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [student, setStudent] = useState(null);
  const [dbStatus, setDbStatus] = useState({ connected: false, name: 'placementpro' });
  const [toasts, setToasts] = useState([]);
  const [openAddAppTrigger, setOpenAddAppTrigger] = useState(false);

  // Toast Notification System
  const showToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Fetch DB Health and Demo Student Profile
  const fetchInitialData = async () => {
    try {
      const healthRes = await api.getHealth();
      setDbStatus(healthRes.database);
    } catch (err) {
      setDbStatus({ connected: false, name: 'placementpro', error: err.message });
      showToast('Cannot connect to PlacementPro backend or MongoDB!', 'error');
    }

    try {
      const studentRes = await api.getStudentProfile('demo');
      setStudent(studentRes.data);
    } catch (err) {
      console.log('Student profile notice:', err.message);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleQuickAction = (action) => {
    if (action === 'add-application') {
      setActivePage('applications');
      setOpenAddAppTrigger(true);
    }
  };

  return (
    <div className="app-layout">
      {/* Navigation Sidebar */}
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        student={student}
      />

      {/* Main Content Area */}
      <div className="main-wrapper">
        <Navbar
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          activePageTitle={PAGE_TITLES[activePage] || 'PlacementPro'}
          dbStatus={dbStatus}
          onQuickAction={handleQuickAction}
          student={student}
        />

        <main className="page-container">
          {activePage === 'dashboard' && (
            <DashboardPage
              setActivePage={setActivePage}
              onOpenAddApp={() => handleQuickAction('add-application')}
            />
          )}

          {activePage === 'profile' && (
            <ProfilePage
              student={student}
              setStudent={setStudent}
              showToast={showToast}
            />
          )}

          {activePage === 'dsa' && (
            <DsaPracticePage showToast={showToast} />
          )}

          {activePage === 'companies' && (
            <CompanyPrepPage showToast={showToast} />
          )}

          {activePage === 'applications' && (
            <ApplicationsPage
              showToast={showToast}
              openAddTrigger={openAddAppTrigger}
              setOpenAddTrigger={setOpenAddAppTrigger}
            />
          )}

          {activePage === 'mock' && (
            <MockInterviewsPage showToast={showToast} />
          )}

          {activePage === 'analytics' && (
            <AnalyticsPage showToast={showToast} />
          )}

          {activePage === 'settings' && (
            <SettingsPage
              dbStatus={dbStatus}
              refreshDbStatus={fetchInitialData}
              showToast={showToast}
            />
          )}
        </main>
      </div>

      {/* Toast Notification Container */}
      <Toast toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
