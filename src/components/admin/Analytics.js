import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Fade,
  Grow,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Analytics = ({ data, loading, onTimeRangeChange }) => {
  const [timeRange, setTimeRange] = useState('week');
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Trigger animation after component mount
    const timer = setTimeout(() => {
      setAnimate(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleTimeRangeChange = (event) => {
    const newRange = event.target.value;
    setTimeRange(newRange);
    setAnimate(false);
    // Reset animation
    setTimeout(() => setAnimate(true), 100);
    if (onTimeRangeChange) {
      onTimeRangeChange(newRange);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  const {
    overview = {
      totalUsers: 0,
      newUsers: 0,
      totalResumes: 0,
      newResumes: 0,
      avgResumesPerUser: 0
    },
    trends = {
      userRegistration: [],
      resumeCreation: []
    },
    distribution = {
      userRoles: [],
      templateUsage: []
    }
  } = data || {};

  const formatNumber = (num) => {
    return num?.toLocaleString() || '0';
  };

  return (
    <Box>
      <Fade in={true} timeout={1000}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          Analytics Dashboard
        </Typography>
      </Fade>

      <Grid container spacing={3}>
        {/* Time Range Selector */}
        <Grid item xs={12}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              label="Time Range"
              onChange={handleTimeRangeChange}
            >
              <MenuItem value="day">Last 24 Hours</MenuItem>
              <MenuItem value="week">Last Week</MenuItem>
              <MenuItem value="month">Last Month</MenuItem>
              <MenuItem value="year">Last Year</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Overview Stats */}
        <Grid item xs={12}>
          <Grow in={animate} timeout={1000}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h6">Total Users</Typography>
                  <Typography variant="h4">{formatNumber(overview.totalUsers)}</Typography>
                  <Typography variant="subtitle2" color="textSecondary">
                    New: +{formatNumber(overview.newUsers)}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h6">Total Resumes</Typography>
                  <Typography variant="h4">{formatNumber(overview.totalResumes)}</Typography>
                  <Typography variant="subtitle2" color="textSecondary">
                    New: +{formatNumber(overview.newResumes)}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h6">Avg. Resumes/User</Typography>
                  <Typography variant="h4">{overview.avgResumesPerUser}</Typography>
                </Paper>
              </Grid>
            </Grid>
          </Grow>
        </Grid>

        {/* User Registration Trend */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              User Registration Trend
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={trends.userRegistration}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Resume Creation Trend */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Resume Creation Trend
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={trends.resumeCreation}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* User Roles Distribution */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              User Roles Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={distribution.userRoles}
                  dataKey="count"
                  nameKey="_id"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {distribution.userRoles.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Template Usage */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Template Usage
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={distribution.templateUsage}
                  dataKey="count"
                  nameKey="_id"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {distribution.templateUsage.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics;
