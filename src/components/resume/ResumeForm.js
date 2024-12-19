import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Box,
  Button,
  Grid
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAI } from '../../context/AIContext';
import { useAuth } from '../../contexts/AuthContext';
import AISuggestions from '../ai/AISuggestions';
import ResumeSection from './ResumeSection';
import PreviewMode from './PreviewMode';

const ResumeForm = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { analyzeResume } = useAI();
  const [activeStep, setActiveStep] = useState(0);
  const [isPreview, setIsPreview] = useState(false);
  const [isAutoFilling, setIsAutoFilling] = useState(false);
  
  // Initialize sections with empty values
  const [sections, setSections] = useState(() => {
    const storedUser = JSON.parse(localStorage.getItem('user')) || {};
    
    return [
      { 
        id: 'personal', 
        title: 'Personal Information', 
        content: {
          fullName: storedUser.firstName && storedUser.lastName 
            ? `${storedUser.firstName} ${storedUser.lastName}`
            : '',
          email: storedUser.email || '',
          phone: '',
          location: '',
          summary: ''
        }
      },
      { 
        id: 'experience', 
        title: 'Experience', 
        content: [] 
      },
      { 
        id: 'education', 
        title: 'Education', 
        content: [] 
      },
      { 
        id: 'skills', 
        title: 'Skills', 
        content: [] 
      }
    ];
  });

  // Update user information when currentUser changes
  useEffect(() => {
    if (!currentUser) return;

    const storedUser = JSON.parse(localStorage.getItem('user')) || {};
    setIsAutoFilling(true);
    
    setSections(prevSections => prevSections.map(section => {
      if (section.id === 'personal') {
        const fullName = storedUser.firstName && storedUser.lastName 
          ? `${storedUser.firstName} ${storedUser.lastName}`
          : section.content.fullName;
          
        const email = currentUser.email || storedUser.email || section.content.email;
        
        return {
          ...section,
          content: {
            ...section.content,
            fullName,
            email
          }
        };
      }
      return section;
    }));
  }, [currentUser]);

  // Handle section updates
  const handleUpdateSection = useCallback((sectionId, newContent) => {
    if (!sectionId) return;
    
    setSections(prevSections =>
      prevSections.map(section =>
        section.id === sectionId
          ? { ...section, content: newContent }
          : section
      )
    );
  }, []);

  // Analyze resume when content changes
  useEffect(() => {
    if (!isAutoFilling) return;

    const hasContent = sections.some(section => 
      section?.content && 
      (Array.isArray(section.content) ? section.content.length > 0 : Object.keys(section.content).length > 0)
    );

    if (hasContent) {
      const resumeData = sections.reduce((acc, section) => {
        if (section?.id) {
          acc[section.id] = section.content;
        }
        return acc;
      }, {});
      
      analyzeResume(resumeData);
    }
  }, [sections, analyzeResume, isAutoFilling]);

  const handleNext = useCallback(() => {
    setActiveStep(prevStep => prevStep + 1);
  }, []);

  const handleBack = useCallback(() => {
    setActiveStep(prevStep => prevStep - 1);
  }, []);

  const handlePreview = useCallback(() => {
    setIsPreview(true);
  }, []);

  const handleEdit = useCallback(() => {
    setIsPreview(false);
  }, []);

  const handleAutoFillComplete = useCallback(() => {
    setIsAutoFilling(false);
  }, []);

  if (isPreview) {
    return <PreviewMode sections={sections} onEdit={handleEdit} />;
  }

  const currentSection = sections[activeStep];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/dashboard')}
        sx={{ mb: 2 }}
      >
        Back to Dashboard
      </Button>
      <Paper
        elevation={3}
        sx={{
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <Box sx={{ width: '100%' }}>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {sections.map((section) => (
              <Step key={section.id}>
                <StepLabel>{section.title}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              {activeStep < sections.length && currentSection && (
                <ResumeSection
                  key={currentSection.id}
                  section={currentSection}
                  onUpdate={(newContent) => handleUpdateSection(currentSection.id, newContent)}
                  isAutoFilling={isAutoFilling}
                  onAutoFillComplete={handleAutoFillComplete}
                />
              )}
            </Grid>
            <Grid item xs={12} md={4}>
              <AISuggestions 
                isAutoFilling={isAutoFilling} 
                onAddSkill={(skill) => {
                  const skillsSection = sections.find(s => s.id === 'skills');
                  if (skillsSection && !skillsSection.content.some(s => s.name === skill)) {
                    handleUpdateSection('skills', [...skillsSection.content, { name: skill }]);
                  }
                }}
              />
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            {activeStep === sections.length - 1 ? (
              <Button
                variant="contained"
                color="primary"
                onClick={handlePreview}
              >
                Preview
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
              >
                Next
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default ResumeForm;
