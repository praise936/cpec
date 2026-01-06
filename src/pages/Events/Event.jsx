// frontend/src/pages/Events/Events.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Nav/Navbar';
import { isAdmin,isAuthenticated,getUserInfo } from '../../servces/AuthServices';
import api from '../../servces/api';
import './events.css';
import eventDefaultImage from '../../assets/feature-1.jpg';

const Events = () => {
    const [user, setUser] = useState(null);
    const [isUserAdmin, setIsUserAdmin] = useState(false);
    const [events, setEvents] = useState([]);
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
            fetchEvents();
        };

        checkAuth();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            setError('');

            const response = await api.get('events/');
            console.log(response);
            

            // Handle different response structures
            let eventsData = [];
            if (Array.isArray(response.data)) {
                eventsData = response.data;
            } else if (response.data?.results) {
                eventsData = response.data.results;
            } else if (response.data?.data) {
                eventsData = response.data.data;
            } else if (response.data?.events) {
                eventsData = response.data.events;
            }

            setEvents(eventsData);
        } catch (error) {
            console.error('Error fetching events:', error);
            setError('Failed to load events. Please try again later.');
            setEvents([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteEvent = async (eventId) => {
        if (!window.confirm('Are you sure you want to delete this event?')) {
            return;
        }

        try {
            await api.delete(`/events/${eventId}/delete/`); 
            setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
        } catch (error) {
            console.error('Error deleting event:', error);
            alert('Error deleting event. Please try again.');
        }
    };

    const handleConfirmAttendance = async (eventId) => {
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            await api.post(`events/${eventId}/attend/`); 

            // Update local state
            setEvents(prevEvents =>
                prevEvents.map(event =>
                    event.id === eventId
                        ? { ...event, user_attending: true }
                        : event
                )
            );

            alert('Attendance confirmed! You have been registered for this event.');
        } catch (error) {
            console.error('Error confirming attendance:', error);
            alert('Error confirming attendance. Please try again.');
        }
    };

    const handleCancelAttendance = async (eventId) => {
        try {
            // You'll need to create an endpoint for this
            await api.delete(`/events/${eventId}/unattend/`);

            setEvents(prevEvents =>
                prevEvents.map(event =>
                    event.id === eventId
                        ? { ...event, user_attending: false }
                        : event
                )
            );

            alert('Attendance cancelled.');
        } catch (error) {
            console.error('Error cancelling attendance:', error);
        }
    };

    const filteredEvents = events.filter(event => {
        if (!event) return false;

        // Search filter
        if (searchTerm && !event.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !event.description.toLowerCase().includes(searchTerm.toLowerCase())) {
            return false;
        }

        // Status filter
        if (filter === 'upcoming') return event.status === 'upcoming';
        if (filter === 'past') return event.status === 'past';
        if (filter === 'ongoing') return event.status === 'ongoing';
        if (filter !== 'all' && event.category !== filter) return false;

        return true;
    });

    const formatDate = (dateString) => {
        if (!dateString) return 'Date TBA';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatTime = (timeString) => {
        if (!timeString) return 'Time TBA';
        return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const categories = [
        { id: 'all', name: 'All Events', icon: '📅' },
        { id: 'upcoming', name: 'Upcoming', icon: '🚀' },
        { id: 'ongoing', name: 'Live Now', icon: '🔴' },
        { id: 'past', name: 'Past Events', icon: '📚' },
        { id: 'Conference', name: 'Conferences', icon: '🎤' },
        { id: 'Workshop', name: 'Workshops', icon: '🛠️' },
        { id: 'Seminar', name: 'Seminars', icon: '🎓' },
        { id: 'Networking', name: 'Networking', icon: '🤝' },
    ];

    const EventCard = ({ event }) => {
        const isAttending = event.user_attending;
        const isFull = event.max_attendees > 0 && event.current_attendees >= event.max_attendees;
        const isPast = event.status === 'past';

        return (
            <div className={`event-card ${isPast ? 'past' : ''}`}>
                <div className="event-header">
                    <div className="event-date">
                        <div className="date-day">
                            {new Date(event.date).getDate()}
                        </div>
                        <div className="date-month">
                            {new Date(event.date).toLocaleString('default', { month: 'short' })}
                        </div>
                    </div>
                    <div className="event-badges">
                        <span className={`event-category ${event.category.toLowerCase()}`}>
                            {event.category}
                        </span>
                        {event.is_free && <span className="badge-free">Free</span>}
                        {event.virtual && <span className="badge-virtual">Virtual</span>}
                        {isFull && <span className="badge-full">Full</span>}
                    </div>
                </div>

                <div className="event-body">
                    <h3 className="event-title">{event.title}</h3>
                    <p className="event-description">{event.description}</p>

                    <div className="event-details">
                        <div className="detail">
                            <span className="detail-icon">📅</span>
                            <span>{formatDate(event.date)}</span>
                        </div>
                        <div className="detail">
                            <span className="detail-icon">⏰</span>
                            <span>{formatTime(event.time)}</span>
                        </div>
                        <div className="detail">
                            <span className="detail-icon">📍</span>
                            <span>{event.virtual ? 'Virtual Event' : event.location}</span>
                        </div>
                        {event.speaker && (
                            <div className="detail">
                                <span className="detail-icon">🎤</span>
                                <span>{event.speaker}</span>
                            </div>
                        )}
                    </div>

                    <div className="event-stats">
                        <div className="stat">
                            <span className="stat-icon">👥</span>
                            <span>{event.current_attendees} attending</span>
                        </div>
                        {event.max_attendees > 0 && (
                            <div className="stat">
                                <span className="stat-icon">🎯</span>
                                <span>{event.max_attendees - event.current_attendees} spots left</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="event-footer">
                    <div className="event-price">
                        {event.is_free ? 'FREE' : `$${event.price}`}
                    </div>

                    <div className="event-actions">
                        {isUserAdmin ? (
                            <>
                                <button
                                    className="btn-edit"
                                    onClick={() => navigate(`/admin/events/edit/${event.id}`)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="btn-delete"
                                    onClick={() => handleDeleteEvent(event.id)}
                                >
                                    Delete
                                </button>
                            </>
                        ) : isPast ? (
                            <button className="btn-past" disabled>
                                Event Ended
                            </button>
                        ) : isAttending ? (
                            <button
                                className="btn-cancel"
                                onClick={() => handleCancelAttendance(event.id)}
                            >
                                Cancel Attendance
                            </button>
                        ) : isFull ? (
                            <button className="btn-full" disabled>
                                Event Full
                            </button>
                        ) : !user ? (
                            <button
                                className="btn-register"
                                onClick={() => navigate('/login')}
                            >
                                Login to Register
                            </button>
                        ) : (
                            <button
                                className="btn-register"
                                onClick={() => handleConfirmAttendance(event.id)}
                            >
                                Register Now
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
                    <p>Loading events...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="events-container">
            <Navbar />

            {/* Hero Section */}
            <section className="events-hero">
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <h1 className="hero-title">Industry Events</h1>
                    <p className="hero-subtitle">
                        Connect with chemical engineering leaders through exclusive events
                    </p>
                    <p className="hero-description">
                        Join conferences, workshops, and networking sessions designed to advance
                        your career and expand your professional network.
                    </p>

                    {isUserAdmin && (
                        <button
                            className="create-event-btn"
                            onClick={() => navigate('/admin/events/create')}
                        >
                            + Create New Event
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
                            placeholder="Search events..."
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

            {/* Events Grid */}
            <section className="events-grid-section">
                <div className="events-header">
                    <h2 className="section-title">
                        {filter === 'all' ? 'All Events' :
                            filter === 'upcoming' ? 'Upcoming Events' :
                                filter === 'past' ? 'Past Events' :
                                    filter === 'ongoing' ? 'Live Events' :
                                        `${filter} Events`}
                    </h2>
                    <p className="events-count">
                        {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'} found
                    </p>
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {filteredEvents.length === 0 ? (
                    <div className="no-events">
                        <div className="no-events-icon">📅</div>
                        <h3>No events found</h3>
                        <p>
                            {searchTerm
                                ? `No events match "${searchTerm}"`
                                : `No ${filter !== 'all' ? filter.toLowerCase() : ''} events available`
                            }
                        </p>
                        {isUserAdmin && (
                            <button
                                className="create-event-btn"
                                onClick={() => navigate('/admin/events/create')}
                            >
                                Create Your First Event
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="events-grid">
                        {filteredEvents.map(event => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>
                )}
            </section>

            {/* CTA Section */}
            <section className="events-cta">
                <div className="cta-content">
                    <h2>Don't Miss Out on Future Events</h2>
                    <p>
                        Stay updated with the latest industry events. Join thousands of
                        chemical engineers who are already advancing their careers through
                        CPEC events.
                    </p>
                    {user ? (
                        <div className="cta-buttons">
                            <button className="cta-btn" onClick={() => setFilter('upcoming')}>
                                View Upcoming Events
                            </button>
                            {!isUserAdmin && (
                                <button className="cta-btn secondary" onClick={() => navigate('/profile')}>
                                    My Event History
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="cta-buttons">
                            <button className="cta-btn" onClick={() => navigate('/register')}>
                                Join CPEC - It's Free
                            </button>
                            <button className="cta-btn secondary" onClick={() => navigate('/login')}>
                                Sign In to Register
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-content">
                    <div className="footer-logo">CPEC Events</div>
                    <p className="footer-subtitle">Connecting Chemical Engineers Worldwide</p>
                    <p className="footer-copyright">
                        © {new Date().getFullYear()} CPEC. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Events;