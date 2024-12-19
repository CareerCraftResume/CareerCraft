import React, { useState } from 'react';
import {
    Container,
    Grid,
    Card,
    CardContent,
    Typography,
    Box,
    Button,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Snackbar,
    Alert,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PaymentForm from './PaymentForm';
import { useSubscription } from '../../contexts/SubscriptionContext';

const premiumFeatures = [
    'Advanced AI Resume Analysis',
    'Advanced Skill Recommendations',
    'Industry-Specific Insights',
    'Premium Resume Templates',
    'Priority Support',
    'Unlimited Resumes',
    'Multiple Export Formats',
    'Cover Letter AI Assistant',
];

export default function SubscriptionPage() {
    const { isPremium } = useSubscription();
    const [showPayment, setShowPayment] = useState(false);
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

    const handleUpgradeClick = () => {
        setShowPayment(true);
    };

    const handlePaymentSuccess = () => {
        setNotification({
            open: true,
            message: 'Successfully upgraded to Premium! Enjoy your new features.',
            severity: 'success',
        });
        setShowPayment(false);
    };

    const handlePaymentError = (error) => {
        setNotification({
            open: true,
            message: `Payment failed: ${error.message}`,
            severity: 'error',
        });
    };

    const handleCloseNotification = () => {
        setNotification({ ...notification, open: false });
    };

    return (
        <Container maxWidth="md" sx={{ py: 8 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
                Upgrade to Premium
            </Typography>
            
            <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 6 }}>
                Get access to advanced features and take your resume to the next level
            </Typography>

            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5" component="h2" gutterBottom>
                                Premium Features
                            </Typography>
                            <List>
                                {premiumFeatures.map((feature, index) => (
                                    <ListItem key={index}>
                                        <ListItemIcon>
                                            <CheckCircleIcon color="primary" />
                                        </ListItemIcon>
                                        <ListItemText primary={feature} />
                                    </ListItem>
                                ))}
                            </List>
                            <Box sx={{ mt: 3, textAlign: 'center' }}>
                                <Typography variant="h4" component="div" gutterBottom>
                                    $19.99
                                    <Typography variant="subtitle1" component="span" color="text.secondary">
                                        /month
                                    </Typography>
                                </Typography>
                                {!isPremium && !showPayment && (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="large"
                                        onClick={handleUpgradeClick}
                                    >
                                        Upgrade Now
                                    </Button>
                                )}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    {showPayment && (
                        <PaymentForm
                            priceId={process.env.REACT_APP_STRIPE_PRICE_ID}
                            onSuccess={handlePaymentSuccess}
                            onError={handlePaymentError}
                        />
                    )}
                </Grid>
            </Grid>

            <Snackbar
                open={notification.open}
                autoHideDuration={6000}
                onClose={handleCloseNotification}
            >
                <Alert
                    onClose={handleCloseNotification}
                    severity={notification.severity}
                    variant="filled"
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </Container>
    );
}
