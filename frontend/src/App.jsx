import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Blank from './pages/Blank';
import AdminPanel from './components/admin/AdminPanel';
import StaffPanel from './components/staff/StaffPanel';
import CustomerPanel from './components/customer/CustomerPanel';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={<Navigate to="/admin" replace />}
        />
        <Route
          path="/staff"
          element={
            <ProtectedRoute>
              <StaffPanel />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff-dashboard"
          element={<Navigate to="/staff" replace />}
        />
        <Route
          path="/customer"
          element={
            <ProtectedRoute>
              <CustomerPanel />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer-dashboard"
          element={<Navigate to="/customer" replace />}
        />
        <Route
          path="/blank"
          element={
            <ProtectedRoute>
              <Blank />
            </ProtectedRoute>
          }
        />
        {/* Default route redirects to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
