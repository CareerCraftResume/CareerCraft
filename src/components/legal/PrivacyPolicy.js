import React from 'react';
import { Container, Typography, Box, Paper, Divider } from '@mui/material';
import DashboardButton from '../common/DashboardButton';

const PrivacyPolicy = () => {
  return (
    <Container maxWidth="lg">
      <Box py={4}>
        <DashboardButton />
        <Paper elevation={2} sx={{ p: 4, ml: 8 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Privacy Policy
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Last Updated: December 18, 2024
          </Typography>

          <Box mt={4}>
            <Typography variant="h5" gutterBottom>
              1. Introduction
            </Typography>
            <Typography paragraph>
              At CareerCraft, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our resume building service. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the service.
            </Typography>

            <Typography variant="h5" gutterBottom>
              2. Information We Collect
            </Typography>

            <Typography variant="h6" gutterBottom>
              2.1. Personal Information
            </Typography>
            <Typography paragraph>
              We collect personal information that you voluntarily provide to us when you:
            </Typography>
            <Typography component="ul" sx={{ pl: 2 }}>
              <li>
                <Typography>Register for an account</Typography>
              </li>
              <li>
                <Typography>Create or edit your resume</Typography>
              </li>
              <li>
                <Typography>Subscribe to our newsletter</Typography>
              </li>
              <li>
                <Typography>Contact our support team</Typography>
              </li>
              <li>
                <Typography>Participate in user surveys</Typography>
              </li>
            </Typography>

            <Typography variant="h6" gutterBottom>
              2.2. Resume Information
            </Typography>
            <Typography paragraph>
              This includes:
            </Typography>
            <Typography component="ul" sx={{ pl: 2 }}>
              <li>
                <Typography>Professional experience</Typography>
              </li>
              <li>
                <Typography>Educational background</Typography>
              </li>
              <li>
                <Typography>Skills and certifications</Typography>
              </li>
              <li>
                <Typography>Contact information</Typography>
              </li>
            </Typography>

            <Typography variant="h6" gutterBottom>
              2.3. Automatically Collected Information
            </Typography>
            <Typography paragraph>
              When you access our service, we automatically collect:
            </Typography>
            <Typography component="ul" sx={{ pl: 2 }}>
              <li>
                <Typography>Device information (type, operating system)</Typography>
              </li>
              <li>
                <Typography>IP address and location data</Typography>
              </li>
              <li>
                <Typography>Browser type and version</Typography>
              </li>
              <li>
                <Typography>Usage patterns and preferences</Typography>
              </li>
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" gutterBottom>
              3. How We Use Your Information
            </Typography>

            <Typography variant="h6" gutterBottom>
              3.1. Primary Uses
            </Typography>
            <Typography paragraph>
              We use your information to:
            </Typography>
            <Typography component="ul" sx={{ pl: 2 }}>
              <li>
                <Typography>Provide and maintain our service</Typography>
              </li>
              <li>
                <Typography>Generate AI-powered resume suggestions</Typography>
              </li>
              <li>
                <Typography>Process your transactions</Typography>
              </li>
              <li>
                <Typography>Respond to your inquiries</Typography>
              </li>
            </Typography>

            <Typography variant="h6" gutterBottom>
              3.2. AI and Machine Learning
            </Typography>
            <Typography paragraph>
              Your resume data may be used to:
            </Typography>
            <Typography component="ul" sx={{ pl: 2 }}>
              <li>
                <Typography>Train our AI models (in anonymized form)</Typography>
              </li>
              <li>
                <Typography>Improve suggestion accuracy</Typography>
              </li>
              <li>
                <Typography>Develop new features</Typography>
              </li>
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" gutterBottom>
              4. Information Sharing and Disclosure
            </Typography>

            <Typography variant="h6" gutterBottom>
              4.1. We Do Not Sell Your Data
            </Typography>
            <Typography paragraph>
              We do not sell, rent, or trade your personal information to third parties for their commercial purposes.
            </Typography>

            <Typography variant="h6" gutterBottom>
              4.2. Service Providers
            </Typography>
            <Typography paragraph>
              We may share your information with trusted service providers who assist us in:
            </Typography>
            <Typography component="ul" sx={{ pl: 2 }}>
              <li>
                <Typography>Hosting our services</Typography>
              </li>
              <li>
                <Typography>Processing payments</Typography>
              </li>
              <li>
                <Typography>Analyzing service usage</Typography>
              </li>
              <li>
                <Typography>Customer support</Typography>
              </li>
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" gutterBottom>
              5. Data Security
            </Typography>
            
            <Typography paragraph>
              We implement appropriate technical and organizational security measures to protect your data, including:
            </Typography>
            <Typography component="ul" sx={{ pl: 2 }}>
              <li>
                <Typography>Encryption of data in transit and at rest</Typography>
              </li>
              <li>
                <Typography>Regular security assessments</Typography>
              </li>
              <li>
                <Typography>Access controls and authentication</Typography>
              </li>
              <li>
                <Typography>Regular security updates</Typography>
              </li>
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" gutterBottom>
              6. Your Rights and Choices
            </Typography>

            <Typography paragraph>
              You have the right to:
            </Typography>
            <Typography component="ul" sx={{ pl: 2 }}>
              <li>
                <Typography>Access your personal information</Typography>
              </li>
              <li>
                <Typography>Correct inaccurate data</Typography>
              </li>
              <li>
                <Typography>Request data deletion</Typography>
              </li>
              <li>
                <Typography>Opt-out of marketing communications</Typography>
              </li>
              <li>
                <Typography>Export your data</Typography>
              </li>
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" gutterBottom>
              7. Children's Privacy
            </Typography>

            <Typography paragraph>
              Our service is not intended for users under the age of 16. We do not knowingly collect information from children under 16. If you become aware that a child has provided us with personal information, please contact us.
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" gutterBottom>
              8. International Data Transfers
            </Typography>

            <Typography paragraph>
              Your information may be transferred to and processed in countries other than your country of residence. These countries may have different data protection laws. We ensure appropriate safeguards are in place for such transfers.
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" gutterBottom>
              9. Changes to This Privacy Policy
            </Typography>

            <Typography paragraph>
              We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the "Last Updated" date.
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" gutterBottom>
              10. Contact Us
            </Typography>

            <Typography paragraph>
              If you have any questions about this Privacy Policy, please contact us at:
            </Typography>
            <Typography component="div" sx={{ pl: 2 }}>
              <Typography>Email: privacy@careercraft.com</Typography>
              <Typography>Phone: 1-800-CAREER1</Typography>
              <Typography>Address: 123 Innovation Way, Silicon Valley, CA 94025</Typography>
              <Typography>Hours: Monday-Friday, 9:00 AM - 5:00 PM PST</Typography>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default PrivacyPolicy;
