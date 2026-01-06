// frontend/src/pages/Auth/Register/Register.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apij from '../../servces/apij';
import api from '../../servces/api';
import { isAuthenticated } from '../../servces/AuthServices';
import './register.css';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirm_password: '',
        agree_to_terms: false
    });
    const [showPassword, setShowPassword] = useState({
        password: false,
        confirm_password: false
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [passwordStrength, setPasswordStrength] = useState({
        score: 0,
        text: 'Weak',
        class: 'weak'
    });

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

        if (name === 'password') {
            calculatePasswordStrength(value);
        }
    };

    const calculatePasswordStrength = (password) => {
        let score = 0;
        if (password.length >= 8) score += 1;
        if (password.length >= 12) score += 1;
        if (/[A-Z]/.test(password)) score += 1;
        if (/[a-z]/.test(password)) score += 1;
        if (/[0-9]/.test(password)) score += 1;
        if (/[^A-Za-z0-9]/.test(password)) score += 1;

        let strengthClass = 'weak';
        let strengthText = 'Weak';

        if (score >= 5) {
            strengthClass = 'strong';
            strengthText = 'Strong';
        } else if (score >= 3) {
            strengthClass = 'moderate';
            strengthText = 'Moderate';
        }

        setPasswordStrength({
            score,
            text: strengthText,
            class: strengthClass
        });
    };

    const validateForm = () => {
        if (!formData.username.trim()) {
            return 'Username is required';
        }
        if (formData.username.length < 3) {
            return 'Username must be at least 3 characters';
        }
        if (!/^[A-Za-z0-9_]+$/.test(formData.username)) {
            return 'Username can only contain letters, numbers, and underscores';
        }
        if (!formData.email.trim()) {
            return 'Email is required';
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            return 'Please enter a valid email address';
        }
        if (!formData.password) {
            return 'Password is required';
        }
        if (formData.password.length < 8) {
            return 'Password must be at least 8 characters';
        }
        if (passwordStrength.score < 3) {
            return 'Please use a stronger password';
        }
        if (formData.password !== formData.confirm_password) {
            return 'Passwords do not match';
        }
        if (!formData.agree_to_terms) {
            return 'You must agree to the terms and conditions';
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            const registrationData = {
                username: formData.username.trim(),
                email: formData.email.trim().toLowerCase(),
                password: formData.password,
                confirm_password: formData.confirm_password
            };

            const response = await apij.post('auth/register/', registrationData);

            setSuccess('Account created successfully! Logging you in...');

            // Auto-login after successful registration
            try {
                const loginResponse = await apij.post('auth/login/', {
                    username: formData.username.trim(),
                    password: formData.password
                });

                const { access, refresh, user } = loginResponse.data;

                // Store tokens
                localStorage.setItem('access_token', access);
                localStorage.setItem('refresh_token', refresh);
                localStorage.setItem('user_info', JSON.stringify(user));

                setSuccess('Registration successful! Welcome to CPEC. Redirecting...');

                setTimeout(() => {
                    navigate('/');
                }, 2000);

            } catch (loginError) {
                setSuccess('Account created! Please login with your credentials.');
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            }

        } catch (err) {
            console.error('Registration error:', err);

            if (err.response) {
                const errorData = err.response.data;
                if (err.response.status === 400) {
                    if (errorData.username) {
                        setError(`Username: ${errorData.username[0]}`);
                    } else if (errorData.email) {
                        setError(`Email: ${errorData.email[0]}`);
                    } else if (errorData.password) {
                        setError(`Password: ${errorData.password[0]}`);
                    } else if (errorData.non_field_errors) {
                        setError(errorData.non_field_errors[0]);
                    } else if (errorData.detail) {
                        setError(errorData.detail);
                    } else {
                        setError('Please check your registration details and try again.');
                    }
                } else if (err.response.status === 409) {
                    setError('An account with this username or email already exists.');
                } else {
                    setError('Registration failed. Please try again.');
                }
            } else if (err.request) {
                setError('Network error. Please check your connection.');
            } else {
                setError('An unexpected error occurred.');
            }

            setFormData(prev => ({
                ...prev,
                password: '',
                confirm_password: ''
            }));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="register-container">
            <div className="register-background">
                <div className="background-animation"></div>
            </div>

            <div className="register-content">
                <div className="register-card">
                    <div className="register-header">
                        <Link to="/" className="back-home">
                            ← Back to Home
                        </Link>
                        <div className="register-logo">
                            <div className="logo-icon">⚗️</div>
                            <div className="logo-text">
                                <div className="logo-main">CPEC</div>
                                <div className="logo-sub">ChemProcess Engineers Connect</div>
                            </div>
                        </div>
                        <h1 className="register-title">Join CPEC</h1>
                        <p className="register-subtitle">
                            Create your account and start your professional journey
                        </p>
                    </div>

                    <form className="register-form" onSubmit={handleSubmit}>
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

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label" htmlFor="username">
                                    Username <span className="required">*</span>
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
                                        placeholder="johndoe_eng"
                                        required
                                        disabled={isLoading}
                                        minLength="3"
                                        maxLength="30"
                                        pattern="[A-Za-z0-9_]+"
                                    />
                                </div>
                                <small className="form-hint">
                                    Letters, numbers, and underscores only
                                </small>
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="email">
                                    Email <span className="required">*</span>
                                </label>
                                <div className="input-with-icon">
                                    <span className="input-icon">✉️</span>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="form-input"
                                        placeholder="engineer@example.com"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="password">
                                Password <span className="required">*</span>
                            </label>
                            <div className="input-with-icon">
                                <span className="input-icon">🔒</span>
                                <input
                                    type={showPassword.password ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="Create a strong password"
                                    required
                                    disabled={isLoading}
                                    minLength="8"
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(prev => ({
                                        ...prev,
                                        password: !prev.password
                                    }))}
                                    disabled={isLoading}
                                >
                                    {showPassword.password ? '👁️' : '👁️‍🗨️'}
                                </button>
                            </div>
                            {formData.password && (
                                <div className="password-strength">
                                    <div className="strength-bar">
                                        <div className={`strength-fill ${passwordStrength.class}`}></div>
                                    </div>
                                    <span className="strength-text">{passwordStrength.text}</span>
                                </div>
                            )}
                            <small className="form-hint">
                                Minimum 8 characters with uppercase, lowercase, and numbers
                            </small>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="confirm_password">
                                Confirm Password <span className="required">*</span>
                            </label>
                            <div className="input-with-icon">
                                <span className="input-icon">🔒</span>
                                <input
                                    type={showPassword.confirm_password ? 'text' : 'password'}
                                    id="confirm_password"
                                    name="confirm_password"
                                    value={formData.confirm_password}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="Re-enter your password"
                                    required
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(prev => ({
                                        ...prev,
                                        confirm_password: !prev.confirm_password
                                    }))}
                                    disabled={isLoading}
                                >
                                    {showPassword.confirm_password ? '👁️' : '👁️‍🗨️'}
                                </button>
                            </div>
                            {formData.confirm_password && formData.password !== formData.confirm_password && (
                                <div className="validation-error">
                                    ⚠️ Passwords do not match
                                </div>
                            )}
                        </div>

                        <div className="form-group terms-agreement">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    name="agree_to_terms"
                                    checked={formData.agree_to_terms}
                                    onChange={handleChange}
                                    className="checkbox-input"
                                    disabled={isLoading}
                                    required
                                />
                                <span className="checkbox-custom"></span>
                                <span className="terms-text">
                                    I agree to the <a href="/terms" target="_blank" rel="noopener noreferrer">Terms of Service</a> and <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
                                </span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="register-button"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className="spinner"></span>
                                    Creating Account...
                                </>
                            ) : (
                                'Create Account'
                            )}
                        </button>

                        <div className="login-link">
                            Already have an account?
                            <Link to="/login" className="login-link-text">
                                Sign In
                            </Link>
                        </div>
                    </form>
                </div>

                <div className="register-sidebar">
                    <div className="sidebar-content">
                        <div className="sidebar-icon">🎯</div>
                        <h2 className="sidebar-title">Why Join CPEC?</h2>
                        <p className="sidebar-description">
                            Become part of the premier network for chemical process engineers
                        </p>

                        <ul className="sidebar-benefits">
                            <li>
                                <span className="benefit-icon">🤝</span>
                                <div>
                                    <strong>Professional Networking</strong>
                                    <span>Connect with industry experts</span>
                                </div>
                            </li>
                            <li>
                                <span className="benefit-icon">🎓</span>
                                <div>
                                    <strong>Continuous Learning</strong>
                                    <span>Access exclusive workshops and training</span>
                                </div>
                            </li>
                            <li>
                                <span className="benefit-icon">💼</span>
                                <div>
                                    <strong>Career Advancement</strong>
                                    <span>Find your next opportunity</span>
                                </div>
                            </li>
                            <li>
                                <span className="benefit-icon">🌐</span>
                                <div>
                                    <strong>Industry Insights</strong>
                                    <span>Stay ahead with latest trends</span>
                                </div>
                            </li>
                            <li>
                                <span className="benefit-icon">📊</span>
                                <div>
                                    <strong>Project Collaboration</strong>
                                    <span>Work on real challenges</span>
                                </div>
                            </li>
                            <li>
                                <span className="benefit-icon">🏆</span>
                                <div>
                                    <strong>Professional Recognition</strong>
                                    <span>Showcase your expertise</span>
                                </div>
                            </li>
                        </ul>

                        <div className="sidebar-stats">
                            <div className="stat">
                                <div className="stat-number">1500+</div>
                                <div className="stat-label">Members</div>
                            </div>
                            <div className="stat">
                                <div className="stat-number">50+</div>
                                <div className="stat-label">Events</div>
                            </div>
                            <div className="stat">
                                <div className="stat-number">25+</div>
                                <div className="stat-label">Programs</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;