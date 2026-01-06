// import React, { useState, useEffect } from 'react';
// import './events.css';
// import Navbar from '../Nav/Navbar';
// import { isAdmin, isAuthenticated, getUserInfo } from '../../servces/authservices';
// import api from '../../servces/api';

// const Events = () => {
//     const [user, setUser] = useState(null);
//     const [isUserAdmin, setIsUserAdmin] = useState(false);
//     const [events, setEvents] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [filter, setFilter] = useState('all');

//     // Check authentication on component mount
//     useEffect(() => {
//         const checkAuth = () => {
//             if (isAuthenticated()) {
//                 const userInfo = getUserInfo();
//                 setUser(userInfo);
//                 const adminStatus = isAdmin();
//                 setIsUserAdmin(adminStatus);
//             }
//             // Fetch events data (will later come from backend)
//             fetchEvents();
//         };

//         checkAuth();
//     }, []);

//     // This function will later be replaced with actual API call
//     const fetchEvents = async () => {
//         try {
//             // For now, use mock data. Later: await api.get('events/')
//             const mockEvents = [
//                 {
//                     id: 1,
//                     title: 'Annual Chemical Process Engineering Conference',
//                     description: 'The largest gathering of chemical process engineers in the region.',
//                     category: 'Conference',
//                     date: '2024-04-15',
//                     time: '09:00 AM',
//                     end_date: '2024-04-17',
//                     end_time: '05:00 PM',
//                     location: 'San Francisco Convention Center',
//                     virtual: false,
//                     virtual_link: null,
//                     speaker: 'Dr. Michael Anderson',
//                     speaker_title: 'Chief Technology Officer, Global ChemTech',
//                     price: '$299',
//                     is_free: false,
//                     status: 'upcoming',
//                     created_by: 'Admin',
//                     created_at: '2024-01-10'
//                 },
//                 {
//                     id: 2,
//                     title: 'Process Safety Workshop Series',
//                     description: 'Hands-on workshop series covering HAZOP studies and process safety management.',
//                     category: 'Workshop',
//                     date: '2024-03-22',
//                     time: '10:00 AM',
//                     end_date: '2024-03-22',
//                     end_time: '04:00 PM',
//                     location: 'Virtual Event',
//                     virtual: true,
//                     virtual_link: 'https://meet.cpec.org/process-safety',
//                     speaker: 'Sarah Johnson',
//                     speaker_title: 'Senior Safety Engineer',
//                     price: 'Free',
//                     is_free: true,
//                     status: 'upcoming',
//                     created_by: 'Admin',
//                     created_at: '2024-01-15'
//                 },
//                 {
//                     id: 3,
//                     title: 'AI in Chemical Process Optimization',
//                     description: 'Explore how artificial intelligence is revolutionizing process optimization.',
//                     category: 'Seminar',
//                     date: '2024-03-05',
//                     time: '02:00 PM',
//                     end_date: '2024-03-05',
//                     end_time: '04:00 PM',
//                     location: 'Online Webinar',
//                     virtual: true,
//                     virtual_link: 'https://meet.cpec.org/ai-optimization',
//                     speaker: 'Dr. Robert Kim',
//                     speaker_title: 'AI Research Lead, ProcessAI Labs',
//                     price: '$49',
//                     is_free: false,
//                     status: 'upcoming',
//                     created_by: 'Admin',
//                     created_at: '2024-01-20'
//                 },
//                 {
//                     id: 4,
//                     title: 'Sustainable Chemical Manufacturing Forum',
//                     description: 'Panel discussion on green chemistry and sustainable manufacturing practices.',
//                     category: 'Forum',
//                     date: '2024-05-10',
//                     time: '01:00 PM',
//                     end_date: '2024-05-10',
//                     end_time: '03:00 PM',
//                     location: 'Chicago Engineering Hub',
//                     virtual: false,
//                     virtual_link: null,
//                     speaker: 'Panel of Industry Experts',
//                     speaker_title: 'Various Companies',
//                     price: '$99',
//                     is_free: false,
//                     status: 'upcoming',
//                     created_by: 'Admin',
//                     created_at: '2024-02-01'
//                 },
//                 {
//                     id: 5,
//                     title: 'Chemical Reactor Design Masterclass',
//                     description: 'Advanced training on reactor design, scale-up, and troubleshooting techniques.',
//                     category: 'Training',
//                     date: '2024-04-02',
//                     time: '09:30 AM',
//                     end_date: '2024-04-04',
//                     end_time: '05:00 PM',
//                     location: 'Houston Training Center',
//                     virtual: false,
//                     virtual_link: null,
//                     speaker: 'Prof. James Wilson',
//                     speaker_title: 'Reactor Design Specialist',
//                     price: '$799',
//                     is_free: false,
//                     status: 'upcoming',
//                     created_by: 'Admin',
//                     created_at: '2024-02-05'
//                 },
//                 {
//                     id: 6,
//                     title: 'Process Control Networking Mixer',
//                     description: 'Networking event for process control engineers to connect and share experiences.',
//                     category: 'Networking',
//                     date: '2024-03-15',
//                     time: '06:00 PM',
//                     end_date: '2024-03-15',
//                     end_time: '09:00 PM',
//                     location: 'New York City Tech Hub',
//                     virtual: false,
//                     virtual_link: null,
//                     speaker: 'Various Industry Professionals',
//                     speaker_title: 'Networking Event',
//                     price: 'Free',
//                     is_free: true,
//                     status: 'upcoming',
//                     created_by: 'Admin',
//                     created_at: '2024-02-10'
//                 },
//                 {
//                     id: 7,
//                     title: '2023 Chemical Engineering Innovation Awards',
//                     description: 'Annual awards ceremony recognizing innovation in chemical engineering.',
//                     category: 'Awards',
//                     date: '2023-12-05',
//                     time: '07:00 PM',
//                     end_date: '2023-12-05',
//                     end_time: '10:00 PM',
//                     location: 'Los Angeles Convention Center',
//                     virtual: true,
//                     virtual_link: 'https://meet.cpec.org/awards-2023',
//                     speaker: 'Various',
//                     speaker_title: 'Award Ceremony',
//                     price: '$199',
//                     is_free: false,
//                     status: 'past',
//                     created_by: 'Admin',
//                     created_at: '2023-10-15'
//                 }
//             ];

