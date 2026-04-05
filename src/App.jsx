import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Welcome from './pages/Welcome';
import ClientAuth from './pages/auth/ClientAuth';
import AdminAuth from './pages/auth/AdminAuth';
import ClientDashboard from './pages/dashboard/ClientDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import AdminFeedback from './pages/dashboard/AdminFeedback';
import ClientProfile from './pages/profile/ClientProfile';
import AdminProfile from './pages/profile/AdminProfile';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Welcome />} />
          
          <Route path="/auth/client" element={<ClientAuth />} />
          <Route path="/auth/admin" element={<AdminAuth />} />

          {/* Client Routes */}
          <Route path="/client-dashboard" element={
            <ProtectedRoute allowedRole="client">
              <ClientDashboard />
            </ProtectedRoute>
          } />
          <Route path="/client-profile" element={
            <ProtectedRoute allowedRole="client">
              <ClientProfile />
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin-dashboard" element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin-feedback" element={
            <ProtectedRoute allowedRole="admin">
              <AdminFeedback />
            </ProtectedRoute>
          } />
          <Route path="/admin-profile" element={
            <ProtectedRoute allowedRole="admin">
              <AdminProfile />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
