import React, { useState } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
    Paper,
    Divider,
    CircularProgress
} from '@mui/material';
import { useSubscription, SUBSCRIPTION_TIERS } from '../../contexts/SubscriptionContext';
import CoverLetterAI from '../../ai/CoverLetterAI';

const coverLetterAI = new CoverLetterAI();

export default function CoverLetterGenerator({ resumeData }) {
    const { subscription } = useSubscription();
    const [jobDescription, setJobDescription] = useState({
        company: '',
        position: '',
        requirements: []
    });
    const [template, setTemplate] = useState('standard');
    const [generatedLetter, setGeneratedLetter] = useState('');
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        if (subscription !== SUBSCRIPTION_TIERS.PREMIUM) {
            alert('This feature is only available for premium users. Please upgrade to access the Cover Letter AI Assistant.');
            return;
        }

        setLoading(true);
        try {
            // Parse requirements from text area
            const requirements = jobDescription.requirementsText
                ?.split('\\n')
                .filter(Boolean)
                .map(req => ({ text: req.trim(), importance: 'high' })) || [];

            const letter = coverLetterAI.generateCoverLetter(
                resumeData,
                { ...jobDescription, requirements },
                template
            );
            setGeneratedLetter(letter);
        } catch (error) {
            console.error('Error generating cover letter:', error);
            alert('Failed to generate cover letter. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom>
                AI Cover Letter Generator
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" paragraph>
                Let our AI assistant help you create a personalized cover letter
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Job Details
                            </Typography>
                            <Box component="form" noValidate sx={{ mt: 2 }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Company Name"
                                            value={jobDescription.company}
                                            onChange={(e) => setJobDescription(prev => ({
                                                ...prev,
                                                company: e.target.value
                                            }))}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Position"
                                            value={jobDescription.position}
                                            onChange={(e) => setJobDescription(prev => ({
                                                ...prev,
                                                position: e.target.value
                                            }))}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Job Requirements"
                                            multiline
                                            rows={4}
                                            placeholder="Enter job requirements, one per line"
                                            value={jobDescription.requirementsText}
                                            onChange={(e) => setJobDescription(prev => ({
                                                ...prev,
                                                requirementsText: e.target.value
                                            }))}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControl fullWidth>
                                            <InputLabel>Template Style</InputLabel>
                                            <Select
                                                value={template}
                                                label="Template Style"
                                                onChange={(e) => setTemplate(e.target.value)}
                                            >
                                                <MenuItem value="standard">Professional Standard</MenuItem>
                                                <MenuItem value="creative">Creative</MenuItem>
                                                <MenuItem value="technical">Technical</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={handleGenerate}
                                    disabled={loading || !jobDescription.company || !jobDescription.position}
                                    sx={{ mt: 3 }}
                                >
                                    {loading ? <CircularProgress size={24} /> : 'Generate Cover Letter'}
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper 
                        sx={{ 
                            p: 3, 
                            height: '100%', 
                            backgroundColor: 'grey.50',
                            position: 'relative'
                        }}
                    >
                        <Typography variant="h6" gutterBottom>
                            Generated Cover Letter
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        {subscription !== SUBSCRIPTION_TIERS.PREMIUM ? (
                            <Box sx={{ textAlign: 'center', mt: 4 }}>
                                <Typography variant="body1" color="text.secondary" paragraph>
                                    This feature is only available for premium users.
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    href="/subscription"
                                >
                                    Upgrade to Premium
                                </Button>
                            </Box>
                        ) : generatedLetter ? (
                            <Typography
                                variant="body1"
                                component="pre"
                                sx={{
                                    whiteSpace: 'pre-wrap',
                                    fontFamily: 'inherit',
                                    mt: 2
                                }}
                            >
                                {generatedLetter}
                            </Typography>
                        ) : (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                                Fill in the job details and click "Generate Cover Letter" to create your personalized cover letter.
                            </Typography>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}
