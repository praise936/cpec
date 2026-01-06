// frontend/src/pages/Home/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../Nav/Navbar';
import { isAuthenticated, isAdmin, getUserInfo } from '../../servces/AuthServices';
import api from '../../servces/api';
import './home.css';

import heroImage from '../../assets/hero-engineers.jpg';
import missionImage from '../../assets/mission-image.jpg';
import feature1 from '../../assets/feature-1.jpg';
import feature2 from '../../assets/feature-2.jpg';
import feature3 from '../../assets/feature-3.jpg';
import feature4 from '../../assets/feature-4.jpg';
import statsBg from '../../assets/stats-bg.jpg';
import ctaBg from '../../assets/cta-bg.jpg';

const Home = () => {
    const [user, setUser] = useState(null);
    const [isUserAdmin, setIsUserAdmin] = useState(false);
    const [adminStats, setAdminStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        members: 0,
        events: 0,
        programs: 0,
        mentors: 0
    });

    useEffect(() => {
        const checkAuth = async () => {
            if (isAuthenticated()) {
                const userInfo = getUserInfo();
                setUser(userInfo);
                setIsUserAdmin(isAdmin());

                if (isAdmin()) {
                    try {
                        const response = await api.get('/admin/dashboard/');
                        setAdminStats(response.data);
                    } catch (error) {
                        console.error('Error fetching admin stats:', error);
                    }
                }
            }

            // Fetch public stats
            try {
                const [eventsRes, programsRes] = await Promise.all([
                    api.get('/events/'),
                    api.get('/programs/')
                ]);

                setStats({
                    members: 1500,
                    events: eventsRes.data?.count || eventsRes.data?.length || 0,
                    programs: programsRes.data?.count || programsRes.data?.length || 0,
                    mentors: 120
                });
            } catch (error) {
                console.error('Error fetching stats:', error);
            }

            setLoading(false);
        };

        checkAuth();
    }, []);

    const features = isUserAdmin ? [
        {
            icon: '🎛️',
            title: 'Event Management',
            description: 'Create and manage industry events, workshops, and conferences.',
            link: '/admin/events/create',
            color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            image: feature1
        },
        {
            icon: '📚',
            title: 'Program Creation',
            description: 'Design training programs and certification courses.',
            link: '/admin/programs/create',
            color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            image: feature2
        },
        {
            icon: '👥',
            title: 'User Management',
            description: 'Manage member accounts and verify engineers.',
            link: '/admin/users',
            color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            image: feature3
        },
        {
            icon: '📊',
            title: 'Analytic Dashboard',
            description: 'Track platform growth and engagement metrics.',
            link: '/admin/dashboard',
            color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            image: feature4
        },
        {
            icon: '📢',
            title: 'Announcements',
            description: 'Broadcast important updates to all members.',
            link: '#',
            color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            image: feature1
        },
        {
            icon: '✅',
            title: 'Content Moderation',
            description: 'Review and approve user-generated content.',
            link: '#',
            color: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
            image: feature2
        }
    ] : [
        {
            icon: '🎪',
            title: 'Industry Events',
            description: 'Join exclusive conferences, workshops, and networking sessions.',
            link: '/events',
            color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            image: feature1
        },
        {
            icon: '📖',
            title: 'Training Programs',
            description: 'Advance your skills with certified courses.',
            link: '/programs',
            color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            image: feature2
        },
        {
            icon: '🤝',
            title: 'Mentorship',
            description: 'Connect with experienced industry mentors.',
            link: '/mentorship',
            color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            image: feature3
        },
        {
            icon: '🌐',
            title: 'Global Network',
            description: 'Connect with chemical engineers worldwide.',
            link: '/network',
            color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            image: feature4
        },
        {
            icon: '💼',
            title: 'Career Support',
            description: 'Find opportunities matching your expertise.',
            link: '/careers',
            color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            image: feature1
        },
        {
            icon: '🏆',
            title: 'Certification',
            description: 'Earn industry-recognized certifications.',
            link: '/certification',
            color: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
            image: feature2
        }
    ];

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="loading-spinner"></div>
                <p>Loading CPEC...</p>
            </div>
        );
    }

    return (
        <div className="home-container">
            <Navbar />

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-background"></div>
                <div className="hero-content">
                    <div className="hero-text">
                        <h1 className="hero-title">
                            <span className="hero-gradient">ChemProcess</span>
                            <span className="hero-subtitle">Engineers Connect</span>
                        </h1>
                        <p className="hero-description">
                            {isUserAdmin
                                ? "Welcome to the command center. Shape the future of chemical engineering collaboration."
                                : user
                                    ? "Welcome back! Continue your journey with exclusive resources and connections."
                                    : "Join the elite network of chemical process engineers. Connect, innovate, and lead the industry's transformation."
                            }
                        </p>
                        <div className="hero-cta">
                            {isUserAdmin ? (
                                <>
                                    <Link to="/admin/dashboard" className="cta-button primary">
                                        Dashboard
                                    </Link>
                                    <Link to="/admin/events/create" className="cta-button secondary">
                                        Create Event
                                    </Link>
                                </>
                            ) : user ? (
                                <>
                                    <Link to="/events" className="cta-button primary">
                                        Browse Events
                                    </Link>
                                    <Link to="/profile" className="cta-button secondary">
                                        My Profile
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link to="/register" className="cta-button primary">
                                        Join Free
                                    </Link>
                                    <Link to="/events" className="cta-button secondary">
                                        Explore Events
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="hero-image">
                        <img
                            src={heroImage}
                            alt="Chemical engineers collaborating in modern laboratory"
                            className="hero-image-content"
                        />
                    </div>
                </div>

                {/* Wave divider */}
                <div className="wave-divider">
                    <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" fill="currentColor"></path>
                        <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" fill="currentColor"></path>
                        <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="currentColor"></path>
                    </svg>
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats-section" style={{ backgroundImage: `url(${statsBg})` }}>
                <div className="stats-container">
                    {Object.entries(stats).map(([key, value], index) => (
                        <div key={key} className="stat-card" style={{ '--delay': index * 0.1 + 's' }}>
                            <div className="stat-number">{value.toLocaleString()}+</div>
                            <div className="stat-label">
                                {key.charAt(0).toUpperCase() + key.slice(1)}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Mission Section - Added after Stats Section */}
            <section className="mission-section">
                <div className="mission-container">
                    <div className="mission-content">
                        <h2 className="mission-title">
                            {isUserAdmin ? 'Platform Management' : 'Our Mission & Vision'}
                        </h2>
                        <p className="mission-description">
                            {isUserAdmin
                                ? "As an administrator, you play a crucial role in shaping the CPEC community. Your decisions impact thousands of chemical engineers worldwide."
                                : "At CPEC, we're dedicated to revolutionizing the chemical process engineering landscape by creating a dynamic ecosystem where professionals connect, collaborate, and innovate."
                            }
                        </p>
                        <p className="mission-description">
                            {isUserAdmin
                                ? "Use the tools below to manage events, programs, users, and content. Remember that your actions should align with our community guidelines and values."
                                : "Our vision is to build the world's most comprehensive network of chemical process engineers, empowering them with the tools, knowledge, and connections needed to drive industrial innovation."
                            }
                        </p>
                        <ul className="mission-features">
                            {isUserAdmin ? [
                                <li key="1">Real-time platform analytics and insights</li>,
                                <li key="2">Automated moderation tools</li>,
                                <li key="3">Bulk content management capabilities</li>,
                                <li key="4">User activity monitoring and reporting</li>
                            ] : [
                                <li key="1">Global Network of Chemical Engineering Professionals</li>,
                                <li key="2">Cutting-edge Training and Development Programs</li>,
                                <li key="3">Industry-Academia Collaboration Platforms</li>,
                                <li key="4">Sustainable Engineering Solutions</li>
                            ]}
                        </ul>
                    </div>
                    <div className="mission-image-wrapper">
                        <img
                            src={missionImage}
                            alt={isUserAdmin ? "Admin dashboard for CPEC platform" : "Chemical and process engineering professionals collaborating"}
                            className="home-hero-image"
                        />
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="section-header">
                    <h2 className="section-title">
                        {isUserAdmin ? 'Admin Tools' : 'Why Join CPEC?'}
                    </h2>
                    <p className="section-subtitle">
                        {isUserAdmin
                            ? 'Powerful tools to manage and grow the community'
                            : 'Everything you need to advance your chemical engineering career'
                        }
                    </p>
                </div>

                <div className="features-grid">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="feature-card"
                            style={{
                                '--card-delay': index * 0.1 + 's',
                                '--card-color': feature.color,
                                backgroundImage: `url(${feature.image})`
                            }}
                        >
                            <div className="feature-overlay"></div>
                            <div className="feature-icon">{feature.icon}</div>
                            <h3 className="feature-title">{feature.title}</h3>
                            <p className="feature-description">{feature.description}</p>
                            <Link to={feature.link} className="feature-link">
                                Explore <span>→</span>
                            </Link>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section" style={{ backgroundImage: `url(${ctaBg})` }}>
                <div className="cta-content">
                    <h2 className="cta-title">
                        Ready to Transform Your Career?
                    </h2>
                    <p className="cta-description">
                        Join thousands of chemical engineers who are already advancing their careers
                        through our exclusive network, events, and programs.
                    </p>
                    {user ? (
                        <div className="cta-buttons">
                            <Link to="/events" className="cta-button primary large">
                                Browse Upcoming Events
                            </Link>
                            <Link to="/programs" className="cta-button secondary large">
                                Explore Programs
                            </Link>
                        </div>
                    ) : (
                        <div className="cta-buttons">
                            <Link to="/register" className="cta-button primary large">
                                Join CPEC - It's Free
                            </Link>
                            <Link to="/login" className="cta-button secondary large">
                                Already a Member? Sign In
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-content">
                    <div className="footer-logo">
                        <div className="logo-icon">⚗️</div>
                        <div className="footer-logo-text">
                            <div>CPEC</div>
                            <div className="footer-subtitle">ChemProcess Engineers Connect</div>
                        </div>
                    </div>

                    <div className="footer-links">
                        <div className="footer-column">
                            <h4>Platform</h4>
                            <Link to="/">Home</Link>
                            <Link to="/events">Events</Link>
                            <Link to="/programs">Programs</Link>
                            <Link to="/mentorship">Mentorship</Link>
                        </div>
                        <div className="footer-column">
                            <h4>Community</h4>
                            <Link to="/network">Network</Link>
                            <Link to="/careers">Careers</Link>
                            <Link to="/certification">Certification</Link>
                            <Link to="/forum">Forum</Link>
                        </div>
                        <div className="footer-column">
                            <h4>Company</h4>
                            <Link to="/about">About Us</Link>
                            <Link to="/contact">Contact</Link>
                            <Link to="/privacy">Privacy</Link>
                            <Link to="/terms">Terms</Link>
                        </div>
                    </div>

                    <div className="footer-bottom">
                        <p>&copy; {new Date().getFullYear()} CPEC - ChemProcess Engineers Connect. All rights reserved.</p>
                        <div className="footer-social">
                            <a href="#" className="social-link">LinkedIn</a>
                            <a href="#" className="social-link">Twitter</a>
                            <a href="#" className="social-link">Instagram</a>
                            <a href="#" className="social-link">YouTube</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;