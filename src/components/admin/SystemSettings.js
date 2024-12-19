import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';

const SystemSettings = ({ settings, loading, onSave }) => {
  const [formData, setFormData] = useState(settings || {
    maxResumesPerUser: 5,
    enableAIFeatures: true,
    enableNotifications: true,
    maintenanceMode: false,
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  const handleChange = (event) => {
    const { name, value, checked } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: event.target.type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (onSave) {
      setSaving(true);
      setError('');
      setSuccess('');
      try {
        await onSave(formData);
        setSuccess('Settings saved successfully');
      } catch (err) {
        setError(err.message || 'Failed to save settings');
      } finally {
        setSaving(false);
      }
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        System Settings
      </Typography>
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
              {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Max Resumes per User"
                name="maxResumesPerUser"
                type="number"
                value={formData.maxResumesPerUser}
                onChange={handleChange}
                inputProps={{ min: 1 }}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.enableAIFeatures}
                    onChange={handleChange}
                    name="enableAIFeatures"
                    color="primary"
                  />
                }
                label="Enable AI Features"
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.enableNotifications}
                    onChange={handleChange}
                    name="enableNotifications"
                    color="primary"
                  />
                }
                label="Enable Notifications"
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.maintenanceMode}
                    onChange={handleChange}
                    name="maintenanceMode"
                    color="warning"
                  />
                }
                label="Maintenance Mode"
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={saving}
                sx={{ mt: 2 }}
              >
                {saving ? <CircularProgress size={24} /> : 'Save Settings'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default SystemSettings;
