import { StyleSheet } from '@react-pdf/renderer';

// Creative template with unique layout and colors
export const creativeStyles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    color: '#2d3436',
    backgroundColor: '#ffffff',
  },
  sidebar: {
    width: '30%',
    backgroundColor: '#6c5ce7',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    padding: 20,
  },
  mainContent: {
    width: '65%',
    marginLeft: '35%',
    padding: 20,
  },
  header: {
    marginBottom: 25,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
  },
  contact: {
    fontSize: 10,
    color: '#ffffff',
    marginBottom: 5,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6c5ce7',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sidebarSection: {
    marginBottom: 20,
  },
  sidebarTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  experienceItem: {
    marginBottom: 15,
  },
  jobTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2d3436',
  },
  company: {
    fontSize: 12,
    color: '#636e72',
    marginBottom: 5,
  },
  date: {
    fontSize: 10,
    color: '#b2bec3',
    marginBottom: 5,
  },
  description: {
    fontSize: 11,
    color: '#2d3436',
    lineHeight: 1.6,
  },
  skills: {
    flexDirection: 'column',
    gap: 8,
  },
  skill: {
    fontSize: 11,
    color: '#ffffff',
    marginBottom: 3,
  },
  education: {
    marginBottom: 12,
  },
  school: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  degree: {
    fontSize: 11,
    color: '#ffffff',
    opacity: 0.9,
  },
  summary: {
    fontSize: 11,
    color: '#ffffff',
    lineHeight: 1.6,
    marginBottom: 20,
  },
});

export const creativeTemplate = {
  name: 'Creative',
  description: 'A bold, modern design with a colored sidebar, perfect for creative professionals.',
  styles: creativeStyles,
};
