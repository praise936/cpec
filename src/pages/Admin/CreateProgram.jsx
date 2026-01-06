// frontend/src/pages/Admin/CreateProgram.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Nav/Navbar';
import api from '../../servces/api';
import './createProgram.css';

const CreateProgram = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [programData, setProgramData] = useState({
        title: '',
        description: '',
        category: 'Process Control',
        duration: '',
        start_date: '',
        end_date: '',
        level: 'intermediate',
        instructor: '',
        price: '0',
        max_enrollment: '0',
        syllabus: '',
        learning_outcomes: '',
        enrollment_open: true,
        is_active: true,
        image: null
    });

    const categories = [
        'Process Control',
        'Reactor Design',
        'Process Safety',
        'Sustainability',
        'Separation Processes',
        'Simulation',
        'Instrumentation',
        'Optimization',
        'Project Management',
        'Digital Transformation'
    ];

    const levels = [
        { value: 'beginner', label: 'Beginner' },
        { value: 'intermediate', label: 'Intermediate' },
        { value: 'advanced', label: 'Advanced' },
        { value: 'all_levels', label: 'All Levels' }
    ];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProgramData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFileChange = (e) => {
        setProgramData(prev => ({
            ...prev,
            image: e.target.files[0]
        }));
    };

    const validateForm = () => {
        if (!programData.title.trim()) {
            return 'Program title is required';
        }
        if (!programData.description.trim()) {
            return 'Program description is required';
        }
        if (!programData.duration.trim()) {
            return 'Program duration is required';
        }
        if (!programData.start_date) {
            return 'Start date is required';
        }
        if (!programData.end_date) {
            return 'End date is required';
        }
        if (new Date(programData.end_date) < new Date(programData.start_date)) {
            return 'End date cannot be before start date';
        }
        if (!programData.instructor.trim()) {
            return 'Instructor name is required';
        }
        if (parseFloat(programData.price) < 0) {
            return 'Price cannot be negative';
        }
        if (parseInt(programData.max_enrollment) < 0) {
            return 'Maximum enrollment cannot be negative';
        }
        if (!programData.syllabus.trim()) {
            return 'Syllabus is required';
        }
        if (!programData.learning_outcomes.trim()) {
            return 'Learning outcomes are required';
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

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            // Create FormData for file upload
            const formData = new FormData();

            // Append all fields to FormData
            Object.keys(programData).forEach(key => {
                if (key === 'image') {
                    if (programData.image) {
                        formData.append(key, programData.image);
                    }
                } else {
                    formData.append(key, programData[key]);
                }
            });

            // Convert price to decimal
            formData.set('price', parseFloat(programData.price).toFixed(2));
            formData.set('max_enrollment', parseInt(programData.max_enrollment));

            // Make API call
            const response = await api.post('programs/create/', formData);
            console.log(response);
            
            setSuccess('Program created successfully! Redirecting...');

            // Reset form
            setProgramData({
                title: '',
                description: '',
                category: 'Process Control',
                duration: '',
                start_date: '',
                end_date: '',
                level: 'intermediate',
                instructor: '',
                price: '0',
                max_enrollment: '0',
                syllabus: '',
                learning_outcomes: '',
                enrollment_open: true,
                is_active: true,
                image: null
            });

            // Redirect to programs page
            setTimeout(() => navigate('/programs'), 2000);

        } catch (error) {
            console.error('Error creating program:', error);

            if (error.response?.data) {
                const errors = error.response.data;
                let errorMessage = 'Error creating program. ';

                if (typeof errors === 'object') {
                    const errorList = Object.entries(errors).map(([field, messages]) =>
                        `${field}: ${Array.isArray(messages) ? messages[0] : messages}`
                    );
                    errorMessage += errorList.join(', ');
                } else if (typeof errors === 'string') {
                    errorMessage += errors;
                }

                setError(errorMessage);
            } else {
                setError('Error creating program. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-program-container">
            <Navbar />

            <div className="create-program-content">
                <div className="create-program-header">
                    <h1 className="page-title">Create Training Program</h1>
                    <p className="page-subtitle">
                        Design a comprehensive training program for chemical engineers
                    </p>
                </div>

                {error && (
                    <div className="alert alert-error">
                        <span className="alert-icon">⚠️</span>
                        {error}
                    </div>
                )}

                {success && (
                    <div className="alert alert-success">
                        <span className="alert-icon">✅</span>
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="create-program-form">
                    <div className="form-grid">
                        {/* Basic Information */}
                        <div className="form-section">
                            <h3 className="section-title">Basic Information</h3>

                            <div className="form-group">
                                <label htmlFor="title" className="form-label">
                                    Program Title <span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={programData.title}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="Enter program title"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="description" className="form-label">
                                    Description <span className="required">*</span>
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={programData.description}
                                    onChange={handleChange}
                                    className="form-input textarea"
                                    placeholder="Describe the program objectives and content"
                                    rows="4"
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="category" className="form-label">
                                        Category <span className="required">*</span>
                                    </label>
                                    <select
                                        id="category"
                                        name="category"
                                        value={programData.category}
                                        onChange={handleChange}
                                        className="form-select"
                                        required
                                    >
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="level" className="form-label">
                                        Difficulty Level <span className="required">*</span>
                                    </label>
                                    <select
                                        id="level"
                                        name="level"
                                        value={programData.level}
                                        onChange={handleChange}
                                        className="form-select"
                                        required
                                    >
                                        {levels.map(level => (
                                            <option key={level.value} value={level.value}>
                                                {level.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="image" className="form-label">
                                    Program Image
                                </label>
                                <input
                                    type="file"
                                    id="image"
                                    name="image"
                                    onChange={handleFileChange}
                                    className="form-file"
                                    accept="image/*"
                                />
                                <small className="form-hint">
                                    Recommended: 1200x600px JPG or PNG
                                </small>
                            </div>
                        </div>

                        {/* Duration & Schedule */}
                        <div className="form-section">
                            <h3 className="section-title">Duration & Schedule</h3>

                            <div className="form-group">
                                <label htmlFor="duration" className="form-label">
                                    Program Duration <span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="duration"
                                    name="duration"
                                    value={programData.duration}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="e.g., '8 weeks', '3 months', '40 hours'"
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="start_date" className="form-label">
                                        Start Date <span className="required">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        id="start_date"
                                        name="start_date"
                                        value={programData.start_date}
                                        onChange={handleChange}
                                        className="form-input"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="end_date" className="form-label">
                                        End Date <span className="required">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        id="end_date"
                                        name="end_date"
                                        value={programData.end_date}
                                        onChange={handleChange}
                                        className="form-input"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Instructor Information */}
                        <div className="form-section">
                            <h3 className="section-title">Instructor Information</h3>

                            <div className="form-group">
                                <label htmlFor="instructor" className="form-label">
                                    Instructor Name <span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="instructor"
                                    name="instructor"
                                    value={programData.instructor}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="Full name of the instructor"
                                    required
                                />
                            </div>
                        </div>

                        {/* Program Content */}
                        <div className="form-section">
                            <h3 className="section-title">Program Content</h3>

                            <div className="form-group">
                                <label htmlFor="syllabus" className="form-label">
                                    Syllabus <span className="required">*</span>
                                </label>
                                <textarea
                                    id="syllabus"
                                    name="syllabus"
                                    value={programData.syllabus}
                                    onChange={handleChange}
                                    className="form-input textarea"
                                    placeholder="Detailed course outline and topics covered"
                                    rows="6"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="learning_outcomes" className="form-label">
                                    Learning Outcomes <span className="required">*</span>
                                </label>
                                <textarea
                                    id="learning_outcomes"
                                    name="learning_outcomes"
                                    value={programData.learning_outcomes}
                                    onChange={handleChange}
                                    className="form-input textarea"
                                    placeholder="What will participants learn? List key outcomes"
                                    rows="4"
                                    required
                                />
                            </div>
                        </div>

                        {/* Pricing & Enrollment */}
                        <div className="form-section">
                            <h3 className="section-title">Pricing & Enrollment</h3>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="price" className="form-label">
                                        Price (USD)
                                    </label>
                                    <div className="input-with-symbol">
                                        <span className="input-symbol">$</span>
                                        <input
                                            type="number"
                                            id="price"
                                            name="price"
                                            value={programData.price}
                                            onChange={handleChange}
                                            className="form-input"
                                            min="0"
                                            step="0.01"
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <small className="form-hint">
                                        Set to 0 for free programs
                                    </small>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="max_enrollment" className="form-label">
                                        Maximum Enrollment
                                    </label>
                                    <input
                                        type="number"
                                        id="max_enrollment"
                                        name="max_enrollment"
                                        value={programData.max_enrollment}
                                        onChange={handleChange}
                                        className="form-input"
                                        min="0"
                                        placeholder="0 for unlimited"
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            name="enrollment_open"
                                            checked={programData.enrollment_open}
                                            onChange={handleChange}
                                            className="checkbox-input"
                                        />
                                        <span className="checkbox-custom"></span>
                                        <span className="checkbox-text">Open for Enrollment</span>
                                    </label>
                                </div>

                                <div className="form-group">
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            name="is_active"
                                            checked={programData.is_active}
                                            onChange={handleChange}
                                            className="checkbox-input"
                                        />
                                        <span className="checkbox-custom"></span>
                                        <span className="checkbox-text">Program Active</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={() => navigate('/programs')}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner"></span>
                                    Creating Program...
                                </>
                            ) : (
                                'Create Program'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateProgram;