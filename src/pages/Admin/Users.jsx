// frontend/src/pages/Admin/Users.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Nav/Navbar';
import api from '../../servces/api';
import './users.css';

const Users = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [verificationFilter, setVerificationFilter] = useState('all');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await api.get('/auth/users/');
            setUsers(response.data?.results || response.data || []);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyUser = async (userId) => {
        try {
            await api.post(`/auth/users/${userId}/verify/`);

            setUsers(prevUsers =>
                prevUsers.map(user =>
                    user.id === userId
                        ? { ...user, is_verified: !user.is_verified }
                        : user
                )
            );

            alert('User verification status updated');
        } catch (error) {
            console.error('Error verifying user:', error);
            alert('Error updating verification status');
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await api.put(`/auth/users/${userId}/`, {
                role: newRole
            });

            setUsers(prevUsers =>
                prevUsers.map(user =>
                    user.id === userId
                        ? { ...user, role: newRole }
                        : user
                )
            );

            alert(`User role updated to ${newRole}`);
        } catch (error) {
            console.error('Error updating role:', error);
            alert('Error updating user role');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            return;
        }

        try {
            await api.delete(`/auth/users/${userId}/`);
            setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
            alert('User deleted successfully');
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Error deleting user');
        }
    };

    const filteredUsers = users.filter(user => {
        if (searchTerm &&
            !user.username.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !user.email?.toLowerCase().includes(searchTerm.toLowerCase())) {
            return false;
        }

        if (roleFilter !== 'all' && user.role !== roleFilter) {
            return false;
        }

        if (verificationFilter === 'verified' && !user.is_verified) {
            return false;
        }
        if (verificationFilter === 'unverified' && user.is_verified) {
            return false;
        }

        return true;
    });

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const UserCard = ({ user }) => {
        return (
            <div className="user-card">
                <div className="user-header">
                    <div className="user-avatar">
                        {user.profile_picture ? (
                            <img src={user.profile_picture} alt={user.username} />
                        ) : (
                            <div className="avatar-placeholder">
                                {user.username?.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                    <div className="user-info">
                        <h3 className="user-name">{user.username}</h3>
                        <p className="user-email">{user.email || 'No email provided'}</p>
                    </div>
                    <div className="user-badges">
                        <span className={`role-badge ${user.role}`}>
                            {user.role}
                        </span>
                        {user.is_verified && (
                            <span className="verified-badge">✓ Verified</span>
                        )}
                        {user.is_staff && (
                            <span className="staff-badge">👑 Staff</span>
                        )}
                    </div>
                </div>

                <div className="user-details">
                    <div className="detail">
                        <span className="detail-label">Joined:</span>
                        <span className="detail-value">{formatDate(user.date_joined)}</span>
                    </div>
                    <div className="detail">
                        <span className="detail-label">Last Active:</span>
                        <span className="detail-value">{formatDate(user.last_active)}</span>
                    </div>
                    {user.title && (
                        <div className="detail">
                            <span className="detail-label">Title:</span>
                            <span className="detail-value">{user.title}</span>
                        </div>
                    )}
                    {user.company && (
                        <div className="detail">
                            <span className="detail-label">Company:</span>
                            <span className="detail-value">{user.company}</span>
                        </div>
                    )}
                </div>

                <div className="user-actions">
                    <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="role-select"
                    >
                        <option value="member">Member</option>
                        <option value="admin">Admin</option>
                    </select>

                    <button
                        className={`verify-btn ${user.is_verified ? 'verified' : ''}`}
                        onClick={() => handleVerifyUser(user.id)}
                    >
                        {user.is_verified ? 'Unverify' : 'Verify'}
                    </button>

                    <button
                        className="delete-btn"
                        onClick={() => handleDeleteUser(user.id)}
                    >
                        Delete
                    </button>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="users-container">
                <Navbar />
                <div className="loading-content">
                    <div className="loading-spinner"></div>
                    <p>Loading users...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="users-container">
            <Navbar />

            <div className="users-content">
                {/* Header */}
                <div className="users-header">
                    <h1 className="page-title">User Management</h1>
                    <p className="page-subtitle">
                        Manage all CPEC user accounts and permissions
                    </p>
                </div>

                {/* Stats */}
                <div className="users-stats">
                    <div className="stat-card">
                        <div className="stat-icon">👥</div>
                        <div className="stat-content">
                            <div className="stat-value">{users.length}</div>
                            <div className="stat-label">Total Users</div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">👑</div>
                        <div className="stat-content">
                            <div className="stat-value">
                                {users.filter(u => u.role === 'admin').length}
                            </div>
                            <div className="stat-label">Admins</div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">✅</div>
                        <div className="stat-content">
                            <div className="stat-value">
                                {users.filter(u => u.is_verified).length}
                            </div>
                            <div className="stat-label">Verified</div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">🚀</div>
                        <div className="stat-content">
                            <div className="stat-value">
                                {users.filter(u =>
                                    new Date(u.date_joined) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                                ).length}
                            </div>
                            <div className="stat-label">New This Week</div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="users-filters">
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                        <span className="search-icon">🔍</span>
                    </div>

                    <div className="filter-buttons">
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="filter-select"
                        >
                            <option value="all">All Roles</option>
                            <option value="member">Members</option>
                            <option value="admin">Admins</option>
                        </select>

                        <select
                            value={verificationFilter}
                            onChange={(e) => setVerificationFilter(e.target.value)}
                            className="filter-select"
                        >
                            <option value="all">All Users</option>
                            <option value="verified">Verified Only</option>
                            <option value="unverified">Unverified Only</option>
                        </select>
                    </div>
                </div>

                {/* Users Grid */}
                <div className="users-grid-section">
                    <div className="section-header">
                        <h2 className="section-title">
                            Users ({filteredUsers.length})
                        </h2>
                    </div>

                    {filteredUsers.length === 0 ? (
                        <div className="no-users">
                            <div className="no-users-icon">👥</div>
                            <h3>No users found</h3>
                            <p>
                                {searchTerm
                                    ? `No users match "${searchTerm}"`
                                    : 'No users match the selected filters'
                                }
                            </p>
                        </div>
                    ) : (
                        <div className="users-grid">
                            {filteredUsers.map(user => (
                                <UserCard key={user.id} user={user} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Users;