import { StyleSheet } from '@react-pdf/renderer';

// Modern template with clean lines and minimalist design
export const modernStyles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    color: '#333333',
  },
  header: {
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#2c3e50',
  },
  contact: {
    fontSize: 10,
    marginBottom: 3,
    color: '#7f8c8d',
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2c3e50',
    borderBottom: '1 solid #e0e0e0',
    paddingBottom: 5,
  },
  experienceItem: {
    marginBottom: 10,
  },
  jobTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#34495e',
  },
  company: {
    fontSize: 11,
    color: '#7f8c8d',
    marginBottom: 3,
  },
  date: {
    fontSize: 10,
    color: '#95a5a6',
    marginBottom: 3,
  },
  description: {
    fontSize: 10,
    color: '#333333',
    lineHeight: 1.5,
  },
  skills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  skill: {
    fontSize: 10,
    backgroundColor: '#ecf0f1',
    padding: '3 8',
    borderRadius: 3,
    color: '#2c3e50',
  },
  education: {
    marginBottom: 8,
  },
  school: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#34495e',
  },
  degree: {
    fontSize: 10,
    color: '#7f8c8d',
  },
});

export const modernTemplate = {
  name: 'Modern',
  description: 'A clean, minimalist design with subtle colors and plenty of white space.',
  styles: modernStyles,
};
