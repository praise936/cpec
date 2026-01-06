// frontend/src/pages/Admin/CreateEvent.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Nav/Navbar';
import api from '../../servces/api';
import './createEvent.css';

const CreateEvent = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [eventData, setEventData] = useState({
        title: '',
        description: '',
        category: 'Conference',
        date: '',
        time: '',
        end_date: '',
        end_time: '',
        location: '',
        virtual: false,
        virtual_link: '',
        speaker: '',
        speaker_title: '',
        price: '0',
        max_attendees: '0',
        image: null
    });

    const categories = [
        'Conference', 'Workshop', 'Seminar', 'Forum',
        'Training', 'Networking', 'Awards', 'Other'
    ];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEventData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFileChange = (e) => {
        setEventData(prev => ({
            ...prev,
            image: e.target.files[0]
        }));
    };

    const validateForm = () => {
        if (!eventData.title.trim()) {
            return 'Event title is required';
        }
        if (!eventData.description.trim()) {
            return 'Event description is required';
        }
        if (!eventData.date) {
            return 'Event date is required';
        }
        if (!eventData.time) {
            return 'Event time is required';
        }
        if (!eventData.location.trim() && !eventData.virtual) {
            return 'Location is required for in-person events';
        }
        if (eventData.virtual && !eventData.virtual_link.trim()) {
            return 'Virtual link is required for virtual events';
        }
        if (parseFloat(eventData.price) < 0) {
            return 'Price cannot be negative';
        }
        if (parseInt(eventData.max_attendees) < 0) {
            return 'Maximum attendees cannot be negative';
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
            Object.keys(eventData).forEach(key => {
                if (key === 'image') {
                    if (eventData.image) {
                        formData.append(key, eventData.image);
                    }
                } else {
                    formData.append(key, eventData[key]);
                }
            });

            // Convert price to decimal
            formData.set('price', parseFloat(eventData.price).toFixed(2));
            formData.set('max_attendees', parseInt(eventData.max_attendees));

            // Make API call
            const response = await api.post('events/create/', formData);

            setSuccess('Event created successfully! Redirecting...');

            // Reset form
            setEventData({
                title: '',
                description: '',
                category: 'Conference',
                date: '',
                time: '',
                end_date: '',
                end_time: '',
                location: '',
                virtual: false,
                virtual_link: '',
                speaker: '',
                speaker_title: '',
                price: '0',
                max_attendees: '0',
                image: null
            });

            // Redirect to events page
            setTimeout(() => navigate('/events'), 2000);

        } catch (error) {
            console.error('Error creating event:', error);

            if (error.response?.data) {
                // Handle validation errors from backend
                const errors = error.response.data;
                let errorMessage = 'Error creating event. ';

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
                setError('Error creating event. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-event-container">
            {/* <Navbar /> */}

            <div className="create-event-content">
                <div className="create-event-header">
                    <h1 className="page-title">Create New Event</h1>
                    <p className="page-subtitle">
                        Fill in the details below to create an exciting new event for the CPEC community
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

                <form onSubmit={handleSubmit} className="create-event-form">
                    <div className="form-grid">
                        {/* Basic Information */}
                        <div className="form-section">
                            <h3 className="section-title">Basic Information</h3>

                            <div className="form-group">
                                <label htmlFor="title" className="form-label">
                                    Event Title <span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={eventData.title}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="Enter an engaging event title"
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
                                    value={eventData.description}
                                    onChange={handleChange}
                                    className="form-input textarea"
                                    placeholder="Describe your event in detail. What will attendees learn? Who should attend?"
                                    rows="4"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="category" className="form-label">
                                    Category <span className="required">*</span>
                                </label>
                                <select
                                    id="category"
                                    name="category"
                                    value={eventData.category}
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
                                <label htmlFor="image" className="form-label">
                                    Event Image
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

                        {/* Date & Time */}
                        <div className="form-section">
                            <h3 className="section-title">Date & Time</h3>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="date" className="form-label">
                                        Start Date <span className="required">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        id="date"
                                        name="date"
                                        value={eventData.date}
                                        onChange={handleChange}
                                        className="form-input"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="time" className="form-label">
                                        Start Time <span className="required">*</span>
                                    </label>
                                    <input
                                        type="time"
                                        id="time"
                                        name="time"
                                        value={eventData.time}
                                        onChange={handleChange}
                                        className="form-input"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="end_date" className="form-label">
                                        End Date (Optional)
                                    </label>
                                    <input
                                        type="date"
                                        id="end_date"
                                        name="end_date"
                                        value={eventData.end_date}
                                        onChange={handleChange}
                                        className="form-input"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="end_time" className="form-label">
                                        End Time (Optional)
                                    </label>
                                    <input
                                        type="time"
                                        id="end_time"
                                        name="end_time"
                                        value={eventData.end_time}
                                        onChange={handleChange}
                                        className="form-input"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Location */}
                        <div className="form-section">
                            <h3 className="section-title">Location</h3>

                            <div className="form-group">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="virtual"
                                        checked={eventData.virtual}
                                        onChange={handleChange}
                                        className="checkbox-input"
                                    />
                                    <span className="checkbox-custom"></span>
                                    <span className="checkbox-text">Virtual/Online Event</span>
                                </label>
                            </div>

                            {!eventData.virtual ? (
                                <div className="form-group">
                                    <label htmlFor="location" className="form-label">
                                        Venue Location <span className="required">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="location"
                                        name="location"
                                        value={eventData.location}
                                        onChange={handleChange}
                                        className="form-input"
                                        placeholder="Enter venue name and address"
                                        required={!eventData.virtual}
                                    />
                                </div>
                            ) : (
                                <div className="form-group">
                                    <label htmlFor="virtual_link" className="form-label">
                                        Meeting Link <span className="required">*</span>
                                    </label>
                                    <input
                                        type="url"
                                        id="virtual_link"
                                        name="virtual_link"
                                        value={eventData.virtual_link}
                                        onChange={handleChange}
                                        className="form-input"
                                        placeholder="https://meet.example.com/event"
                                        required={eventData.virtual}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Speaker Information */}
                        <div className="form-section">
                            <h3 className="section-title">Speaker Information (Optional)</h3>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="speaker" className="form-label">
                                        Speaker Name
                                    </label>
                                    <input
                                        type="text"
                                        id="speaker"
                                        name="speaker"
                                        value={eventData.speaker}
                                        onChange={handleChange}
                                        className="form-input"
                                        placeholder="Full name"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="speaker_title" className="form-label">
                                        Speaker Title
                                    </label>
                                    <input
                                        type="text"
                                        id="speaker_title"
                                        name="speaker_title"
                                        value={eventData.speaker_title}
                                        onChange={handleChange}
                                        className="form-input"
                                        placeholder="Position/Company"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Pricing & Capacity */}
                        <div className="form-section">
                            <h3 className="section-title">Pricing & Capacity</h3>

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
                                            value={eventData.price}
                                            onChange={handleChange}
                                            className="form-input"
                                            min="0"
                                            step="0.01"
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <small className="form-hint">
                                        Set to 0 for free events
                                    </small>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="max_attendees" className="form-label">
                                        Maximum Attendees
                                    </label>
                                    <input
                                        type="number"
                                        id="max_attendees"
                                        name="max_attendees"
                                        value={eventData.max_attendees}
                                        onChange={handleChange}
                                        className="form-input"
                                        min="0"
                                        placeholder="0 for unlimited"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={() => navigate('/events')}
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
                                    Creating Event...
                                </>
                            ) : (
                                'Create Event'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateEvent;