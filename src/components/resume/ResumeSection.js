import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  IconButton,
  Grid,
  Paper,
  Chip,
  Typography,
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CancelIcon from '@mui/icons-material/Cancel';
import { formatPhoneNumber } from '../../utils/formatters';
import AnimatedTextField from '../common/AnimatedTextField';

const ResumeSection = ({ section, onUpdate, isAutoFilling, onAutoFillComplete }) => {
  // Memoize initial section data
  const initialSectionData = useMemo(() => {
    if (!section) return {};
    
    if (section.id === 'personal') {
      return {
        fullName: section.content.fullName || '',
        email: section.content.email || '',
        phone: section.content.phone || '',
        location: section.content.location || '',
        summary: section.content.summary || ''
      };
    }
    
    return Array.isArray(section.content) ? section.content : [];
  }, [section?.id, section?.content]);

  const [sectionData, setSectionData] = useState(initialSectionData);
  const [newSkill, setNewSkill] = useState('');
  const [completedFields, setCompletedFields] = useState({
    fullName: false,
    email: false
  });

  // Update section data when section changes
  useEffect(() => {
    setSectionData(initialSectionData);
    if (section?.id === 'personal' && section.content && isAutoFilling) {
      setCompletedFields({ fullName: false, email: false });
    }
  }, [initialSectionData, section, isAutoFilling]);

  // Handle animation completion
  const handleAnimationComplete = useCallback((field) => {
    setCompletedFields(prev => {
      const updated = { ...prev, [field]: true };
      // Only trigger parent update when both fields are complete
      if (updated.fullName && updated.email) {
        onAutoFillComplete?.();
      }
      return updated;
    });
  }, [onAutoFillComplete]);

  // Memoize handlers
  const handlePersonalInfoChange = useCallback((field, value) => {
    let processedValue = value;
    
    if (field === 'phone') {
      processedValue = formatPhoneNumber(value);
    }
    
    const updatedData = { ...sectionData, [field]: processedValue };
    setSectionData(updatedData);
    
    // Only update parent if not auto-filling or if this is not an animated field
    if (!isAutoFilling || (field !== 'fullName' && field !== 'email')) {
      onUpdate(updatedData);
    }
  }, [sectionData, onUpdate, isAutoFilling]);

  const handleExperienceAdd = useCallback(() => {
    const newExperience = {
      id: Date.now(),
      company: '',
      title: '',
      startDate: null,
      endDate: null,
      description: '',
    };
    
    const updatedData = Array.isArray(sectionData) ? [...sectionData, newExperience] : [newExperience];
    setSectionData(updatedData);
    onUpdate(updatedData);
  }, [sectionData, onUpdate]);

  const handleExperienceUpdate = useCallback((id, field, value) => {
    const updatedData = sectionData.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    );
    setSectionData(updatedData);
    onUpdate(updatedData);
  }, [sectionData, onUpdate]);

  const handleExperienceDelete = useCallback((id) => {
    const updatedData = sectionData.filter(exp => exp.id !== id);
    setSectionData(updatedData);
    onUpdate(updatedData);
  }, [sectionData, onUpdate]);

  const handleEducationAdd = useCallback(() => {
    const newEducation = {
      id: Date.now(),
      school: '',
      degree: '',
      field: '',
      startDate: null,
      endDate: null,
    };
    
    const updatedData = Array.isArray(sectionData) ? [...sectionData, newEducation] : [newEducation];
    setSectionData(updatedData);
    onUpdate(updatedData);
  }, [sectionData, onUpdate]);

  const handleEducationUpdate = useCallback((id, field, value) => {
    const updatedData = sectionData.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    );
    setSectionData(updatedData);
    onUpdate(updatedData);
  }, [sectionData, onUpdate]);

  const handleEducationDelete = useCallback((id) => {
    const updatedData = sectionData.filter(edu => edu.id !== id);
    setSectionData(updatedData);
    onUpdate(updatedData);
  }, [sectionData, onUpdate]);

  const handleSkillAdd = useCallback(() => {
    if (!newSkill.trim()) return;
    
    const updatedData = Array.isArray(sectionData) 
      ? [...sectionData, { name: newSkill.trim() }] 
      : [{ name: newSkill.trim() }];
    setSectionData(updatedData);
    onUpdate(updatedData);
    setNewSkill('');
  }, [newSkill, sectionData, onUpdate]);

  const handleSkillDelete = useCallback((skillToDelete) => {
    const updatedData = sectionData.filter(skill => skill.name !== skillToDelete);
    setSectionData(updatedData);
    onUpdate(updatedData);
  }, [sectionData, onUpdate]);

  // Render different section types
  if (section.id === 'personal') {
    return (
      <Box component="form" noValidate autoComplete="off">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <AnimatedTextField
              fullWidth
              label="Full Name"
              value={sectionData.fullName || ''}
              finalValue={section?.content.fullName}
              isAnimating={isAutoFilling}
              onChange={(value) => handlePersonalInfoChange('fullName', value)}
              onAnimationComplete={() => handleAnimationComplete('fullName')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <AnimatedTextField
              fullWidth
              label="Email"
              type="email"
              value={sectionData.email || ''}
              finalValue={section?.content.email}
              isAnimating={isAutoFilling}
              onChange={(value) => handlePersonalInfoChange('email', value)}
              onAnimationComplete={() => handleAnimationComplete('email')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone"
              value={sectionData.phone || ''}
              onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Location"
              value={sectionData.location || ''}
              onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Professional Summary"
              multiline
              rows={4}
              value={sectionData.summary || ''}
              onChange={(e) => handlePersonalInfoChange('summary', e.target.value)}
            />
          </Grid>
        </Grid>
      </Box>
    );
  }

  if (section.id === 'experience') {
    return (
      <Box>
        {sectionData.map((exp, index) => (
          <Paper key={exp.id} elevation={1} sx={{ p: 2, mb: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={11}>
                <Typography variant="h6">Experience {index + 1}</Typography>
              </Grid>
              <Grid item xs={1}>
                <IconButton onClick={() => handleExperienceDelete(exp.id)}>
                  <DeleteIcon />
                </IconButton>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Company"
                  value={exp.company || ''}
                  onChange={(e) => handleExperienceUpdate(exp.id, 'company', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Title"
                  value={exp.title || ''}
                  onChange={(e) => handleExperienceUpdate(exp.id, 'title', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Start Date"
                    value={exp.startDate}
                    onChange={(date) => handleExperienceUpdate(exp.id, 'startDate', date)}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="End Date"
                    value={exp.endDate}
                    onChange={(date) => handleExperienceUpdate(exp.id, 'endDate', date)}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={4}
                  value={exp.description || ''}
                  onChange={(e) => handleExperienceUpdate(exp.id, 'description', e.target.value)}
                />
              </Grid>
            </Grid>
          </Paper>
        ))}
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleExperienceAdd}
          sx={{ mt: 2 }}
        >
          Add Experience
        </Button>
      </Box>
    );
  }

  if (section.id === 'education') {
    return (
      <Box>
        {sectionData.map((edu, index) => (
          <Paper key={edu.id} elevation={1} sx={{ p: 2, mb: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={11}>
                <Typography variant="h6">Education {index + 1}</Typography>
              </Grid>
              <Grid item xs={1}>
                <IconButton onClick={() => handleEducationDelete(edu.id)}>
                  <DeleteIcon />
                </IconButton>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="School"
                  value={edu.school || ''}
                  onChange={(e) => handleEducationUpdate(edu.id, 'school', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Degree"
                  value={edu.degree || ''}
                  onChange={(e) => handleEducationUpdate(edu.id, 'degree', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Field of Study"
                  value={edu.field || ''}
                  onChange={(e) => handleEducationUpdate(edu.id, 'field', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Start Date"
                    value={edu.startDate}
                    onChange={(date) => handleEducationUpdate(edu.id, 'startDate', date)}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="End Date"
                    value={edu.endDate}
                    onChange={(date) => handleEducationUpdate(edu.id, 'endDate', date)}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
          </Paper>
        ))}
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleEducationAdd}
          sx={{ mt: 2 }}
        >
          Add Education
        </Button>
      </Box>
    );
  }

  if (section.id === 'skills') {
    return (
      <Box>
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <TextField
            fullWidth
            label="Add Skill"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSkillAdd();
              }
            }}
          />
          <Button
            variant="contained"
            onClick={handleSkillAdd}
            disabled={!newSkill.trim()}
          >
            Add
          </Button>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {Array.isArray(sectionData) && sectionData.map((skill, index) => (
            <Chip
              key={index}
              label={skill.name}
              onDelete={() => handleSkillDelete(skill.name)}
              color="primary"
              variant="outlined"
            />
          ))}
        </Box>
      </Box>
    );
  }

  return null;
};

export default React.memo(ResumeSection);
