// frontend/src/pages/Auth/Login/Login.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apij from '../../servces/apij';
import api from '../../servces/api';
import { isAuthenticated } from '../../servces/AuthServices';
import './login.css';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        rememberMe: false
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (isAuthenticated()) {
            navigate('/');
        }
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.username.trim() || !formData.password) {
            setError('Please enter both username and password');
            return;
        }

        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await apij.post('auth/login/', {
                username: formData.username.trim(),
                password: formData.password
            });

            const { access, refresh, user } = response.data;

            // Store tokens based on rememberMe choice
            const storage = formData.rememberMe ? localStorage : sessionStorage;
            storage.setItem('access_token', access);
            storage.setItem('refresh_token', refresh);
            storage.setItem('user_info', JSON.stringify(user));

            setSuccess(`Welcome back, ${user.username}! Redirecting...`);

            // Redirect to home after successful login
            setTimeout(() => {
                navigate('/');
            }, 2000);

        } catch (err) {
            console.error('Login error:', err);

            if (err.response) {
                if (err.response.status === 401) {
                    setError('Invalid username or password. Please try again.');
                } else if (err.response.status === 400) {
                    const errorData = err.response.data;
                    if (errorData.non_field_errors) {
                        setError('Invalid username or password. Please check your credentials.');
                    } else if (errorData.detail) {
                        setError(errorData.detail);
                    } else {
                        setError('Invalid login credentials. Please check your input.');
                    }
                } else if (err.response.status === 403) {
                    setError('Your account is not active. Please contact support.');
                } else {
                    setError('Login failed. Please try again.');
                }
            } else if (err.request) {
                setError('Cannot connect to server. Please check your internet connection.');
            } else {
                setError('An unexpected error occurred. Please try again.');
            }

            setFormData(prev => ({ ...prev, password: '' }));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-background">
                <div className="background-animation"></div>
            </div>

            <div className="login-content">
                <div className="login-card">
                    <div className="login-header">
                        <Link to="/" className="back-home">
                            ← Back to Home
                        </Link>
                        <div className="login-logo">
                            <div className="logo-icon">⚗️</div>
                            <div className="logo-text">
                                <div className="logo-main">CPEC</div>
                                <div className="logo-sub">ChemProcess Engineers Connect</div>
                            </div>
                        </div>
                        <h1 className="login-title">Welcome Back</h1>
                        <p className="login-subtitle">
                            Sign in to access your professional dashboard
                        </p>
                    </div>

                    <form className="login-form" onSubmit={handleSubmit}>
                        {error && (
                            <div className="alert alert-error">
                                <span className="alert-icon">⚠️</span>
                                <span>{error}</span>
                            </div>
                        )}

                        {success && (
                            <div className="alert alert-success">
                                <span className="alert-icon">✅</span>
                                <span>{success}</span>
                            </div>
                        )}

                        <div className="form-group">
                            <label className="form-label" htmlFor="username">
                                Username
                            </label>
                            <div className="input-with-icon">
                                <span className="input-icon">👤</span>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="Enter your username"
                                    required
                                    disabled={isLoading}
                                    autoComplete="username"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="password">
                                Password
                            </label>
                            <div className="input-with-icon">
                                <span className="input-icon">🔒</span>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="Enter your password"
                                    required
                                    disabled={isLoading}
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={isLoading}
                                >
                                    {showPassword ? '👁️' : '👁️‍🗨️'}
                                </button>
                            </div>
                        </div>

                        <div className="form-options">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    name="rememberMe"
                                    checked={formData.rememberMe}
                                    onChange={handleChange}
                                    className="checkbox-input"
                                    disabled={isLoading}
                                />
                                <span className="checkbox-custom"></span>
                                <span className="checkbox-text">Remember me</span>
                            </label>
                            <Link to="/forgot-password" className="forgot-password">
                                Forgot Password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            className="login-button"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className="spinner"></span>
                                    Signing In...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>

                        <div className="divider">
                            <span className="divider-text">or continue with</span>
                        </div>

                        <div className="social-login">
                            <button type="button" className="social-button google">
                                <span className="social-icon">🔍</span>
                                Google
                            </button>
                            <button type="button" className="social-button linkedin">
                                <span className="social-icon">💼</span>
                                LinkedIn
                            </button>
                        </div>

                        <div className="register-link">
                            Don't have an account?
                            <Link to="/register" className="register-link-text">
                                Create Account
                            </Link>
                        </div>
                    </form>
                </div>

                <div className="login-sidebar">
                    <div className="sidebar-content">
                        <div className="sidebar-icon">🚀</div>
                        <h2 className="sidebar-title">Professional Benefits</h2>
                        <p className="sidebar-description">
                            Your CPEC account unlocks exclusive resources and opportunities
                        </p>

                        <ul className="sidebar-features">
                            <li>
                                <span className="feature-icon">📊</span>
                                <div>
                                    <strong>Project Portfolio</strong>
                                    <span>Showcase your engineering projects</span>
                                </div>
                            </li>
                            <li>
                                <span className="feature-icon">🤝</span>
                                <div>
                                    <strong>Peer Networking</strong>
                                    <span>Connect with engineers in your specialty</span>
                                </div>
                            </li>
                            <li>
                                <span className="feature-icon">📈</span>
                                <div>
                                    <strong>Career Tracking</strong>
                                    <span>Monitor your professional development</span>
                                </div>
                            </li>
                            <li>
                                <span className="feature-icon">🎯</span>
                                <div>
                                    <strong>Job Matching</strong>
                                    <span>Find opportunities matching your skills</span>
                                </div>
                            </li>
                        </ul>

                        <div className="sidebar-stats">
                            <div className="stat">
                                <div className="stat-number">500+</div>
                                <div className="stat-label">Active Engineers</div>
                            </div>
                            <div className="stat">
                                <div className="stat-number">100+</div>
                                <div className="stat-label">Industry Projects</div>
                            </div>
                            <div className="stat">
                                <div className="stat-number">50+</div>
                                <div className="stat-label">Mentors Online</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;