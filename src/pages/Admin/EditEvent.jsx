// frontend/src/Admin/EditEvent.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../Nav/Navbar';
import './createEvent.css'; // Reuse the same CSS
import api from '../../servces/api';

const EditEvent = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
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
        is_free: false,
        status: 'upcoming'
    });

    const categories = [
        'Conference', 'Workshop', 'Seminar', 'Forum',
        'Training', 'Networking', 'Awards', 'Other'
    ];

    useEffect(() => {
        fetchEventDetails();
    }, [id]);

    const fetchEventDetails = async () => {
        try {
            // ENDPOINT: GET /api/events/{id}/ - Get specific event details
            const response = await api.get(`/events/${id}/`,)
            console.log(response);
            
        } catch (error) {
            console.error('Error fetching event:', error);
            setError('Failed to load event details');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEventData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccess('');

        try {
            // ENDPOINT: PUT /api/events/{id}/ - Update event
            const response = await api.put(`/events/${id}/update/`, eventData );
            setSuccess('Event updated successfully!');
            setTimeout(() => navigate('/events'), 2000);
            console.log(response);
            
        } catch (error) {
            setError('Error updating event. Please try again.');
            console.error('Update event error:', error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="create-event-container">
                <Navbar />
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading event details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="create-event-container">
            <Navbar />

            <div className="create-event-content">
                <div className="create-event-header">
                    <h1>Edit Event</h1>
                    <p>Update the event details below</p>
                </div>

                {error && (
                    <div className="alert alert-error">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="alert alert-success">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="create-event-form">
                    <div className="form-grid">
                        {/* Event Title */}
                        <div className="form-group">
                            <label htmlFor="title">Event Title *</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={eventData.title}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Category */}
                        <div className="form-group">
                            <label htmlFor="category">Category *</label>
                            <select
                                id="category"
                                name="category"
                                value={eventData.category}
                                onChange={handleChange}
                                required
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        {/* Date and Time */}
                        <div className="form-group">
                            <label htmlFor="date">Start Date *</label>
                            <input
                                type="date"
                                id="date"
                                name="date"
                                value={eventData.date}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="time">Start Time *</label>
                            <input
                                type="time"
                                id="time"
                                name="time"
                                value={eventData.time}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="end_date">End Date</label>
                            <input
                                type="date"
                                id="end_date"
                                name="end_date"
                                value={eventData.end_date}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="end_time">End Time</label>
                            <input
                                type="time"
                                id="end_time"
                                name="end_time"
                                value={eventData.end_time}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Location */}
                        <div className="form-group full-width">
                            <label htmlFor="location">Location *</label>
                            <input
                                type="text"
                                id="location"
                                name="location"
                                value={eventData.location}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Virtual Event */}
                        <div className="form-group checkbox-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    name="virtual"
                                    checked={eventData.virtual}
                                    onChange={handleChange}
                                />
                                <span>Virtual/Online Event</span>
                            </label>
                        </div>

                        {eventData.virtual && (
                            <div className="form-group full-width">
                                <label htmlFor="virtual_link">Virtual Meeting Link</label>
                                <input
                                    type="url"
                                    id="virtual_link"
                                    name="virtual_link"
                                    value={eventData.virtual_link}
                                    onChange={handleChange}
                                />
                            </div>
                        )}

                        {/* Description */}
                        <div className="form-group full-width">
                            <label htmlFor="description">Description *</label>
                            <textarea
                                id="description"
                                name="description"
                                value={eventData.description}
                                onChange={handleChange}
                                required
                                rows="4"
                            />
                        </div>

                        {/* Speaker Information */}
                        <div className="form-group">
                            <label htmlFor="speaker">Speaker Name</label>
                            <input
                                type="text"
                                id="speaker"
                                name="speaker"
                                value={eventData.speaker}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="speaker_title">Speaker Title</label>
                            <input
                                type="text"
                                id="speaker_title"
                                name="speaker_title"
                                value={eventData.speaker_title}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Pricing */}
                        <div className="form-group">
                            <label htmlFor="price">Price (USD)</label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                value={eventData.price}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                            />
                        </div>

                        <div className="form-group checkbox-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    name="is_free"
                                    checked={eventData.is_free}
                                    onChange={handleChange}
                                />
                                <span>Free Event</span>
                            </label>
                        </div>

                        {/* Status */}
                        <div className="form-group">
                            <label htmlFor="status">Status</label>
                            <select
                                id="status"
                                name="status"
                                value={eventData.status}
                                onChange={handleChange}
                            >
                                <option value="upcoming">Upcoming</option>
                                <option value="ongoing">Ongoing</option>
                                <option value="past">Past</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={() => navigate('/events')}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={saving}
                        >
                            {saving ? 'Saving Changes...' : 'Update Event'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditEvent;