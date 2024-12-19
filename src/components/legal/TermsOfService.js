import React from 'react';
import { Container, Typography, Box, Paper, Divider } from '@mui/material';
import DashboardButton from '../common/DashboardButton';

const TermsOfService = () => {
  return (
    <Container maxWidth="lg">
      <Box py={4}>
        <DashboardButton />
        <Paper elevation={2} sx={{ p: 4, ml: 8 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Terms of Service
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Last Updated: December 18, 2024
          </Typography>

          <Box mt={4}>
            <Typography variant="h5" gutterBottom>
              1. Introduction
            </Typography>
            <Typography paragraph>
              Welcome to CareerCraft. By accessing or using our service, you agree to be bound by these Terms of Service ("Terms"). Please read them carefully.
            </Typography>

            <Typography variant="h5" gutterBottom>
              2. Definitions
            </Typography>
            <Typography component="ul" sx={{ pl: 2 }}>
              <li>
                <Typography paragraph>
                  "Service" refers to the CareerCraft platform
                </Typography>
              </li>
              <li>
                <Typography paragraph>
                  "User" refers to any individual who accesses or uses the Service
                </Typography>
              </li>
              <li>
                <Typography paragraph>
                  "Content" refers to any information, data, text, or other materials uploaded to the Service
                </Typography>
              </li>
              <li>
                <Typography paragraph>
                  "AI Features" refers to our artificial intelligence-powered resume enhancement tools
                </Typography>
              </li>
            </Typography>

            <Typography variant="h5" gutterBottom>
              3. Account Registration and Security
            </Typography>
            <Typography paragraph>
              3.1. Users must provide accurate, current, and complete information during registration.
            </Typography>
            <Typography paragraph>
              3.2. Users are responsible for maintaining the confidentiality of their account credentials.
            </Typography>
            <Typography paragraph>
              3.3. Users must notify us immediately of any unauthorized access to their account.
            </Typography>

            <Typography variant="h5" gutterBottom>
              4. User Content and Data
            </Typography>
            <Typography variant="h6" gutterBottom>
              4.1. Content Ownership
            </Typography>
            <Typography component="ul" sx={{ pl: 2 }}>
              <li>
                <Typography paragraph>
                  Users retain all ownership rights to their personal information and resume content
                </Typography>
              </li>
              <li>
                <Typography paragraph>
                  Users grant us a limited license to use their content to provide and improve our services
                </Typography>
              </li>
            </Typography>

            <Typography variant="h6" gutterBottom>
              4.2. Data Usage
            </Typography>
            <Typography component="ul" sx={{ pl: 2 }}>
              <li>
                <Typography paragraph>
                  Personal information is used to provide and improve our services
                </Typography>
              </li>
              <li>
                <Typography paragraph>
                  Resume content is processed by our AI systems to generate suggestions
                </Typography>
              </li>
              <li>
                <Typography paragraph>
                  Aggregate, anonymized data may be used for service improvement and analysis
                </Typography>
              </li>
              <li>
                <Typography paragraph>
                  We do not sell personal information to third parties
                </Typography>
              </li>
            </Typography>

            <Typography variant="h5" gutterBottom>
              5. AI Features and Services
            </Typography>
            <Typography variant="h6" gutterBottom>
              5.1. AI-Powered Resume Enhancement
            </Typography>
            <Typography paragraph>
              - Our AI system analyzes your resume content to provide tailored suggestions
              - Recommendations include keyword optimization, phrasing improvements, and formatting
              - AI suggestions are based on current industry standards and best practices
              - The system learns and improves from aggregated, anonymized user data
            </Typography>

            <Typography variant="h6" gutterBottom>
              5.2. Usage Guidelines
            </Typography>
            <Typography paragraph>
              - AI features are provided for personal resume enhancement only
              - Commercial use or bulk processing is prohibited
              - Users must review and verify all AI suggestions before use
              - We may limit access to prevent system abuse or overload
            </Typography>

            <Typography variant="h6" gutterBottom>
              5.3. Service Availability
            </Typography>
            <Typography paragraph>
              - AI features may be temporarily unavailable for maintenance
              - Processing times may vary based on system load
              - Premium users receive priority processing
              - We reserve the right to modify or discontinue features
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" gutterBottom>
              6. Prohibited Activities
            </Typography>
            <Typography paragraph>
              Users are strictly prohibited from:
            </Typography>
            <Typography component="div" sx={{ pl: 2 }}>
              <Typography paragraph>
                6.1. System Abuse
                - Attempting to bypass system limitations or security measures
                - Using automated tools to access or interact with the service
                - Creating multiple accounts to circumvent restrictions
                - Interfering with service operation or other users' access
              </Typography>

              <Typography paragraph>
                6.2. Content Violations
                - Submitting false or misleading information
                - Uploading malicious code or harmful content
                - Infringing on intellectual property rights
                - Sharing inappropriate or offensive content
              </Typography>

              <Typography paragraph>
                6.3. Commercial Misuse
                - Reselling or redistributing AI suggestions
                - Using the service for unauthorized commercial purposes
                - Scraping or bulk downloading content
                - Competing with or replicating our services
              </Typography>
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" gutterBottom>
              7. Privacy and Data Protection
            </Typography>
            <Typography variant="h6" gutterBottom>
              7.1. Data Collection and Use
            </Typography>
            <Typography paragraph>
              - We collect personal information necessary for service provision
              - Resume content is processed securely for AI analysis
              - Usage data helps improve our services
              - We implement industry-standard security measures
            </Typography>

            <Typography variant="h6" gutterBottom>
              7.2. User Rights
            </Typography>
            <Typography paragraph>
              - Access and download your personal data
              - Request data correction or deletion
              - Opt-out of non-essential data processing
              - Report privacy concerns or violations
            </Typography>

            <Typography variant="h6" gutterBottom>
              7.3. Data Sharing
            </Typography>
            <Typography paragraph>
              - We never sell personal data to third parties
              - Data sharing is limited to service providers
              - Anonymized data may be used for analytics
              - Legal compliance may require data disclosure
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" gutterBottom>
              8. Subscription and Payments
            </Typography>
            <Typography variant="h6" gutterBottom>
              8.1. Subscription Plans
            </Typography>
            <Typography paragraph>
              - Free tier with basic features
              - Premium plans with enhanced capabilities
              - Enterprise solutions for organizations
              - Custom packages available on request
            </Typography>

            <Typography variant="h6" gutterBottom>
              8.2. Payment Terms
            </Typography>
            <Typography paragraph>
              - Secure payment processing
              - Monthly or annual billing options
              - Automatic renewal unless cancelled
              - Price changes with 30-day notice
            </Typography>

            <Typography variant="h6" gutterBottom>
              8.3. Refunds and Cancellation
            </Typography>
            <Typography paragraph>
              - 14-day money-back guarantee
              - Pro-rated refunds not available
              - Cancel anytime without penalty
              - Refund requests reviewed individually
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" gutterBottom>
              9. Termination
            </Typography>
            <Typography variant="h6" gutterBottom>
              9.1. User-Initiated Termination
            </Typography>
            <Typography paragraph>
              - Cancel account through dashboard
              - Download personal data before deletion
              - Subscription cancellation separate process
              - Some data retained per legal requirements
            </Typography>

            <Typography variant="h6" gutterBottom>
              9.2. Service-Initiated Termination
            </Typography>
            <Typography paragraph>
              - Violation of terms or policies
              - Fraudulent or suspicious activity
              - Extended period of inactivity
              - Service discontinuation
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" gutterBottom>
              10. Disclaimers and Limitations
            </Typography>
            <Typography variant="h6" gutterBottom>
              10.1. Service Disclaimers
            </Typography>
            <Typography paragraph>
              - No guarantee of employment outcomes
              - AI suggestions are recommendations only
              - Service availability not guaranteed
              - Third-party content not endorsed
            </Typography>

            <Typography variant="h6" gutterBottom>
              10.2. Liability Limitations
            </Typography>
            <Typography paragraph>
              - Limited to subscription fees paid
              - No liability for indirect damages
              - Force majeure exclusions apply
              - User responsible for content accuracy
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" gutterBottom>
              11. Changes to Terms
            </Typography>
            <Typography paragraph>
              - 30-day notice for material changes
              - Email notification to all users
              - Continued use implies acceptance
              - Right to reject by discontinuing use
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" gutterBottom>
              12. Contact Information
            </Typography>
            <Typography paragraph>
              For questions or concerns:
            </Typography>
            <Typography component="div" sx={{ pl: 2 }}>
              <Typography>Email: support@careercraft.com</Typography>
              <Typography>Phone: 1-800-CAREER1</Typography>
              <Typography>Address: 123 Innovation Way, Silicon Valley, CA 94025</Typography>
              <Typography>Hours: Monday-Friday, 9:00 AM - 5:00 PM PST</Typography>
            </Typography>

            <Typography variant="h5" gutterBottom>
              13. Governing Law
            </Typography>
            <Typography paragraph>
              These Terms are governed by and construed in accordance with the laws of the United States.
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default TermsOfService;
