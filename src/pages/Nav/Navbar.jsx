// frontend/src/pages/Nav/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated, isAdmin, getUserInfo, logout } from '../../servces/AuthServices';
import './nav.css';

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [admin, setAdmin] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated()) {
            setUser(getUserInfo());
            setAdmin(isAdmin());
        }
    }, []);

    const handleLogout = async () => {
        await logout();
        setIsMobileMenuOpen(false);
        navigate('/');
    };

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Events', path: '/events' },
        { name: 'Programs', path: '/programs' },
        { name: 'Mentorship', path: '/mentorship' },
        { name: 'Network', path: '/network' },
    ];

    return (
        <>
            <nav className="navbar">
                <div className="nav-container">
                    <Link to="/" className="logo" onClick={() => setIsMobileMenuOpen(false)}>
                        <div className="logo-icon">⚗️</div>
                        <div className="logo-text">
                            <span className="logo-main">CPEC</span>
                            <span className="logo-sub">ChemProcess Engineers Connect</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="nav-links desktop-nav">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className="nav-link"
                            >
                                {link.name}
                            </Link>
                        ))}

                        {admin && (
                            <Link
                                to="/admin/dashboard"
                                className="nav-link admin-link"
                            >
                                <span className="admin-badge">👑 Admin</span>
                            </Link>
                        )}
                    </div>

                    {/* Desktop Auth Section */}
                    <div className="nav-auth desktop-auth">
                        {user ? (
                            <div className="user-menu">
                                <Link to="/profile" className="user-avatar">
                                    {user.profile_picture ? (
                                        <img src={user.profile_picture} alt={user.username} />
                                    ) : (
                                        <div className="avatar-placeholder">
                                            {user.username?.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <span className="user-name">{user.username}</span>
                                </Link>
                                <button onClick={handleLogout} className="btn-logout">
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="auth-buttons">
                                <Link to="/login" className="btn-login">
                                    Login
                                </Link>
                                <Link to="/register" className="btn-join">
                                    Join Now
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="mobile-menu-btn"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle menu"
                        aria-expanded={isMobileMenuOpen}
                    >
                        <div className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </button>
                </div>
            </nav>

            {/* Mobile Sidebar Overlay */}
            <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}></div>

            {/* Mobile Sidebar */}
            <div className={`mobile-sidebar ${isMobileMenuOpen ? 'active' : ''}`}>
                <div className="sidebar-header">
                    <Link to="/" className="sidebar-logo" onClick={() => setIsMobileMenuOpen(false)}>
                        <div className="logo-icon">⚗️</div>
                        <div className="logo-text">
                            <span className="logo-main">CPEC</span>
                            <span className="logo-sub">ChemProcess Engineers Connect</span>
                        </div>
                    </Link>

                    <button
                        className="sidebar-close"
                        onClick={() => setIsMobileMenuOpen(false)}
                        aria-label="Close menu"
                    >
                        <span>✕</span>
                    </button>
                </div>

                <div className="sidebar-content">
                    {/* User Info in Sidebar */}
                    {user ? (
                        <div className="sidebar-user">
                            <div className="sidebar-user-avatar">
                                {user.profile_picture ? (
                                    <img src={user.profile_picture} alt={user.username} />
                                ) : (
                                    <div className="avatar-placeholder">
                                        {user.username?.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <div className="sidebar-user-info">
                                <h3>{user.username}</h3>
                                <p>{user.email}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="sidebar-auth">
                            <Link
                                to="/login"
                                className="btn-login sidebar-btn"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="btn-join sidebar-btn"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Join Now
                            </Link>
                        </div>
                    )}

                    {/* Mobile Navigation Links */}
                    <nav className="sidebar-nav">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className="sidebar-nav-link"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <span className="sidebar-nav-icon">
                                    {link.name === 'Home' && '🏠'}
                                    {link.name === 'Events' && '🎪'}
                                    {link.name === 'Programs' && '📚'}
                                    {link.name === 'Mentorship' && '🤝'}
                                    {link.name === 'Network' && '🌐'}
                                </span>
                                <span className="sidebar-nav-text">{link.name}</span>
                                <span className="sidebar-nav-arrow">→</span>
                            </Link>
                        ))}

                        {admin && (
                            <Link
                                to="/admin/dashboard"
                                className="sidebar-nav-link admin-sidebar-link"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <span className="sidebar-nav-icon">👑</span>
                                <span className="sidebar-nav-text">Admin Dashboard</span>
                                <span className="sidebar-nav-arrow">→</span>
                            </Link>
                        )}

                        {/* Additional Mobile Links */}
                        <div className="sidebar-divider"></div>

                        <Link
                            to="/profile"
                            className="sidebar-nav-link"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <span className="sidebar-nav-icon">👤</span>
                            <span className="sidebar-nav-text">My Profile</span>
                            <span className="sidebar-nav-arrow">→</span>
                        </Link>

                        <Link
                            to="/careers"
                            className="sidebar-nav-link"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <span className="sidebar-nav-icon">💼</span>
                            <span className="sidebar-nav-text">Careers</span>
                            <span className="sidebar-nav-arrow">→</span>
                        </Link>

                        <Link
                            to="/forum"
                            className="sidebar-nav-link"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <span className="sidebar-nav-icon">💬</span>
                            <span className="sidebar-nav-text">Forum</span>
                            <span className="sidebar-nav-arrow">→</span>
                        </Link>

                        <Link
                            to="/certification"
                            className="sidebar-nav-link"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <span className="sidebar-nav-icon">🏆</span>
                            <span className="sidebar-nav-text">Certification</span>
                            <span className="sidebar-nav-arrow">→</span>
                        </Link>
                    </nav>

                    {/* Logout Button in Sidebar */}
                    {user && (
                        <div className="sidebar-footer">
                            <button
                                onClick={handleLogout}
                                className="btn-logout sidebar-logout"
                            >
                                <span className="logout-icon">🚪</span>
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Navbar;