//             setEvents(mockEvents);
//         } catch (error) {
//             console.error('Error fetching events:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Filter events based on selected category
//     const filteredEvents = events.filter(event => {
//         if (filter === 'all') return true;
//         if (filter === 'upcoming') return event.status === 'upcoming';
//         if (filter === 'past') return event.status === 'past';
//         return event.category === filter;
//     });

//     // Event categories
//     const categories = [
//         { id: 'all', name: 'All Events' },
//         { id: 'upcoming', name: 'Upcoming' },
//         { id: 'past', name: 'Past Events' }
//     ];

//     // Format date for display
//     const formatDate = (dateString) => {
//         const options = { month: 'short', day: 'numeric', year: 'numeric' };
//         return new Date(dateString).toLocaleDateString('en-US', options);
//     };

//     // Registration button based on user status and event status
//     const RegistrationButton = ({ event }) => {
//         if (event.status === 'past') {
//             return (
//                 <button className="event-btn past" disabled>
//                     Event Ended
//                 </button>
//             );
//         }

//         if (!user) {
//             return (
//                 <a href="/register" className="event-btn">
//                     Register to Attend
//                 </a>
//             );
//         }

//         if (isUserAdmin) {
//             return (
//                 <div className="event-admin-actions">
//                     <button className="event-edit-btn">Edit</button>
//                     <button className="event-delete-btn">Delete</button>
//                 </div>
//             );
//         }

//         return (
//             <button className="event-btn">
//                 Register Now
//             </button>
//         );
//     };

//     if (loading) {
//         return (
//             <div className="events-container">
//                 <Navbar />
//                 <div className="loading-container">
//                     <div className="loading-spinner"></div>
//                     <p>Loading events...</p>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="events-container">
//             <Navbar />

//             {/* Hero Section */}
//             <section className="events-hero">
//                 <div className="events-hero-content">
//                     <h1>Industry Events & Conferences</h1>
//                     <p className="events-subtitle">
//                         Connect, learn, and network with chemical engineering professionals
//                     </p>
//                     <p className="events-description">
//                         {isUserAdmin
//                             ? "Manage all CPEC events, conferences, and networking sessions."
//                             : user
//                                 ? "Stay updated with the latest industry events and expand your professional network."
//                                 : "Browse our events calendar. Register to attend workshops, conferences, and networking sessions."
//                         }
//                     </p>

//                     {/* Admin actions */}
//                     {isUserAdmin && (
//                         <div className="admin-actions">
//                             <a href="/admin/events/create" className="admin-action-btn">
//                                 + Create New Event
//                             </a>
//                         </div>
//                     )}
//                 </div>
//             </section>

