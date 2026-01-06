// frontend/src/pages/Programs/Programs.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Nav/Navbar';
import { isAdmin,isAuthenticated,getUserInfo } from '../../servces/AuthServices';
import api from '../../servces/api';
import './programs.css';

const Programs = () => {
    const [user, setUser] = useState(null);
    const [isUserAdmin, setIsUserAdmin] = useState(false);
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = () => {
            if (isAuthenticated()) {
                const userInfo = getUserInfo();
                setUser(userInfo);
                setIsUserAdmin(isAdmin());
            }
            fetchPrograms();
        };

        checkAuth();
    }, []);

    const fetchPrograms = async () => {
        try {
            setLoading(true);
            setError('');

            const response = await api.get('/programs/');

            let programsData = [];
            if (Array.isArray(response.data)) {
                programsData = response.data;
            } else if (response.data?.results) {
                programsData = response.data.results;
            } else if (response.data?.data) {
                programsData = response.data.data;
            }

            setPrograms(programsData);
        } catch (error) {
            console.error('Error fetching programs:', error);
            setError('Failed to load programs. Please try again later.');
            setPrograms([]);
        } finally {
            setLoading(false);
        }
    };

    const handleEnroll = async (programId) => {
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            await api.post(`/programs/${programId}/enroll/`);

            setPrograms(prevPrograms =>
                prevPrograms.map(program =>
                    program.id === programId
                        ? { ...program, user_enrolled: true }
                        : program
                )
            );

            alert('Successfully enrolled in the program!');
        } catch (error) {
            console.error('Error enrolling:', error);
            alert('Error enrolling in program. Please try again.');
        }
    };

    const handleDeleteProgram = async (programId) => {
        if (!window.confirm('Are you sure you want to delete this program?')) {
            return;
        }

        try {
            await api.delete(`/programs/${programId}/delete/`); 
            setPrograms(prevPrograms => prevPrograms.filter(program => program.id !== programId));
            alert('Program deleted successfully');
        } catch (error) {
            console.error('Error deleting program:', error);
            alert('Error deleting program. Please try again.');
        }
    };

    const filteredPrograms = programs.filter(program => {
        if (!program) return false;

        if (searchTerm && !program.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !program.description.toLowerCase().includes(searchTerm.toLowerCase())) {
            return false;
        }

        if (filter === 'active' && !program.is_active) return false;
        if (filter === 'enrollment_open' && !program.enrollment_open) return false;
        if (filter !== 'all' && filter !== 'active' && filter !== 'enrollment_open' &&
            program.category !== filter) return false;

        return true;
    });

    const categories = [
        { id: 'all', name: 'All Programs', icon: '📚' },
        { id: 'active', name: 'Active', icon: '✅' },
        { id: 'enrollment_open', name: 'Open for Enrollment', icon: '🎯' },
        { id: 'Process Control', name: 'Process Control', icon: '🎛️' },
        { id: 'Process Safety', name: 'Process Safety', icon: '🛡️' },
        { id: 'Sustainability', name: 'Sustainability', icon: '🌱' },
        { id: 'Simulation', name: 'Simulation', icon: '💻' },
        { id: 'Project Management', name: 'Project Management', icon: '📊' },
    ];

    const formatDate = (dateString) => {
        if (!dateString) return 'Date TBA';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const ProgramCard = ({ program }) => {
        const isEnrolled = program.user_enrolled;
        const isFull = program.max_enrollment > 0 && program.current_enrollment >= program.max_enrollment;
        const isActive = program.is_active && program.enrollment_open;

        return (
            <div className={`program-card ${!isActive ? 'inactive' : ''}`}>
                <div className="program-header">
                    <div className="program-level">
                        <span className={`level-badge ${program.level}`}>
                            {program.level}
                        </span>
                    </div>
                    <div className="program-badges">
                        {program.is_free && <span className="badge-free">Free</span>}
                        {!program.enrollment_open && <span className="badge-closed">Closed</span>}
                        {isFull && <span className="badge-full">Full</span>}
                    </div>
                </div>

                <div className="program-body">
                    <h3 className="program-title">{program.title}</h3>
                    <p className="program-description">{program.description}</p>

                    <div className="program-details">
                        <div className="detail">
                            <span className="detail-icon">📅</span>
                            <span>Duration: {program.duration}</span>
                        </div>
                        <div className="detail">
                            <span className="detail-icon">🎓</span>
                            <span>Instructor: {program.instructor}</span>
                        </div>
                        <div className="detail">
                            <span className="detail-icon">📈</span>
                            <span>Level: {program.level}</span>
                        </div>
                        <div className="detail">
                            <span className="detail-icon">🏷️</span>
                            <span>Category: {program.category}</span>
                        </div>
                    </div>

                    <div className="program-stats">
                        <div className="stat">
                            <span className="stat-icon">👥</span>
                            <span>{program.current_enrollment} enrolled</span>
                        </div>
                        {program.max_enrollment > 0 && (
                            <div className="stat">
                                <span className="stat-icon">🎯</span>
                                <span>{program.max_enrollment - program.current_enrollment} spots left</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="program-footer">
                    <div className="program-price">
                        {program.is_free ? 'FREE' : `$${program.price}`}
                    </div>

                    <div className="program-actions">
                        {isUserAdmin ? (
                            <>
                                <button
                                    className="btn-edit"
                                    onClick={() => navigate(`/admin/programs/edit/${program.id}`)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="btn-delete"
                                    onClick={() => handleDeleteProgram(program.id)}
                                >
                                    Delete
                                </button>
                            </>
                        ) : !isActive ? (
                            <button className="btn-inactive" disabled>
                                Not Available
                            </button>
                        ) : isEnrolled ? (
                            <button className="btn-enrolled" disabled>
                                ✓ Enrolled
                            </button>
                        ) : isFull ? (
                            <button className="btn-full" disabled>
                                Program Full
                            </button>
                        ) : !user ? (
                            <button
                                className="btn-enroll"
                                onClick={() => navigate('/login')}
                            >
                                Login to Enroll
                            </button>
                        ) : (
                            <button
                                className="btn-enroll"
                                onClick={() => handleEnroll(program.id)}
                            >
                                Enroll Now
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="loading-container">
                <Navbar />
                <div className="loading-content">
                    <div className="loading-spinner"></div>
                    <p>Loading programs...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="programs-container">
            <Navbar />

            {/* Hero Section */}
            <section className="programs-hero">
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <h1 className="hero-title">Training Programs</h1>
                    <p className="hero-subtitle">
                        Advance your career with industry-leading chemical engineering programs
                    </p>
                    <p className="hero-description">
                        From beginner to expert level, our programs are designed by industry
                        leaders to give you the skills you need to excel.
                    </p>

                    {isUserAdmin && (
                        <button
                            className="create-program-btn"
                            onClick={() => navigate('/admin/programs/create')}
                        >
                            + Create New Program
                        </button>
                    )}
                </div>
            </section>

            {/* Search and Filter Section */}
            <section className="filter-section">
                <div className="filter-container">
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Search programs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                        <span className="search-icon">🔍</span>
                    </div>

                    <div className="category-filters">
                        {categories.map(category => (
                            <button
                                key={category.id}
                                className={`category-btn ${filter === category.id ? 'active' : ''}`}
                                onClick={() => setFilter(category.id)}
                            >
                                <span className="category-icon">{category.icon}</span>
                                <span className="category-name">{category.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Programs Grid */}
            <section className="programs-grid-section">
                <div className="programs-header">
                    <h2 className="section-title">
                        {filter === 'all' ? 'All Programs' :
                            filter === 'active' ? 'Active Programs' :
                                filter === 'enrollment_open' ? 'Open for Enrollment' :
                                    `${filter} Programs`}
                    </h2>
                    <p className="programs-count">
                        {filteredPrograms.length} {filteredPrograms.length === 1 ? 'program' : 'programs'} found
                    </p>
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {filteredPrograms.length === 0 ? (
                    <div className="no-programs">
                        <div className="no-programs-icon">📚</div>
                        <h3>No programs found</h3>
                        <p>
                            {searchTerm
                                ? `No programs match "${searchTerm}"`
                                : `No ${filter !== 'all' ? filter.toLowerCase() : ''} programs available`
                            }
                        </p>
                        {isUserAdmin && (
                            <button
                                className="create-program-btn"
                                onClick={() => navigate('/admin/programs/create')}
                            >
                                Create Your First Program
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="programs-grid">
                        {filteredPrograms.map(program => (
                            <ProgramCard key={program.id} program={program} />
                        ))}
                    </div>
                )}
            </section>

            {/* CTA Section */}
            <section className="programs-cta">
                <div className="cta-content">
                    <h2>Ready to Advance Your Skills?</h2>
                    <p>
                        Join thousands of chemical engineers who have accelerated their
                        careers through our certified training programs.
                    </p>
                    {user ? (
                        <div className="cta-buttons">
                            <button className="cta-btn" onClick={() => setFilter('enrollment_open')}>
                                View Available Programs
                            </button>
                            {!isUserAdmin && (
                                <button className="cta-btn secondary" onClick={() => navigate('/profile')}>
                                    My Learning Dashboard
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="cta-buttons">
                            <button className="cta-btn" onClick={() => navigate('/register')}>
                                Join CPEC - Start Learning
                            </button>
                            <button className="cta-btn secondary" onClick={() => navigate('/login')}>
                                Sign In to Enroll
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-content">
                    <div className="footer-logo">CPEC Training</div>
                    <p className="footer-subtitle">Elevating Chemical Engineering Excellence</p>
                    <p className="footer-copyright">
                        © {new Date().getFullYear()} CPEC. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}; 

export default Programs;