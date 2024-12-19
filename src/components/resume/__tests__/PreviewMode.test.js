import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import PreviewMode from '../PreviewMode';
import { theme } from '../../../styles/theme';

const mockSections = [
  {
    id: 'personal',
    title: 'Personal Information',
    content: {
      fullName: 'John Doe',
      email: 'john@example.com',
      summary: 'Experienced professional'
    },
    order: 0
  },
  {
    id: 'experience',
    title: 'Work Experience',
    content: [
      {
        id: '1',
        company: 'Tech Corp',
        position: 'Senior Developer',
        startDate: '2020-01-01',
        endDate: '2023-01-01',
        description: 'Led development team'
      }
    ],
    order: 1
  },
  {
    id: 'skills',
    title: 'Skills',
    content: ['React', 'Node.js', 'TypeScript'],
    order: 2
  }
];

const renderWithTheme = (component) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

describe('PreviewMode', () => {
  beforeEach(() => {
    global.print = jest.fn();
    renderWithTheme(<PreviewMode sections={mockSections} />);
  });

  test('renders personal information correctly', () => {
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('Experienced professional')).toBeInTheDocument();
  });

  test('renders work experience correctly', () => {
    expect(screen.getByText(/Tech Corp/)).toBeInTheDocument();
    expect(screen.getByText('Senior Developer')).toBeInTheDocument();
    expect(screen.getByText('Led development team')).toBeInTheDocument();
  });

  test('renders skills correctly', () => {
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Node.js')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });

  test('renders action buttons', () => {
    expect(screen.getByRole('button', { name: /print/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /download pdf/i })).toBeInTheDocument();
  });

  test('print functionality', () => {
    const printButton = screen.getByRole('button', { name: /print/i });
    fireEvent.click(printButton);
    expect(global.print).toHaveBeenCalled();
  });

  test('maintains correct section order', () => {
    const content = screen.getByRole('main', { hidden: true }).textContent;
    expect(content.indexOf('John Doe')).toBeLessThan(content.indexOf('Work Experience'));
    expect(content.indexOf('Work Experience')).toBeLessThan(content.indexOf('Skills'));
  });
});
