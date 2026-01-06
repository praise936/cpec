// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { isAuthenticated,isAdmin } from './servces/AuthServices';

// Layout Components
import Navbar from './pages/Nav/Navbar';

// Public Pages
import Home from './pages/home/Home';
import Events from './pages/Events/Event';
import Programs from './pages/Programs/Programs';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';

// Admin Pages
import AdminDashboard from './pages/Admin/Dashboard';
import CreateEvent from './pages/Admin/CreateEvent';
import EditEvent from './pages/Admin/EditEvent';
import CreateProgram from './pages/Admin/CreateProgram';
import Users from './pages/Admin/Users';

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const isAuth = isAuthenticated();
  const isUserAdmin = isAdmin();

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isUserAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Admin Layout Component
const AdminLayout = ({ children }) => {
  return (
    <div className="admin-layout">
      <Navbar />
      {children}
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Admin Routes */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute adminOnly>
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </ProtectedRoute>
        } />

        <Route path="/admin/events/create" element={
          <ProtectedRoute adminOnly>
            <AdminLayout>
              <CreateEvent />
            </AdminLayout>
          </ProtectedRoute>
        } />

        <Route path="/admin/events/edit/:id" element={
          <ProtectedRoute adminOnly>
            <AdminLayout>
              <EditEvent />
            </AdminLayout>
          </ProtectedRoute>
        } />

        <Route path="/admin/programs/create" element={
          <ProtectedRoute adminOnly>
            <AdminLayout>
              <CreateProgram />
            </AdminLayout>
          </ProtectedRoute>
        } />

        <Route path="/admin/users" element={
          <ProtectedRoute adminOnly>
            <AdminLayout>
              <Users />
            </AdminLayout>
          </ProtectedRoute>
        } />

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;