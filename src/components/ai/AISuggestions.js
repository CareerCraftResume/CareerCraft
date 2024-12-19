import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Fade,
  Collapse,
  IconButton,
} from '@mui/material';
import {
  Lightbulb as LightbulbIcon,
  TrendingUp as TrendingUpIcon,
  Psychology as PsychologyIcon,
  AutoAwesome as AutoAwesomeIcon,
  ExpandMore as ExpandMoreIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import { useAI } from '../../context/AIContext';
import { keyframes } from '@mui/system';

// Define shimmer animation
const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

const AISuggestions = ({ isAutoFilling, onAddSkill }) => {
  const { analysis, template, loading } = useAI();
  const [showAutoFillMessage, setShowAutoFillMessage] = useState(false);
  const [messageText, setMessageText] = useState("Template Insights");
  const [expandedSection, setExpandedSection] = useState('all');

  useEffect(() => {
    if (isAutoFilling) {
      setShowAutoFillMessage(true);
      setMessageText("Filling some of your data for you ...");
      
      const timer = setTimeout(() => {
        setShowAutoFillMessage(false);
        setMessageText("Template Insights");
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isAutoFilling]);

  const handleExpandSection = (section) => {
    setExpandedSection(expandedSection === section ? 'all' : section);
  };

  const renderSkillSuggestions = () => {
    if (!analysis?.skillSuggestions?.length) return null;

    const skillsBySource = {
      experience: analysis.skillSuggestions.filter(s => s.source === 'experience'),
      education: analysis.skillSuggestions.filter(s => s.source === 'education'),
      summary: analysis.skillSuggestions.filter(s => s.source === 'summary'),
      similar: analysis.skillSuggestions.filter(s => s.source === 'similar')
    };

    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <PsychologyIcon fontSize="small" />
          Recommended Skills
        </Typography>

        {/* Experience-based skills */}
        <Box sx={{ mb: 1 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              mb: 0.5
            }}
            onClick={() => handleExpandSection('experience')}
          >
            <WorkIcon fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="body2">From Experience</Typography>
            <IconButton size="small">
              <ExpandMoreIcon
                sx={{
                  transform: expandedSection === 'experience' ? 'rotate(180deg)' : 'rotate(0)',
                  transition: '0.3s'
                }}
              />
            </IconButton>
          </Box>
          <Collapse in={expandedSection === 'experience' || expandedSection === 'all'}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, ml: 4 }}>
              {skillsBySource.experience.map((skill, index) => (
                <Tooltip key={index} title={`Add ${skill.name} (Confidence: ${skill.confidence}%)`}>
                  <Chip
                    label={skill.name}
                    size="small"
                    variant="outlined"
                    color="primary"
                    onClick={() => onAddSkill(skill.name)}
                    sx={{ opacity: skill.confidence / 100 }}
                  />
                </Tooltip>
              ))}
            </Box>
          </Collapse>
        </Box>

        {/* Education-based skills */}
        <Box sx={{ mb: 1 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              mb: 0.5
            }}
            onClick={() => handleExpandSection('education')}
          >
            <SchoolIcon fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="body2">From Education</Typography>
            <IconButton size="small">
              <ExpandMoreIcon
                sx={{
                  transform: expandedSection === 'education' ? 'rotate(180deg)' : 'rotate(0)',
                  transition: '0.3s'
                }}
              />
            </IconButton>
          </Box>
          <Collapse in={expandedSection === 'education' || expandedSection === 'all'}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, ml: 4 }}>
              {skillsBySource.education.map((skill, index) => (
                <Tooltip key={index} title={`Add ${skill.name} (Confidence: ${skill.confidence}%)`}>
                  <Chip
                    label={skill.name}
                    size="small"
                    variant="outlined"
                    color="secondary"
                    onClick={() => onAddSkill(skill.name)}
                    sx={{ opacity: skill.confidence / 100 }}
                  />
                </Tooltip>
              ))}
            </Box>
          </Collapse>
        </Box>

        {/* Summary-based skills */}
        <Box sx={{ mb: 1 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              mb: 0.5
            }}
            onClick={() => handleExpandSection('summary')}
          >
            <DescriptionIcon fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="body2">From Summary</Typography>
            <IconButton size="small">
              <ExpandMoreIcon
                sx={{
                  transform: expandedSection === 'summary' ? 'rotate(180deg)' : 'rotate(0)',
                  transition: '0.3s'
                }}
              />
            </IconButton>
          </Box>
          <Collapse in={expandedSection === 'summary' || expandedSection === 'all'}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, ml: 4 }}>
              {skillsBySource.summary.map((skill, index) => (
                <Tooltip key={index} title={`Add ${skill.name} (Confidence: ${skill.confidence}%)`}>
                  <Chip
                    label={skill.name}
                    size="small"
                    variant="outlined"
                    color="info"
                    onClick={() => onAddSkill(skill.name)}
                    sx={{ opacity: skill.confidence / 100 }}
                  />
                </Tooltip>
              ))}
            </Box>
          </Collapse>
        </Box>

        {/* Similar skills */}
        <Box sx={{ mb: 1 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              mb: 0.5
            }}
            onClick={() => handleExpandSection('similar')}
          >
            <AutoAwesomeIcon fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="body2">Similar Skills</Typography>
            <IconButton size="small">
              <ExpandMoreIcon
                sx={{
                  transform: expandedSection === 'similar' ? 'rotate(180deg)' : 'rotate(0)',
                  transition: '0.3s'
                }}
              />
            </IconButton>
          </Box>
          <Collapse in={expandedSection === 'similar' || expandedSection === 'all'}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, ml: 4 }}>
              {skillsBySource.similar.map((skill, index) => (
                <Tooltip 
                  key={index} 
                  title={`Add ${skill.name} (Similar to: ${skill.basedOn}, Confidence: ${skill.confidence}%)`}
                >
                  <Chip
                    label={skill.name}
                    size="small"
                    variant="outlined"
                    color="success"
                    onClick={() => onAddSkill(skill.name)}
                    sx={{ opacity: skill.confidence / 100 }}
                  />
                </Tooltip>
              ))}
            </Box>
          </Collapse>
        </Box>
      </Box>
    );
  };

  const renderContentSuggestions = () => {
    if (!analysis?.recommendations?.length) return null;

    return (
      <List dense>
        {analysis.recommendations.map((rec, index) => (
          <ListItem key={index}>
            <ListItemIcon>
              {rec.type === 'impact' ? <TrendingUpIcon color="primary" /> : 
               rec.type === 'metrics' ? <AutoAwesomeIcon color="secondary" /> :
               <LightbulbIcon color="warning" />}
            </ListItemIcon>
            <ListItemText 
              primary={rec.message}
              primaryTypographyProps={{
                variant: 'body2',
                color: 'text.secondary'
              }}
            />
          </ListItem>
        ))}
      </List>
    );
  };

  if (loading) {
    return (
      <Paper 
        elevation={2} 
        sx={{ 
          p: 2,
          background: theme => `linear-gradient(90deg, 
            ${theme.palette.background.paper} 25%, 
            ${theme.palette.action.hover} 50%, 
            ${theme.palette.background.paper} 75%)`,
          backgroundSize: '200% 100%',
          animation: `${shimmer} 1.5s infinite linear`,
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          {messageText}
        </Typography>
      </Paper>
    );
  }

  if (!analysis && !showAutoFillMessage) return null;

  return (
    <Fade in={true}>
      <Paper elevation={2} sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <AutoAwesomeIcon color="primary" />
          {messageText}
        </Typography>

        {showAutoFillMessage ? (
          <Typography variant="body2" color="text.secondary">
            AI is helping to fill in some of your information...
          </Typography>
        ) : (
          <>
            {renderSkillSuggestions()}
            {renderContentSuggestions()}
            {template && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AutoAwesomeIcon fontSize="small" />
                  Template Suggestion
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {`${template.name} template optimized for ${template.analysis.industry} industry, emphasizing your ${template.analysis.emphasis}`}
                </Typography>
              </Box>
            )}
          </>
        )}
      </Paper>
    </Fade>
  );
};

export default AISuggestions;
