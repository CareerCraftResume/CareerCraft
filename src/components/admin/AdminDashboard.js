import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Tab,
  Tabs,
  Button,
  Alert,
  CircularProgress,
  Fade,
} from '@mui/material';
import {
  People as PeopleIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  ExitToApp as ExitToAppIcon,
} from '@mui/icons-material';
import UserManagement from './UserManagement';
import Analytics from './Analytics';
import SystemSettings from './SystemSettings';
import Logo from '../common/Logo';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { currentUser, logout, isAdmin } = useAuth();
  const [selectedTab, setSelectedTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);
  const [settings, setSettings] = useState({});
  const [analytics, setAnalytics] = useState({
    overview: {
      totalUsers: 0,
      newUsers: 0,
      totalResumes: 0,
      newResumes: 0,
      avgResumesPerUser: 0
    },
    trends: {
      userRegistration: [],
      resumeCreation: []
    },
    distribution: {
      userRoles: [],
      templateUsage: []
    }
  });
  const [timeRange, setTimeRange] = useState('week');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [usersRes, settingsRes, analyticsRes] = await Promise.all([
        axios.get('/api/admin/users'),
        axios.get('/api/admin/settings'),
        axios.get(`/api/admin/analytics?timeRange=${timeRange}`),
      ]);

      // Make sure we're getting the users array from the response
      setUsers(usersRes.data.data || []);
      setSettings(settingsRes.data);
      setAnalytics(analyticsRes.data.data || {});
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch data');
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      setError('Failed to log out');
    }
  };

  const handleUpdateUser = async (userId, updates) => {
    try {
      const response = await axios.put(`/api/admin/users/${userId}`, updates);
      setUsers(users.map(user => 
        user.id === userId ? { ...user, ...response.data } : user
      ));
      return true;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to update user');
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`/api/admin/users/${userId}`);
      setUsers(users.filter(user => user.id !== userId));
      return true;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleTimeRangeChange = (newRange) => {
    setTimeRange(newRange);
    fetchData();
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const renderTabContent = () => {
    switch (selectedTab) {
      case 0:
        return (
          <UserManagement
            users={users}
            loading={loading}
            onUpdateUser={handleUpdateUser}
            onDeleteUser={handleDeleteUser}
          />
        );
      case 1:
        return (
          <Analytics
            data={analytics}
            loading={loading}
            onTimeRangeChange={handleTimeRangeChange}
          />
        );
      case 2:
        return (
          <SystemSettings
            settings={settings}
            loading={loading}
            onSave={async (newSettings) => {
              try {
                const response = await axios.put('/api/admin/settings', newSettings);
                setSettings(response.data);
                return true;
              } catch (error) {
                throw new Error(error.response?.data?.message || 'Failed to update settings');
              }
            }}
          />
        );
      default:
        return null;
    }
  };

  if (!isAdmin()) {
    return (
      <Container maxWidth="sm">
        <Alert severity="error">
          You do not have permission to access this page.
        </Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Fade in={true} timeout={1000}>
        <Box>
          {/* Header */}
          <Paper
            elevation={2}
            sx={{
              p: 2,
              mb: 3,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Logo />
              <Typography variant="h5" component="h1">
                Admin Dashboard
              </Typography>
            </Box>
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<ExitToAppIcon />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Paper>

          {/* Main Content */}
          <Container maxWidth="lg">
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Paper sx={{ mb: 3 }}>
              <Tabs
                value={selectedTab}
                onChange={handleTabChange}
                variant="fullWidth"
                indicatorColor="primary"
                textColor="primary"
              >
                <Tab
                  icon={<PeopleIcon />}
                  label="Users"
                  iconPosition="start"
                />
                <Tab
                  icon={<AssessmentIcon />}
                  label="Analytics"
                  iconPosition="start"
                />
                <Tab
                  icon={<SettingsIcon />}
                  label="Settings"
                  iconPosition="start"
                />
              </Tabs>
            </Paper>

            {renderTabContent()}
          </Container>
        </Box>
      </Fade>
    </Box>
  );
};

export default AdminDashboard;
