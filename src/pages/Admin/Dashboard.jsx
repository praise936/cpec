// frontend/src/pages/Admin/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Nav/Navbar';
import api from '../../servces/api';
import './Dashboard.css';


const Dashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [recentEvents, setRecentEvents] = useState([]);
    const [recentPrograms, setRecentPrograms] = useState([]);
    const [recentUsers, setRecentUsers] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError('');

            const [statsRes, eventsRes, programsRes, usersRes] = await Promise.all([
                api.get('/admin/dashboard/'),
                api.get('/events/?limit=5'),
                api.get('/programs/?limit=5'),
                api.get('/auth/users/?limit=5')
            ]);

            console.log('Dashboard API Responses:', {
                stats: statsRes.data,
                events: eventsRes.data,
                programs: programsRes.data,
                users: usersRes.data
            });

            setStats(statsRes.data);

            // Handle events response
            let eventsData = [];
            if (Array.isArray(eventsRes.data)) {
                eventsData = eventsRes.data;
            } else if (eventsRes.data?.results && Array.isArray(eventsRes.data.results)) {
                eventsData = eventsRes.data.results;
            } else if (eventsRes.data?.data && Array.isArray(eventsRes.data.data)) {
                eventsData = eventsRes.data.data;
            } else if (eventsRes.data?.events && Array.isArray(eventsRes.data.events)) {
                eventsData = eventsRes.data.events;
            }
            setRecentEvents(eventsData);

            // Handle programs response
            let programsData = [];
            if (Array.isArray(programsRes.data)) {
                programsData = programsRes.data;
            } else if (programsRes.data?.results && Array.isArray(programsRes.data.results)) {
                programsData = programsRes.data.results;
            } else if (programsRes.data?.data && Array.isArray(programsRes.data.data)) {
                programsData = programsRes.data.data;
            } else if (programsRes.data?.programs && Array.isArray(programsRes.data.programs)) {
                programsData = programsRes.data.programs;
            }
            setRecentPrograms(programsData);

            // Handle users response
            let usersData = [];
            if (Array.isArray(usersRes.data)) {
                usersData = usersRes.data;
            } else if (usersRes.data?.results && Array.isArray(usersRes.data.results)) {
                usersData = usersRes.data.results;
            } else if (usersRes.data?.data && Array.isArray(usersRes.data.data)) {
                usersData = usersRes.data.data;
            } else if (usersRes.data?.users && Array.isArray(usersRes.data.users)) {
                usersData = usersRes.data.users;
            }
            setRecentUsers(usersData);

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setError('Failed to load dashboard data. Please try again.');

            // Set fallback data for development
            setRecentEvents([]);
            setRecentPrograms([]);
            setRecentUsers([]);
            setStats({
                total_users: 0,
                total_events: 0,
                total_programs: 0,
                pending_requests: 0,
                new_members_today: 0,
                upcoming_events: 0,
                active_programs: 0
            });
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            });
        } catch (e) {
            return 'Invalid Date';
        }
    };

    const StatCard = ({ title, value, icon, color, trend }) => {
        return (
            <div className="stat-card" style={{ '--stat-color': color }}>
                <div className="stat-icon">{icon}</div>
                <div className="stat-content">
                    <div className="stat-value">{value}</div>
                    <div className="stat-title">{title}</div>
                    {trend && (
                        <div className={`stat-trend ${trend > 0 ? 'up' : 'down'}`}>
                            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const QuickAction = ({ title, description, icon, color, action }) => {
        return (
            <div className="quick-action-card" onClick={action}>
                <div className="action-icon" style={{ backgroundColor: `${color}20`, color: color }}>
                    {icon}
                </div>
                <div className="action-content">
                    <h4>{title}</h4>
                    <p>{description}</p>
                </div>
                <div className="action-arrow">→</div>
            </div>
        );
    };

    const quickActions = [
        {
            title: 'Create Event',
            description: 'Schedule a new industry event',
            icon: '🎪',
            color: '#00b4d8',
            action: () => navigate('/admin/events/create')
        },
        {
            title: 'Create Program',
            description: 'Design a new training program',
            icon: '📚',
            color: '#0077b6',
            action: () => navigate('/admin/programs/create')
        },
        {
            title: 'Manage Users',
            description: 'View and manage user accounts',
            icon: '👥',
            color: '#90e0ef',
            action: () => navigate('/admin/users')
        },
        {
            title: 'View Analytics',
            description: 'Detailed platform analytics',
            icon: '📊',
            color: '#43e97b',
            action: () => navigate('/admin/analytics')
        }
    ];

    if (loading) {
        return (
            <div className="dashboard-container">
                <Navbar />
                <div className="loading-content">
                    <div className="loading-spinner"></div>
                    <p>Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <Navbar />

            <div className="dashboard-content">
                {/* Header */}
                <div className="dashboard-header">
                    <h1 className="dashboard-title">Admin Dashboard</h1>
                    <p className="dashboard-subtitle">
                        Overview of CPEC platform activities and statistics
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="error-message">
                        <span className="error-icon">⚠️</span>
                        {error}
                    </div>
                )}

                {/* Stats Grid */}
                <div className="stats-grid">
                    {stats ? (
                        <>
                            <StatCard
                                title="Total Users"
                                value={stats.total_users || 0}
                                icon="👥"
                                color="#00b4d8"
                                trend={12}
                            />
                            <StatCard
                                title="Total Events"
                                value={stats.total_events || 0}
                                icon="🎪"
                                color="#0077b6"
                                trend={8}
                            />
                            <StatCard
                                title="Total Programs"
                                value={stats.total_programs || 0}
                                icon="📚"
                                color="#90e0ef"
                                trend={15}
                            />
                            <StatCard
                                title="Pending Requests"
                                value={stats.pending_requests || 0}
                                icon="⏳"
                                color="#ffd166"
                            />
                            <StatCard
                                title="New Members Today"
                                value={stats.new_members_today || 0}
                                icon="🚀"
                                color="#06d6a0"
                                trend={5}
                            />
                            <StatCard
                                title="Upcoming Events"
                                value={stats.upcoming_events || 0}
                                icon="📅"
                                color="#ef476f"
                            />
                        </>
                    ) : (
                        <div className="no-stats">
                            <p>No statistics available</p>
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="quick-actions-section">
                    <h2 className="section-title">Quick Actions</h2>
                    <div className="quick-actions-grid">
                        {quickActions.map((action, index) => (
                            <QuickAction key={index} {...action} />
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="recent-activity">
                    <div className="activity-column">
                        <h3 className="column-title">
                            <span className="title-icon">🎪</span>
                            Recent Events
                        </h3>
                        <div className="activity-list">
                            {Array.isArray(recentEvents) && recentEvents.length > 0 ? (
                                recentEvents.map(event => (
                                    <div key={event.id} className="activity-item">
                                        <div className="activity-icon">📅</div>
                                        <div className="activity-content">
                                            <div className="activity-title">{event.title || 'Untitled Event'}</div>
                                            <div className="activity-meta">
                                                {formatDate(event.date)} • {event.category || 'Event'}
                                            </div>
                                        </div>
                                        <div className="activity-badge">
                                            {event.current_attendees || 0} attending
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="empty-state">No recent events</div>
                            )}
                        </div>
                        <button
                            className="view-all-btn"
                            onClick={() => navigate('/events')}
                        >
                            View All Events →
                        </button>
                    </div>

                    <div className="activity-column">
                        <h3 className="column-title">
                            <span className="title-icon">📚</span>
                            Recent Programs
                        </h3>
                        <div className="activity-list">
                            {Array.isArray(recentPrograms) && recentPrograms.length > 0 ? (
                                recentPrograms.map(program => (
                                    <div key={program.id} className="activity-item">
                                        <div className="activity-icon">🎓</div>
                                        <div className="activity-content">
                                            <div className="activity-title">{program.title || 'Untitled Program'}</div>
                                            <div className="activity-meta">
                                                {program.category || 'Program'} • {program.level || 'Level'}
                                            </div>
                                        </div>
                                        <div className="activity-badge">
                                            {program.current_enrollment || 0} enrolled
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="empty-state">No recent programs</div>
                            )}
                        </div>
                        <button
                            className="view-all-btn"
                            onClick={() => navigate('/programs')}
                        >
                            View All Programs →
                        </button>
                    </div>

                    <div className="activity-column">
                        <h3 className="column-title">
                            <span className="title-icon">👥</span>
                            Recent Users
                        </h3>
                        <div className="activity-list">
                            {Array.isArray(recentUsers) && recentUsers.length > 0 ? (
                                recentUsers.map(user => (
                                    <div key={user.id} className="activity-item">
                                        <div className="activity-icon">
                                            {user.profile_picture ? (
                                                <img src={user.profile_picture} alt={user.username} />
                                            ) : (
                                                <div className="avatar-placeholder">
                                                    {user.username?.charAt(0).toUpperCase() || 'U'}
                                                </div>
                                            )}
                                        </div>
                                        <div className="activity-content">
                                            <div className="activity-title">{user.username || 'User'}</div>
                                            <div className="activity-meta">
                                                Joined {formatDate(user.date_joined)}
                                            </div>
                                        </div>
                                        <div className={`activity-badge ${user.role === 'admin' ? 'admin' : 'member'}`}>
                                            {user.role || 'member'}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="empty-state">No recent users</div>
                            )}
                        </div>
                        <button
                            className="view-all-btn"
                            onClick={() => navigate('/admin/users')}
                        >
                            View All Users →
                        </button>
                    </div>
                </div>

                {/* Platform Health */}
                <div className="platform-health">
                    <h2 className="section-title">Platform Health</h2>
                    <div className="health-metrics">
                        <div className="health-metric">
                            <div className="metric-label">Server Uptime</div>
                            <div className="metric-value">99.9%</div>
                            <div className="metric-bar">
                                <div className="metric-fill" style={{ width: '99.9%' }}></div>
                            </div>
                        </div>
                        <div className="health-metric">
                            <div className="metric-label">API Response Time</div>
                            <div className="metric-value">120ms</div>
                            <div className="metric-bar">
                                <div className="metric-fill good" style={{ width: '95%' }}></div>
                            </div>
                        </div>
                        <div className="health-metric">
                            <div className="metric-label">Active Sessions</div>
                            <div className="metric-value">248</div>
                            <div className="metric-bar">
                                <div className="metric-fill" style={{ width: '70%' }}></div>
                            </div>
                        </div>
                        <div className="health-metric">
                            <div className="metric-label">Database Size</div>
                            <div className="metric-value">2.4 GB</div>
                            <div className="metric-bar">
                                <div className="metric-fill warning" style={{ width: '60%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;