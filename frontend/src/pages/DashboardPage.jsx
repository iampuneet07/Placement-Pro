import React, { useEffect, useState } from 'react';
import {
  Code2,
  CheckCircle2,
  Briefcase,
  Calendar,
  TrendingUp,
  ArrowRight,
  ExternalLink,
  PlusCircle,
  Clock,
  Sparkles,
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
} from 'recharts';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Badge from '../components/Badge';
import EmptyState from '../components/EmptyState';

export default function DashboardPage({ setActivePage, onOpenAddApp }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getDashboardAnalytics();
      setData(res.data);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Fetching live placement analytics from MongoDB..." />;
  }

  if (error) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
        <p style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</p>
        <button className="btn btn-secondary" onClick={fetchDashboardData}>
          Retry Connecting
        </button>
      </div>
    );
  }

  const kpi = data?.kpi || {
    totalDsa: 0,
    solvedDsa: 0,
    totalApplications: 0,
    interviewsScheduled: 0,
    overallProgress: 0,
  };

  const weeklyActivity = data?.weeklyActivity || [];
  const dsaTopicProgress = data?.dsaTopicProgress || [];
  const statusDistribution = (data?.applicationStatusDistribution || []).filter(
    (item) => item.value > 0
  );
  const upcomingInterviews = data?.upcomingInterviews || [];
  const recentApplications = data?.recentApplications || [];

  return (
    <div>
      {/* Top Header */}
      <div className="page-header">
        <div>
          <h2 className="page-title">Placement Readiness Dashboard</h2>
          <p className="page-subtitle">
            Real-time preparation metrics, application funnel, and upcoming interview schedule.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => setActivePage('dsa')}>
            <Code2 size={16} />
            <span>Practice DSA</span>
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => setActivePage('mock')}>
            <Sparkles size={16} />
            <span>Start Mock Interview</span>
          </button>
          <button className="btn btn-primary btn-sm" onClick={onOpenAddApp}>
            <PlusCircle size={16} />
            <span>Add Application</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper blue">
            <Code2 size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">DSA Questions</div>
            <div className="stat-value">{kpi.totalDsa}</div>
            <div className="stat-subtext">In curated question bank</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper green">
            <CheckCircle2 size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Problems Solved</div>
            <div className="stat-value">{kpi.solvedDsa}</div>
            <div className="stat-subtext">
              {kpi.totalDsa > 0
                ? `${Math.round((kpi.solvedDsa / kpi.totalDsa) * 100)}% completed`
                : '0% completed'}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper purple">
            <Briefcase size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Applications</div>
            <div className="stat-value">{kpi.totalApplications}</div>
            <div className="stat-subtext">Submitted to companies</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper amber">
            <Calendar size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Interviews Scheduled</div>
            <div className="stat-value">{kpi.interviewsScheduled}</div>
            <div className="stat-subtext">Active interview rounds</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper emerald">
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Overall Readiness</div>
            <div className="stat-value">{kpi.overallProgress}%</div>
            <div className="stat-subtext">Weighted readiness score</div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem',
        }}
      >
        {/* Weekly Study Activity */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Weekly Preparation Activity (Hours)</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Last 7 Days</span>
          </div>
          <div style={{ height: 260, width: '100%' }}>
            {weeklyActivity.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyActivity}>
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} unit="h" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                    }}
                    formatter={(val) => [`${val} hours`, 'Study Time']}
                  />
                  <Bar dataKey="hours" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState title="No activity recorded" description="Start practicing DSA or mock interviews to log hours." />
            )}
          </div>
        </div>

        {/* Application Status Distribution */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Application Status Distribution</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {kpi.totalApplications} Total
            </span>
          </div>
          <div style={{ height: 260, width: '100%' }}>
            {statusDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || '#3b82f6'} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                    }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState
                title="No applications yet"
                description="Add your first company placement application to see status distribution."
                actionLabel="Add Application"
                onAction={onOpenAddApp}
              />
            )}
          </div>
        </div>
      </div>

      {/* DSA Topic-wise Progress Chart */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-header">
          <h3 className="card-title">DSA Topic-wise Problem Progress</h3>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setActivePage('dsa')}
          >
            <span>View All Problems</span>
            <ArrowRight size={14} />
          </button>
        </div>
        <div style={{ height: 280, width: '100%' }}>
          {dsaTopicProgress.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dsaTopicProgress} margin={{ top: 10, right: 20, left: 0, bottom: 25 }}>
                <XAxis
                  dataKey="topic"
                  stroke="#94a3b8"
                  fontSize={11}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                  tickLine={false}
                />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                  }}
                  formatter={(val, name) => [val, name === 'solved' ? 'Solved' : 'Total']}
                />
                <Bar dataKey="solved" fill="#10b981" name="Solved" radius={[4, 4, 0, 0]} />
                <Bar dataKey="total" fill="#e2e8f0" name="Total Questions" radius={[4, 4, 0, 0]} />
                <Legend verticalAlign="top" align="right" height={36} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState title="No topic stats available" description="Seed or add DSA questions to track topic progress." />
          )}
        </div>
      </div>

      {/* Two Column Section: Upcoming Interviews & Recent Applications */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {/* Upcoming Interviews */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Calendar size={18} color="var(--primary)" />
              <span>Upcoming Interviews & Assessments</span>
            </h3>
            <span className="badge badge-blue">{upcomingInterviews.length} Scheduled</span>
          </div>
          <div>
            {upcomingInterviews.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {upcomingInterviews.map((app) => (
                  <div
                    key={app._id}
                    style={{
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-light)',
                      backgroundColor: 'var(--bg-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{app.company}</div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                        {app.role}
                      </div>
                      <div
                        style={{
                          fontSize: '0.78rem',
                          color: 'var(--text-muted)',
                          marginTop: '0.25rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                        }}
                      >
                        <Clock size={12} />
                        <span>
                          {app.interviewDate
                            ? new Date(app.interviewDate).toLocaleDateString(undefined, {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                              })
                            : 'Date to be confirmed'}
                        </span>
                      </div>
                    </div>
                    <Badge variant={app.status === 'Interview' ? 'purple' : 'amber'}>
                      {app.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No upcoming interviews"
                description="Keep applying! When an application reaches the Interview stage, it appears here."
              />
            )}
          </div>
        </div>

        {/* Recently Updated Applications */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Briefcase size={18} color="var(--primary)" />
              <span>Recently Tracked Applications</span>
            </h3>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setActivePage('applications')}
            >
              <span>View All</span>
              <ArrowRight size={14} />
            </button>
          </div>
          <div>
            {recentApplications.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {recentApplications.map((app) => (
                  <div
                    key={app._id}
                    style={{
                      padding: '0.9rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-light)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>{app.company}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {app.role} • {app.salaryPackage || 'Package N/A'}
                      </div>
                    </div>
                    <Badge variant={app.status}>{app.status}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No applications tracked yet"
                description="Click 'Add Application' to start tracking your placement applications."
                actionLabel="Add Application"
                onAction={onOpenAddApp}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