//             {/* Filter Section */}
//             <section className="events-filter">
//                 <div className="filter-container">
//                     <div className="filter-categories">
//                         {categories.map(category => (
//                             <button
//                                 key={category.id}
//                                 className={`category-btn ${filter === category.id ? 'active' : ''}`}
//                                 onClick={() => setFilter(category.id)}
//                             >
//                                 {category.name}
//                             </button>
//                         ))}
//                     </div>
//                 </div>
//             </section>

//             {/* Events Grid */}
//             <section className="all-events">
//                 <div className="events-header">
//                     <h2 className="section-title">
//                         {filter === 'upcoming' ? 'Upcoming Events' :
//                             filter === 'past' ? 'Past Events' : 'All Events'}
//                     </h2>
//                     <p className="section-subtitle">
//                         Showing {filteredEvents.length} of {events.length} events
//                     </p>
//                 </div>

//                 {filteredEvents.length === 0 ? (
//                     <div className="no-events">
//                         <p>No events found.</p>
//                         {isUserAdmin && (
//                             <a href="/admin/events/create" className="create-event-btn">
//                                 Create your first event
//                             </a>
//                         )}
//                     </div>
//                 ) : (
//                     <div className="events-grid">
//                         {filteredEvents.map(event => (
//                             <div key={event.id} className="event-card">
//                                 <div className="event-card-header">
//                                     <div className="event-date-badge">
//                                         <span className="date-month">
//                                             {new Date(event.date).toLocaleString('default', { month: 'short' })}
//                                         </span>
//                                         <span className="date-day">
//                                             {new Date(event.date).getDate()}
//                                         </span>
//                                     </div>
//                                     <div className="event-type-badges">
//                                         <span className={`event-type ${event.category.toLowerCase()}`}>
//                                             {event.category}
//                                         </span>
//                                         {event.is_free && (
//                                             <span className="free-badge">Free</span>
//                                         )}
//                                         {event.virtual && (
//                                             <span className="virtual-badge">Virtual</span>
//                                         )}
//                                     </div>
//                                 </div>

//                                 <div className="event-card-body">
//                                     <h3>{event.title}</h3>
//                                     <p className="event-description">{event.description}</p>

//                                     <div className="event-details">
//                                         <div className="detail-item">
//                                             <span className="detail-label">Date:</span>
//                                             <span className="detail-value">{formatDate(event.date)}</span>
//                                         </div>
//                                         <div className="detail-item">
//                                             <span className="detail-label">Time:</span>
//                                             <span className="detail-value">{event.time}</span>
//                                         </div>
//                                         <div className="detail-item">
//                                             <span className="detail-label">Location:</span>
//                                             <span className="detail-value">
//                                                 {event.virtual ? 'Virtual' : event.location}
//                                             </span>
//                                         </div>
//                                     </div>

//                                     <div className="event-footer">
//                                         <div className="event-price">
//                                             {event.is_free ? 'Free' : event.price}
//                                         </div>
//                                         <RegistrationButton event={event} />
//                                     </div>

//                                     {/* Admin info (only visible to admins) */}
//                                     {isUserAdmin && (
//                                         <div className="admin-info">
//                                             <small>
//                                                 Created by: {event.created_by} on {event.created_at}
//                                             </small>
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 )}
//             </section>

//             {/* Call to Action */}
//             <section className="events-cta">
//                 <div className="cta-content">
//                     {user ? (
//                         <>
//                             <h2>Stay Connected with Industry Events</h2>
//                             <p>Register for upcoming events to expand your network and knowledge.</p>
//                             <a href="/events" className="cta-button">Browse All Events</a>
//                         </>
//                     ) : (
//                         <>
//                             <h2>Join CPEC to Attend Events</h2>
//                             <p>Register now to access all our industry events and networking opportunities.</p>
//                             <a href="/register" className="cta-button">Register Now</a>
//                         </>
//                     )}
//                 </div>
//             </section>

//             {/* Footer */}
//             <footer className="footer">
//                 <div className="footer-content">
//                     <div className="footer-logo">CPEC</div>
//                     <p className="footer-subtitle">ChemProcess Engineers Connect</p>
//                     <div className="footer-links">
//                         <a href="/" className="footer-link">Home</a>
//                         <a href="/programs" className="footer-link">Programs</a>
//                         <a href="/about" className="footer-link">About</a>
//                         <a href="/contact" className="footer-link">Contact</a>
//                     </div>
//                     <p className="footer-copyright">
//                         © {new Date().getFullYear()} CPEC - Industry Events Calendar
//                     </p>
//                 </div>
//             </footer>
//         </div>
//     );
// };

// export default Events;