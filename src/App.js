import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import Footer from './components/common/Footer';
import LoadingFallback from './components/common/LoadingFallback';
import { AuthProvider } from './contexts/AuthContext';
import { AIProvider } from './context/AIContext';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import theme from './theme';
import './styles/globals.css';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Lazy load components
const LandingPage = React.lazy(() => import('./components/landing/LandingPage'));
const Login = React.lazy(() => import('./components/auth/Login'));
const Registration = React.lazy(() => import('./components/auth/Registration'));
const Dashboard = React.lazy(() => import('./components/dashboard/Dashboard'));
const ResumeForm = React.lazy(() => import('./components/resume/ResumeForm'));
const UserProfile = React.lazy(() => import('./components/profile/UserProfile'));
const TermsOfService = React.lazy(() => import('./components/legal/TermsOfService'));
const PrivacyPolicy = React.lazy(() => import('./components/legal/PrivacyPolicy'));
const GDPRPolicy = React.lazy(() => import('./components/legal/GDPRPolicy'));
const AdminDashboard = React.lazy(() => import('./components/admin/AdminDashboard'));
const MyResumes = React.lazy(() => import('./components/resume/MyResumes'));
const SubscriptionPlans = React.lazy(() => import('./components/subscription/SubscriptionPlans'));
const SubscriptionSuccess = React.lazy(() => import('./components/subscription/SubscriptionSuccess'));

function App() {
  return (
    <AuthProvider>
      <SubscriptionProvider>
        <AIProvider>
          <div className="App">
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <Router>
                <Suspense fallback={<LoadingFallback />}>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      flexDirection: 'column',
                      minHeight: '100vh'
                    }}
                  >
                    <Routes>
                      <Route path="/" element={<LandingPage />} />
                      <Route path="/register" element={<Registration />} />
                      <Route path="/login" element={<Login />} />
                      <Route 
                        path="/dashboard" 
                        element={
                          <ProtectedRoute requiredRole="user">
                            <Dashboard />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/my-resumes" 
                        element={
                          <ProtectedRoute requiredRole="user">
                            <MyResumes />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/create-resume" 
                        element={
                          <ProtectedRoute requiredRole="user">
                            <ResumeForm />
                          </ProtectedRoute>
                        } 
                      />
                      <Route path="/profile" element={<UserProfile />} />
                      <Route path="/terms-of-service" element={<TermsOfService />} />
                      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                      <Route path="/gdpr-policy" element={<GDPRPolicy />} />
                      <Route 
                        path="/admin" 
                        element={
                          <ProtectedRoute requiredRole="admin">
                            <AdminDashboard />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/subscription" 
                        element={
                          <ProtectedRoute requiredRole="user">
                            <SubscriptionPlans />
                          </ProtectedRoute>
                        } 
                      />
                      <Route path="/subscription/success" element={
                        <ProtectedRoute>
                          <SubscriptionSuccess />
                        </ProtectedRoute>
                      } />
                    </Routes>
                    <Footer />
                  </Box>
                </Suspense>
              </Router>
            </ThemeProvider>
          </div>
        </AIProvider>
      </SubscriptionProvider>
    </AuthProvider>
  );
}

export default App;
