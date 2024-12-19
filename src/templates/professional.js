import { StyleSheet } from '@react-pdf/renderer';

// Professional template with traditional layout
export const professionalStyles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Times-Roman',
    color: '#000000',
  },
  header: {
    marginBottom: 25,
    borderBottom: '2 solid #000000',
    paddingBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  contact: {
    fontSize: 11,
    textAlign: 'center',
    marginBottom: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    textTransform: 'uppercase',
    borderBottom: '1 solid #000000',
    paddingBottom: 3,
  },
  experienceItem: {
    marginBottom: 15,
  },
  jobTitle: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  company: {
    fontSize: 12,
    fontStyle: 'italic',
    marginBottom: 4,
  },
  date: {
    fontSize: 11,
    marginBottom: 4,
  },
  description: {
    fontSize: 11,
    lineHeight: 1.4,
  },
  skills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skill: {
    fontSize: 11,
    marginRight: 15,
  },
  education: {
    marginBottom: 10,
  },
  school: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  degree: {
    fontSize: 11,
    marginBottom: 3,
  },
});

export const professionalTemplate = {
  name: 'Professional',
  description: 'A traditional, formal design perfect for conservative industries.',
  styles: professionalStyles,
};
