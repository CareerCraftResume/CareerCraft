import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from '../components/PrivateRoute';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import ResumeBuilder from '../pages/ResumeBuilder';
import Templates from '../pages/Templates';
import Pricing from '../pages/Pricing';
import Account from '../pages/Account';
import SubscriptionSuccess from '../pages/SubscriptionSuccess';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/subscription/success" element={<SubscriptionSuccess />} />
      
      {/* Protected Routes */}
      <Route path="/dashboard" element={
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      } />
      <Route path="/resume-builder" element={
        <PrivateRoute>
          <ResumeBuilder />
        </PrivateRoute>
      } />
      <Route path="/templates" element={
        <PrivateRoute>
          <Templates />
        </PrivateRoute>
      } />
      <Route path="/account" element={
        <PrivateRoute>
          <Account />
        </PrivateRoute>
      } />
      
      {/* Redirect root to dashboard if logged in, otherwise to login */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
