import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  PieChart as PieIcon,
  Award,
  Clock,
  Code2,
  Building2,
  Briefcase,
  CheckCircle2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from 'recharts';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Badge from '../components/Badge';

export default function AnalyticsPage({ showToast }) {
  const [loading, setLoading] = useState(true);
  const [prepData, setPrepData] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [prepRes, dashRes] = await Promise.all([
        api.getPreparationAnalytics(),
        api.getDashboardAnalytics(),
      ]);
      setPrepData(prepRes.data);
      setDashboardData(dashRes.data);
    } catch (err) {
      showToast(err.message || 'Failed to load MongoDB analytics', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Running MongoDB aggregation pipelines for placement analytics..." />;
  }

  const difficultyBreakdown = prepData?.difficultyBreakdown || [];
  const companyProgress = prepData?.companyProgress || [];
  const mockTrends = prepData?.mockTrends || [];
  const activityDistribution = prepData?.activityDistribution || [];

  const kpi = dashboardData?.kpi || {
    totalDsa: 0,
    solvedDsa: 0,
    totalApplications: 0,
    interviewsScheduled: 0,
    overallProgress: 0,
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Placement Preparation Analytics & Aggregation</h2>
          <p className="page-subtitle">
            MongoDB aggregation pipeline insights across DSA solved rates, target company readiness, and mock trends.
          </p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={fetchAnalytics}>
          <span>Refresh Analytics</span>
        </button>
      </div>

      {/* Top Aggregation KPI Summary */}
      <div className="stats-grid" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <div className="stat-icon-wrapper blue">
            <Code2 size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">DSA Solve Rate</div>
            <div className="stat-value">
              {kpi.totalDsa > 0 ? `${Math.round((kpi.solvedDsa / kpi.totalDsa) * 100)}%` : '0%'}
            </div>
            <div className="stat-subtext">
              {kpi.solvedDsa} of {kpi.totalDsa} solved
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper purple">
            <Building2 size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Companies Tracked</div>
            <div className="stat-value">{companyProgress.length}</div>
            <div className="stat-subtext">Recruiter guides active</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper amber">
            <Award size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Mock Assessments</div>
            <div className="stat-value">{mockTrends.length}</div>
            <div className="stat-subtext">Completed test sessions</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper green">
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Overall Readiness</div>
            <div className="stat-value">{kpi.overallProgress}%</div>
            <div className="stat-subtext">Composite placement index</div>
          </div>
        </div>
      </div>

      {/* Row 1: DSA Difficulty Breakdown & Company Preparation Progress */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem',
        }}
      >
        {/* Difficulty Breakdown */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">DSA Solved by Difficulty Level</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>MongoDB Aggregation</span>
          </div>
          <div style={{ height: 260, width: '100%' }}>
            {difficultyBreakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={difficultyBreakdown} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                  <XAxis dataKey="difficulty" stroke="#94a3b8" fontSize={12} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                    }}
                    formatter={(val, name) => [val, name === 'solved' ? 'Solved' : 'Total in Pool']}
                  />
                  <Bar dataKey="solved" fill="#3b82f6" name="Solved" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="total" fill="#e2e8f0" name="Total in Pool" radius={[4, 4, 0, 0]} />
                  <Legend verticalAlign="top" align="right" height={36} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState title="No difficulty data" description="Add or seed DSA questions to view difficulty breakdown." />
            )}
          </div>
        </div>

        {/* Target Company Preparation Progress */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Company Preparation Readiness (%)</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Checklist Completion</span>
          </div>
          <div style={{ height: 260, width: '100%' }}>
            {companyProgress.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={companyProgress} layout="vertical" margin={{ top: 10, right: 30, left: 40, bottom: 10 }}>
                  <XAxis type="number" domain={[0, 100]} stroke="#94a3b8" fontSize={12} unit="%" />
                  <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                    }}
                    formatter={(val) => [`${val}%`, 'Preparation Completed']}
                  />
                  <Bar dataKey="progress" fill="#2563eb" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState title="No company data" description="Load company guides to see readiness comparison." />
            )}
          </div>
        </div>
      </div>

      {/* Row 2: Mock Interview Score Progression & Study Activity Distribution */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {/* Mock Interview Score Trends */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Mock Interview Score Progression</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Attempt History</span>
          </div>
          <div style={{ height: 260, width: '100%' }}>
            {mockTrends.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockTrends} margin={{ top: 10, right: 20, left: 0, bottom: 25 }}>
                  <XAxis
                    dataKey="attempt"
                    stroke="#94a3b8"
                    fontSize={11}
                    angle={-15}
                    textAnchor="end"
                    tickLine={false}
                  />
                  <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={12} unit="%" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                    }}
                    formatter={(val) => [`${val}%`, 'Score']}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ fill: '#10b981', r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState
                title="No interview trend data"
                description="Complete mock interview tests to see your performance progression curve."
              />
            )}
          </div>
        </div>

        {/* Study Activity Distribution */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Study Activity Breakdown by Category</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Hours Logged</span>
          </div>
          <div style={{ height: 260, width: '100%' }}>
            {activityDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityDistribution} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                  <XAxis dataKey="type" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} unit="h" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                    }}
                    formatter={(val) => [`${val} hrs`, 'Total Time Invested']}
                  />
                  <Bar dataKey="hours" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState
                title="No study activity logs"
                description="Activity logs appear automatically as you solve DSA and mark company topics."
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
