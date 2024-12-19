import React, { useRef, useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  Container,
  Divider,
  Snackbar,
  Alert,
  Link,
  Stack
} from '@mui/material';
import { Print, Download, Save } from '@mui/icons-material';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../config';
import { useAuth } from '../../contexts/AuthContext';

const PreviewMode = ({ sections = [], resumeId, onEdit }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const resumeRef = useRef(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  // Debug logging
  useEffect(() => {
    console.log('PreviewMode sections:', sections);
  }, [sections]);

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null); // Reset success state

      // Check if user is logged in and get user data
      const storedUser = JSON.parse(localStorage.getItem('user'));
      console.log('Stored user:', storedUser);

      if (!storedUser) {
        throw new Error('Please log in to save your resume');
      }

      // Check for user ID (could be _id or id)
      const userId = storedUser._id || storedUser.id;
      if (!userId) {
        throw new Error('User ID not found. Please log in again.');
      }

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }
      
      // Get the personal info section
      const personalSection = sections.find(s => s.id === 'personal')?.content;
      if (!personalSection) {
        throw new Error('Personal information is required');
      }

      // Get other sections and ensure they're arrays
      const experienceSection = sections.find(s => s.id === 'experience')?.content || [];
      const educationSection = sections.find(s => s.id === 'education')?.content || [];
      const skillsSection = sections.find(s => s.id === 'skills')?.content || [];
      const projectsSection = sections.find(s => s.id === 'projects')?.content || [];
      
      // Format the resume data according to the server's schema
      const resumeData = {
        userId: userId,
        title: personalSection.fullName ? `${personalSection.fullName}'s Resume` : 'My Resume',
        templateId: "65807c3d1f0644e85a2c9123",
        basics: {
          name: personalSection.fullName || '',
          email: personalSection.email || '',
          phone: personalSection.phone || '',
          location: {
            city: personalSection.location || '',
            state: '',
            country: ''
          },
          summary: personalSection.summary || ''
        },
        education: educationSection.map(edu => ({
          institution: edu.school || '',
          degree: edu.degree || '',
          field: edu.field || '',
          startDate: edu.startDate || '',
          endDate: edu.endDate || '',
          description: edu.description || ''
        })),
        experience: experienceSection.map(exp => ({
          company: exp.company || '',
          position: exp.title || '',
          startDate: exp.startDate || '',
          endDate: exp.endDate || '',
          description: exp.description || ''
        })),
        projects: projectsSection.map(proj => ({
          name: proj.name || '',
          description: proj.description || '',
          technologies: proj.technologies || [],
          url: proj.url || ''
        })),
        skills: [{
          category: 'Skills',
          items: Array.isArray(skillsSection) ? skillsSection : []
        }],
        certifications: [],
        languages: [],
        customSections: []
      };

      console.log('Saving resume with data:', resumeData);

      // Add authorization header
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      // Use API_BASE_URL from config
      const response = await axios.post(`${API_BASE_URL}/api/resumes`, resumeData, config);
      console.log('Server response:', response.data);

      // Check for resume ID in response
      if (response.data && response.data._id) {
        setSuccess('Resume saved successfully!');
        // Wait for success message to show before navigating
        setTimeout(() => {
          navigate('/my-resumes');
        }, 1500);
      } else {
        throw new Error('Failed to save resume - no resume ID returned');
      }
    } catch (error) {
      console.error('Error saving resume:', error);
      setSuccess(null); // Clear any success message
      
      if (error.response) {
        console.error('Server error response:', error.response.data);
        setError(error.response.data.message || 'Server error occurred while saving resume');
      } else if (error.request) {
        console.error('No response received:', error.request);
        setError('Unable to connect to the server. Please try again.');
      } else {
        setError(error.message || 'Failed to save resume. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    if (!resumeRef.current) return;

    try {
      setLoading(true);
      setError(null);

      // Wait for a small delay to ensure content is rendered
      await new Promise(resolve => setTimeout(resolve, 500));

      // Generate PDF from the HTML content
      const canvas = await html2canvas(resumeRef.current, {
        scale: 2,
        useCORS: true,
        logging: true,
        backgroundColor: '#ffffff',
        windowWidth: resumeRef.current.scrollWidth,
        windowHeight: resumeRef.current.scrollHeight,
        onclone: (document) => {
          // Ensure all content is visible in the cloned document
          const element = document.getElementById(resumeRef.current.id);
          if (element) {
            element.style.height = 'auto';
            element.style.overflow = 'visible';
            element.style.position = 'relative';
          }
        }
      });

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      const pdf = new jsPDF({
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait'
      });

      // Add the image to the PDF
      pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);

      // Save the PDF
      pdf.save('resume.pdf');
    } catch (error) {
      console.error('PDF generation error:', error);
      setError('Failed to generate PDF. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    try {
      if (typeof date === 'string') {
        // Try to parse the date string
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) return date; // Return original if parsing fails
        return parsedDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      }
      // If it's already a Date object
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    } catch (error) {
      console.error('Error formatting date:', error);
      return date.toString();
    }
  };

  const renderPersonalInfo = (content) => {
    console.log('Rendering personal info:', content);
    if (!content) return null;

    return (
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ 
          color: 'text.primary',
          fontWeight: 600,
          mb: 1
        }}>
          {content.fullName || ''}
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap',
          gap: 2,
          color: 'text.secondary',
          mb: 2
        }}>
          {content.email && (
            <Typography variant="body1">{content.email}</Typography>
          )}
          {content.phone && (
            <Typography variant="body1">• {content.phone}</Typography>
          )}
          {content.location && (
            <Typography variant="body1">• {content.location}</Typography>
          )}
        </Box>
        {content.summary && (
          <Typography 
            variant="body1" 
            sx={{ 
              color: 'text.secondary',
              lineHeight: 1.6
            }}
          >
            {content.summary}
          </Typography>
        )}
      </Box>
    );
  };

  const renderExperience = (content) => {
    console.log('Rendering experience:', content);
    if (!content || !Array.isArray(content) || content.length === 0) return null;

    return (
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h5" 
          sx={{ 
            color: 'text.primary',
            fontWeight: 600,
            mb: 2,
            pb: 1,
            borderBottom: '2px solid',
            borderColor: 'primary.main'
          }}
        >
          Experience
        </Typography>
        {content.map((exp, index) => (
          <Box key={exp.id || index} sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {exp.position || ''}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {exp.startDate ? formatDate(exp.startDate) : ''} - {exp.endDate ? formatDate(exp.endDate) : 'Present'}
              </Typography>
            </Box>
            {exp.company && (
              <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1 }}>
                {exp.company}
              </Typography>
            )}
            {exp.description && (
              <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                {exp.description}
              </Typography>
            )}
          </Box>
        ))}
      </Box>
    );
  };

  const renderEducation = (content) => {
    if (!content || !Array.isArray(content) || content.length === 0) return null;
    return (
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h5" 
          sx={{ 
            color: 'text.primary',
            fontWeight: 600,
            mb: 2,
            pb: 1,
            borderBottom: '2px solid',
            borderColor: 'primary.main'
          }}
        >
          Education
        </Typography>
        {content.map((edu, index) => (
          <Box key={index} sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {edu.school || 'School'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {formatDate(edu.startDate)} - {edu.endDate ? formatDate(edu.endDate) : 'Present'}
              </Typography>
            </Box>
            <Typography variant="subtitle1" sx={{ mb: 1, color: 'primary.main' }}>
              {edu.degree || ''} {edu.field ? `in ${edu.field}` : ''}
            </Typography>
            {edu.gpa && (
              <Typography variant="body2" color="text.secondary">
                GPA: {edu.gpa}
              </Typography>
            )}
          </Box>
        ))}
      </Box>
    );
  };

  const renderSkills = (content) => {
    if (!content || !Array.isArray(content) || content.length === 0) return null;
    return (
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h5" 
          sx={{ 
            color: 'text.primary',
            fontWeight: 600,
            mb: 2,
            pb: 1,
            borderBottom: '2px solid',
            borderColor: 'primary.main'
          }}
        >
          Skills
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {content.map((skill, index) => (
            <Chip
              key={index}
              label={skill}
              sx={{
                bgcolor: 'primary.light',
                color: 'primary.contrastText',
                fontWeight: 500,
                '&:hover': {
                  bgcolor: 'primary.main',
                }
              }}
            />
          ))}
        </Box>
      </Box>
    );
  };

  const renderProjects = (content) => {
    if (!content || !Array.isArray(content) || content.length === 0) return null;
    return (
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h5" 
          sx={{ 
            color: 'text.primary',
            fontWeight: 600,
            mb: 2,
            pb: 1,
            borderBottom: '2px solid',
            borderColor: 'primary.main'
          }}
        >
          Projects
        </Typography>
        {content.map((project, index) => (
          <Box key={index} sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {project.name}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {project.startDate} - {project.endDate || 'Present'}
              </Typography>
            </Box>
            <Typography variant="subtitle1" sx={{ mb: 1, color: 'primary.main' }}>
              {project.description}
            </Typography>
            {project.link && (
              <Typography variant="body2" color="text.secondary">
                <a href={project.link} target="_blank" rel="noopener noreferrer">
                  View Project
                </a>
              </Typography>
            )}
          </Box>
        ))}
      </Box>
    );
  };

  const renderCertifications = (content) => {
    if (!content || !Array.isArray(content) || content.length === 0) return null;
    return (
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h5" 
          sx={{ 
            color: 'text.primary',
            fontWeight: 600,
            mb: 2,
            pb: 1,
            borderBottom: '2px solid',
            borderColor: 'primary.main'
          }}
        >
          Certifications
        </Typography>
        {content.map((certification, index) => (
          <Box key={index} sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {certification.name}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {certification.startDate} - {certification.endDate || 'Present'}
              </Typography>
            </Box>
            <Typography variant="subtitle1" sx={{ mb: 1, color: 'primary.main' }}>
              {certification.description}
            </Typography>
            {certification.link && (
              <Typography variant="body2" color="text.secondary">
                <a href={certification.link} target="_blank" rel="noopener noreferrer">
                  View Certification
                </a>
              </Typography>
            )}
          </Box>
        ))}
      </Box>
    );
  };

  const renderLanguages = (content) => {
    if (!content || !Array.isArray(content) || content.length === 0) return null;
    return (
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h5" 
          sx={{ 
            color: 'text.primary',
            fontWeight: 600,
            mb: 2,
            pb: 1,
            borderBottom: '2px solid',
            borderColor: 'primary.main'
          }}
        >
          Languages
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {content.map((language, index) => (
            <Chip
              key={index}
              label={language}
              sx={{
                bgcolor: 'primary.light',
                color: 'primary.contrastText',
                fontWeight: 500,
                '&:hover': {
                  bgcolor: 'primary.main',
                }
              }}
            />
          ))}
        </Box>
      </Box>
    );
  };

  const renderAchievements = (content) => {
    if (!content || !Array.isArray(content) || content.length === 0) return null;
    return (
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h5" 
          sx={{ 
            color: 'text.primary',
            fontWeight: 600,
            mb: 2,
            pb: 1,
            borderBottom: '2px solid',
            borderColor: 'primary.main'
          }}
        >
          Achievements
        </Typography>
        {content.map((achievement, index) => (
          <Box key={index} sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {achievement.name}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {achievement.startDate} - {achievement.endDate || 'Present'}
              </Typography>
            </Box>
            <Typography variant="subtitle1" sx={{ mb: 1, color: 'primary.main' }}>
              {achievement.description}
            </Typography>
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Button
        variant="outlined"
        onClick={onEdit}
        sx={{ mb: 3 }}
      >
        Back to Edit
      </Button>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      <Paper
        ref={resumeRef}
        elevation={3}
        sx={{
          p: 4,
          backgroundColor: 'background.paper',
          position: 'relative',
          mb: 10, 
          '@media print': {
            boxShadow: 'none'
          }
        }}
      >
        <Box 
          id="resume-content" 
          sx={{ 
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            position: 'relative',
            zIndex: 1
          }}
        >
          {console.log('Rendering resume content with sections:', sections)}
          {sections?.map((section, index) => {
            console.log('Processing section:', section);
            if (!section) return null;

            const key = `${section.id}-${index}`;
            let sectionContent = null;

            try {
              switch (section.id) {
                case 'personal':
                  sectionContent = renderPersonalInfo(section.content);
                  break;
                case 'experience':
                  sectionContent = renderExperience(section.content);
                  break;
                case 'education':
                  sectionContent = renderEducation(section.content);
                  break;
                case 'skills':
                  sectionContent = renderSkills(section.content);
                  break;
                case 'projects':
                  sectionContent = renderProjects(section.content);
                  break;
                case 'certifications':
                  sectionContent = renderCertifications(section.content);
                  break;
                case 'languages':
                  sectionContent = renderLanguages(section.content);
                  break;
                case 'achievements':
                  sectionContent = renderAchievements(section.content);
                  break;
                default:
                  console.log('Unknown section type:', section.id);
                  return null;
              }
            } catch (error) {
              console.error(`Error rendering section ${section.id}:`, error);
              return null;
            }

            if (!sectionContent) {
              console.log('Section rendered no content:', section.id);
              return null;
            }

            return (
              <Box 
                key={key} 
                sx={{ 
                  mb: 4,
                  '&:last-child': {
                    mb: 0
                  }
                }}
              >
                {sectionContent}
              </Box>
            );
          })}
        </Box>
      </Paper>

      <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 4 }}>
        <Button
          variant="contained"
          startIcon={<Print />}
          onClick={handlePrint}
          disabled={loading}
          sx={{
            background: 'linear-gradient(45deg, #6366F1 30%, #EC4899 90%)',
            color: 'white',
            '&:hover': {
              background: 'linear-gradient(45deg, #4F46E5 30%, #DB2777 90%)',
            },
          }}
        >
          Print
        </Button>
        <Button
          variant="contained"
          startIcon={<Download />}
          onClick={handleDownload}
          disabled={loading}
          sx={{
            background: 'linear-gradient(45deg, #6366F1 30%, #EC4899 90%)',
            color: 'white',
            '&:hover': {
              background: 'linear-gradient(45deg, #4F46E5 30%, #DB2777 90%)',
            },
          }}
        >
          Download PDF
        </Button>
        <Button
          variant="contained"
          startIcon={<Save />}
          onClick={handleSave}
          disabled={loading}
          sx={{
            background: 'linear-gradient(45deg, #6366F1 30%, #EC4899 90%)',
            color: 'white',
            '&:hover': {
              background: 'linear-gradient(45deg, #4F46E5 30%, #DB2777 90%)',
            },
          }}
        >
          Save to My Resumes
        </Button>
      </Stack>
    </Container>
  );
};

export default PreviewMode;
