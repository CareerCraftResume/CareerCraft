import React from 'react';
import { Container, Typography, Box, Paper, Divider } from '@mui/material';
import DashboardButton from '../common/DashboardButton';

const GDPRPolicy = () => {
  return (
    <Container maxWidth="lg">
      <Box py={4}>
        <DashboardButton />
        <Paper elevation={2} sx={{ p: 4, ml: 8 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            GDPR Compliance Policy
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Last Updated: December 18, 2024
          </Typography>

          <Box mt={4}>
            <Typography variant="h5" gutterBottom>
              1. Introduction to GDPR Compliance
            </Typography>
            <Typography paragraph>
              CareerCraft is committed to protecting the privacy rights of individuals in the European Economic Area (EEA) under the General Data Protection Regulation (GDPR). This policy outlines how we process personal data in compliance with GDPR requirements.
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" gutterBottom>
              2. Data Controller Information
            </Typography>
            <Typography paragraph>
              CareerCraft acts as the Data Controller for personal data collected through our services. Our Data Protection Officer can be contacted at:
            </Typography>
            <Typography component="div" sx={{ pl: 2 }}>
              <Typography>Email: dpo@careercraft.com</Typography>
              <Typography>Phone: +1-800-CAREER1</Typography>
              <Typography>Address: 123 Innovation Way, Silicon Valley, CA 94025</Typography>
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" gutterBottom>
              3. Legal Basis for Processing
            </Typography>
            
            <Typography variant="h6" gutterBottom>
              3.1. Contract Performance
            </Typography>
            <Typography paragraph>
              We process your personal data to:
            </Typography>
            <Typography component="ul" sx={{ pl: 2 }}>
              <li>
                <Typography>Provide our resume building services</Typography>
              </li>
              <li>
                <Typography>Manage your account</Typography>
              </li>
              <li>
                <Typography>Process payments</Typography>
              </li>
              <li>
                <Typography>Deliver customer support</Typography>
              </li>
            </Typography>

            <Typography variant="h6" gutterBottom>
              3.2. Legitimate Interests
            </Typography>
            <Typography paragraph>
              We process data based on legitimate interests for:
            </Typography>
            <Typography component="ul" sx={{ pl: 2 }}>
              <li>
                <Typography>Service improvement and development</Typography>
              </li>
              <li>
                <Typography>Security and fraud prevention</Typography>
              </li>
              <li>
                <Typography>Analytics and performance monitoring</Typography>
              </li>
            </Typography>

            <Typography variant="h6" gutterBottom>
              3.3. Consent
            </Typography>
            <Typography paragraph>
              We obtain explicit consent for:
            </Typography>
            <Typography component="ul" sx={{ pl: 2 }}>
              <li>
                <Typography>Marketing communications</Typography>
              </li>
              <li>
                <Typography>Cookie usage (except essential cookies)</Typography>
              </li>
              <li>
                <Typography>AI/ML model training using your data</Typography>
              </li>
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" gutterBottom>
              4. Your GDPR Rights
            </Typography>

            <Typography variant="h6" gutterBottom>
              4.1. Right to Access
            </Typography>
            <Typography paragraph>
              You can request a copy of all personal data we hold about you. We will provide this information within 30 days in a structured, commonly used format.
            </Typography>

            <Typography variant="h6" gutterBottom>
              4.2. Right to Rectification
            </Typography>
            <Typography paragraph>
              You can request corrections to any inaccurate or incomplete personal data we hold about you.
            </Typography>

            <Typography variant="h6" gutterBottom>
              4.3. Right to Erasure
            </Typography>
            <Typography paragraph>
              You can request the deletion of your personal data when:
            </Typography>
            <Typography component="ul" sx={{ pl: 2 }}>
              <li>
                <Typography>It's no longer necessary for the original purpose</Typography>
              </li>
              <li>
                <Typography>You withdraw consent</Typography>
              </li>
              <li>
                <Typography>You object to processing</Typography>
              </li>
            </Typography>

            <Typography variant="h6" gutterBottom>
              4.4. Right to Restrict Processing
            </Typography>
            <Typography paragraph>
              You can limit how we use your personal data while we verify its accuracy or legitimacy of processing.
            </Typography>

            <Typography variant="h6" gutterBottom>
              4.5. Right to Data Portability
            </Typography>
            <Typography paragraph>
              You can request your data in a machine-readable format and transfer it to another service provider.
            </Typography>

            <Typography variant="h6" gutterBottom>
              4.6. Right to Object
            </Typography>
            <Typography paragraph>
              You can object to processing based on legitimate interests, including profiling and direct marketing.
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" gutterBottom>
              5. Data Protection Measures
            </Typography>

            <Typography variant="h6" gutterBottom>
              5.1. Technical Measures
            </Typography>
            <Typography component="ul" sx={{ pl: 2 }}>
              <li>
                <Typography>Encryption of data in transit and at rest</Typography>
              </li>
              <li>
                <Typography>Regular security assessments and penetration testing</Typography>
              </li>
              <li>
                <Typography>Access control and authentication systems</Typography>
              </li>
              <li>
                <Typography>Regular backups and disaster recovery procedures</Typography>
              </li>
            </Typography>

            <Typography variant="h6" gutterBottom>
              5.2. Organizational Measures
            </Typography>
            <Typography component="ul" sx={{ pl: 2 }}>
              <li>
                <Typography>Staff training on data protection</Typography>
              </li>
              <li>
                <Typography>Data protection impact assessments</Typography>
              </li>
              <li>
                <Typography>Incident response procedures</Typography>
              </li>
              <li>
                <Typography>Regular policy reviews and updates</Typography>
              </li>
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" gutterBottom>
              6. International Data Transfers
            </Typography>
            
            <Typography paragraph>
              When we transfer personal data outside the EEA, we ensure adequate protection through:
            </Typography>
            <Typography component="ul" sx={{ pl: 2 }}>
              <li>
                <Typography>Standard Contractual Clauses (SCCs)</Typography>
              </li>
              <li>
                <Typography>Adequacy decisions by the European Commission</Typography>
              </li>
              <li>
                <Typography>Binding Corporate Rules where applicable</Typography>
              </li>
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" gutterBottom>
              7. Data Retention
            </Typography>
            
            <Typography paragraph>
              We retain personal data only as long as necessary for:
            </Typography>
            <Typography component="ul" sx={{ pl: 2 }}>
              <li>
                <Typography>Service provision</Typography>
              </li>
              <li>
                <Typography>Legal obligations</Typography>
              </li>
              <li>
                <Typography>Legitimate business purposes</Typography>
              </li>
            </Typography>
            <Typography paragraph>
              Specific retention periods are:
            </Typography>
            <Typography component="ul" sx={{ pl: 2 }}>
              <li>
                <Typography>Account data: Duration of account plus 30 days</Typography>
              </li>
              <li>
                <Typography>Resume data: Until user deletion or account termination</Typography>
              </li>
              <li>
                <Typography>Usage logs: 90 days</Typography>
              </li>
              <li>
                <Typography>Billing information: 7 years (legal requirement)</Typography>
              </li>
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" gutterBottom>
              8. Data Breach Procedures
            </Typography>
            
            <Typography paragraph>
              In the event of a data breach, we will:
            </Typography>
            <Typography component="ul" sx={{ pl: 2 }}>
              <li>
                <Typography>Notify supervisory authorities within 72 hours</Typography>
              </li>
              <li>
                <Typography>Inform affected individuals without undue delay</Typography>
              </li>
              <li>
                <Typography>Document all breaches and remedial actions</Typography>
              </li>
              <li>
                <Typography>Implement measures to prevent future breaches</Typography>
              </li>
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" gutterBottom>
              9. Contact and Complaints
            </Typography>
            
            <Typography paragraph>
              To exercise your rights or file a complaint:
            </Typography>
            <Typography component="div" sx={{ pl: 2 }}>
              <Typography>Data Protection Officer: dpo@careercraft.com</Typography>
              <Typography>Supervisory Authority: [Your Local Data Protection Authority]</Typography>
              <Typography>Online Form: www.careercraft.com/gdpr-request</Typography>
            </Typography>
            <Typography paragraph>
              We aim to respond to all requests within 30 days. If we need more time, we'll notify you within the initial 30-day period.
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default GDPRPolicy;
