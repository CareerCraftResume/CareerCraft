import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DragDropContext } from 'react-beautiful-dnd';
import DraggableResumeBuilder from '../DraggableResumeBuilder';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../../../styles/theme';

// Mock react-beautiful-dnd
jest.mock('react-beautiful-dnd', () => ({
  DragDropContext: ({ children }) => children,
  Droppable: ({ children }) => children({
    draggableProps: {
      style: {},
    },
    innerRef: jest.fn(),
  }),
  Draggable: ({ children }) => children({
    draggableProps: {
      style: {},
    },
    innerRef: jest.fn(),
    dragHandleProps: {},
  }, {}),
}));

const renderWithTheme = (component) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

describe('DraggableResumeBuilder', () => {
  beforeEach(() => {
    renderWithTheme(<DraggableResumeBuilder />);
  });

  test('renders all initial sections', () => {
    expect(screen.getByText('Personal Information')).toBeInTheDocument();
    expect(screen.getByText('Work Experience')).toBeInTheDocument();
    expect(screen.getByText('Education')).toBeInTheDocument();
    expect(screen.getByText('Skills')).toBeInTheDocument();
  });

  test('toggles preview mode', () => {
    const previewSwitch = screen.getByRole('switch', { name: /preview mode/i });
    fireEvent.click(previewSwitch);
    expect(screen.getByText('Resume Preview')).toBeInTheDocument();
  });

  test('expands section when edit button is clicked', () => {
    const editButtons = screen.getAllByLabelText(/edit section/i);
    fireEvent.click(editButtons[0]); // Click first edit button
    expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
  });

  test('sections are editable', async () => {
    const editButtons = screen.getAllByLabelText(/edit section/i);
    fireEvent.click(editButtons[0]);
    
    const nameInput = screen.getByLabelText('Full Name');
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    
    await waitFor(() => {
      expect(nameInput).toHaveValue('John Doe');
    });
  });

  test('preview mode displays entered information', async () => {
    // Enter some data
    const editButtons = screen.getAllByLabelText(/edit section/i);
    fireEvent.click(editButtons[0]);
    
    const nameInput = screen.getByLabelText('Full Name');
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });

    // Switch to preview mode
    const previewSwitch = screen.getByRole('switch', { name: /preview mode/i });
    fireEvent.click(previewSwitch);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });
});
