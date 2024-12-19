import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Button,
  Grid,
  Tooltip,
  Switch,
  Dialog,
  AppBar,
  Toolbar,
  FormControlLabel,
} from '@mui/material';
import {
  DragIndicator,
  Visibility,
  Edit,
  Add as AddIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import ResumeSection from './ResumeSection';
import PreviewMode from './PreviewMode';

const DraggableResumeBuilder = () => {
  const [sections, setSections] = useState([
    { id: 'personal', title: 'Personal Information', content: {}, order: 0 },
    { id: 'experience', title: 'Work Experience', content: [], order: 1 },
    { id: 'education', title: 'Education', content: [], order: 2 },
    { id: 'skills', title: 'Skills', content: [], order: 3 },
  ]);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(sections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order property
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index,
    }));

    setSections(updatedItems);
  };

  const handleSectionUpdate = (sectionId, newContent) => {
    setSections(sections.map(section =>
      section.id === sectionId
        ? { ...section, content: newContent }
        : section
    ));
  };

  const togglePreviewMode = () => {
    console.log('Sections before preview:', sections);
    
    const validSections = sections.filter(section => {
      const hasContent = section.content && 
        (Array.isArray(section.content) 
          ? section.content.length > 0 
          : Object.keys(section.content).length > 0);
      console.log(`Section ${section.id} has content:`, hasContent, section.content);
      return hasContent;
    });
    
    console.log('Valid sections for preview:', validSections);
    setIsPreviewMode(!isPreviewMode);
    if (!isPreviewMode) {
      setPreviewOpen(true);
    }
  };

  const handlePreviewClose = () => {
    setPreviewOpen(false);
    setIsPreviewMode(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Resume Builder
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Tooltip title="Toggle Preview Mode">
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={isPreviewMode}
                    onChange={togglePreviewMode}
                    color="primary"
                    inputProps={{ 'aria-label': 'preview mode' }}
                    role="switch"
                  />
                }
                label={isPreviewMode ? "Preview" : "Edit"}
              />
            </Box>
          </Tooltip>
        </Box>
      </Box>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="resume-sections">
          {(provided) => (
            <Box
              {...provided.droppableProps}
              ref={provided.innerRef}
              sx={{ minHeight: '70vh' }}
            >
              {sections.map((section, index) => (
                <Draggable
                  key={section.id}
                  draggableId={section.id}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <Paper
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      elevation={snapshot.isDragging ? 6 : 1}
                      sx={{
                        mb: 2,
                        p: 2,
                        transition: 'all 0.3s',
                        '&:hover': {
                          boxShadow: 3,
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box {...provided.dragHandleProps}>
                          <DragIndicator />
                        </Box>
                        <Typography variant="h6" sx={{ flexGrow: 1, ml: 2 }}>
                          {section.title}
                        </Typography>
                        <IconButton
                          onClick={() => setActiveSection(section.id)}
                          color="primary"
                          aria-label="edit section"
                        >
                          <Edit />
                        </IconButton>
                      </Box>
                      {activeSection === section.id && (
                        <ResumeSection
                          section={section}
                          onUpdate={(content) =>
                            handleSectionUpdate(section.id, content)
                          }
                        />
                      )}
                    </Paper>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </DragDropContext>

      {/* Preview Dialog */}
      <Dialog
        fullScreen
        open={previewOpen}
        onClose={handlePreviewClose}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handlePreviewClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Resume Preview
            </Typography>
            <Button color="inherit" onClick={handlePreviewClose}>
              Back to Edit
            </Button>
          </Toolbar>
        </AppBar>
        <Box sx={{ p: 3 }}>
          <PreviewMode 
            sections={sections.filter(section => {
              const hasContent = section.content && 
                (Array.isArray(section.content) 
                  ? section.content.length > 0 
                  : Object.keys(section.content).length > 0);
              return hasContent;
            })}
          />
        </Box>
      </Dialog>
    </Box>
  );
};

export default DraggableResumeBuilder;
