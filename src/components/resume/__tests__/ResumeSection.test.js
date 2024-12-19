import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import ResumeSection from '../ResumeSection';
import { theme } from '../../../styles/theme';

const renderWithProviders = (component) => {
  return render(
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {component}
      </LocalizationProvider>
    </ThemeProvider>
  );
};

describe('ResumeSection', () => {
  const mockOnUpdate = jest.fn();

  describe('Personal Information Section', () => {
    beforeEach(() => {
      renderWithProviders(
        <ResumeSection
          section={{
            id: 'personal',
            title: 'Personal Information',
            content: {}
          }}
          onUpdate={mockOnUpdate}
        />
      );
    });

    test('renders personal information fields', () => {
      expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Professional Summary')).toBeInTheDocument();
    });

    test('updates personal information', async () => {
      const nameInput = screen.getByLabelText('Full Name');
      fireEvent.change(nameInput, { target: { value: 'John Doe' } });

      await waitFor(() => {
        expect(mockOnUpdate).toHaveBeenCalledWith(expect.objectContaining({
          fullName: 'John Doe'
        }));
      });
    });
  });

  describe('Experience Section', () => {
    beforeEach(() => {
      renderWithProviders(
        <ResumeSection
          section={{
            id: 'experience',
            title: 'Work Experience',
            content: []
          }}
          onUpdate={mockOnUpdate}
        />
      );
    });

    test('adds new experience', async () => {
      const addButton = screen.getByText('Add Experience');
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByLabelText('Company')).toBeInTheDocument();
        expect(screen.getByLabelText('Position')).toBeInTheDocument();
      });
    });

    test('deletes experience', async () => {
      // Add experience first
      const addButton = screen.getByText('Add Experience');
      fireEvent.click(addButton);

      // Fill in some data
      const companyInput = screen.getByLabelText('Company');
      fireEvent.change(companyInput, { target: { value: 'Test Company' } });

      // Delete the experience
      const deleteButton = screen.getByRole('button', { name: /delete/i });
      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(screen.queryByText('Test Company')).not.toBeInTheDocument();
      });
    });
  });

  describe('Skills Section', () => {
    beforeEach(() => {
      renderWithProviders(
        <ResumeSection
          section={{
            id: 'skills',
            title: 'Skills',
            content: []
          }}
          onUpdate={mockOnUpdate}
        />
      );
    });

    test('adds new skill', async () => {
      const skillInput = screen.getByLabelText('Add Skill');
      fireEvent.change(skillInput, { target: { value: 'React' } });
      fireEvent.keyPress(skillInput, { key: 'Enter', code: 13, charCode: 13 });

      await waitFor(() => {
        expect(screen.getByText('React')).toBeInTheDocument();
      });
    });

    test('deletes skill', async () => {
      // Add a skill first
      const addSkillInput = screen.getByLabelText('Add Skill');
      fireEvent.change(addSkillInput, { target: { value: 'React' } });
      fireEvent.click(screen.getByText('Add'));

      // Delete the skill
      const deleteButton = screen.getByLabelText('Delete React');
      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(screen.queryByText('React')).not.toBeInTheDocument();
      });
    });
  });
});
