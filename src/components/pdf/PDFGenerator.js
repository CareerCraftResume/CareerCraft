import React from 'react';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import { getTemplateByName } from '../../templates';

const PDFGenerator = ({ resumeData, templateName = 'modern' }) => {
  const template = getTemplateByName(templateName);
  const styles = template.styles;

  const renderPersonalInfo = () => (
    <View style={styles.header}>
      <Text style={styles.name}>{resumeData.personal.fullName}</Text>
      <Text style={styles.contact}>{resumeData.personal.email}</Text>
      <Text style={styles.contact}>{resumeData.personal.phone}</Text>
      <Text style={styles.contact}>{resumeData.personal.location}</Text>
    </View>
  );

  const renderSummary = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Professional Summary</Text>
      <Text style={styles.description}>{resumeData.personal.summary}</Text>
    </View>
  );

  const renderExperience = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Experience</Text>
      {resumeData.experience.map((exp, index) => (
        <View key={index} style={styles.experienceItem}>
          <Text style={styles.jobTitle}>{exp.title}</Text>
          <Text style={styles.company}>{exp.company}</Text>
          <Text style={styles.date}>{`${exp.startDate} - ${exp.endDate}`}</Text>
          <Text style={styles.description}>{exp.description}</Text>
        </View>
      ))}
    </View>
  );

  const renderEducation = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Education</Text>
      {resumeData.education.map((edu, index) => (
        <View key={index} style={styles.education}>
          <Text style={styles.school}>{edu.school}</Text>
          <Text style={styles.degree}>{edu.degree}</Text>
          <Text style={styles.date}>{`${edu.startDate} - ${edu.endDate}`}</Text>
        </View>
      ))}
    </View>
  );

  const renderSkills = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Skills</Text>
      <View style={styles.skills}>
        {resumeData.skills.map((skill, index) => (
          <Text key={index} style={styles.skill}>
            {skill}
          </Text>
        ))}
      </View>
    </View>
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {templateName === 'creative' ? (
          <>
            <View style={styles.sidebar}>
              {renderPersonalInfo()}
              <View style={styles.sidebarSection}>
                <Text style={styles.sidebarTitle}>Skills</Text>
                <View style={styles.skills}>
                  {resumeData.skills.map((skill, index) => (
                    <Text key={index} style={styles.skill}>
                      {skill}
                    </Text>
                  ))}
                </View>
              </View>
            </View>
            <View style={styles.mainContent}>
              {renderSummary()}
              {renderExperience()}
              {renderEducation()}
            </View>
          </>
        ) : (
          <>
            {renderPersonalInfo()}
            {renderSummary()}
            {renderExperience()}
            {renderEducation()}
            {renderSkills()}
          </>
        )}
      </Page>
    </Document>
  );
};

export default PDFGenerator;
