import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Typography,
    Alert,
} from '@mui/material';
import {
    CardElement,
    Elements,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js';
import { stripePromise } from '../../services/StripeService';
import { useSubscription } from '../../contexts/SubscriptionContext';

const CARD_ELEMENT_OPTIONS = {
    style: {
        base: {
            color: '#32325d',
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSmoothing: 'antialiased',
            fontSize: '16px',
            '::placeholder': {
                color: '#aab7c4'
            }
        },
        invalid: {
            color: '#fa755a',
            iconColor: '#fa755a'
        }
    }
};

function PaymentFormContent({ priceId, onSuccess, onError }) {
    const stripe = useStripe();
    const elements = useElements();
    const { upgradeToPremium } = useSubscription();
    const [error, setError] = useState(null);
    const [cardComplete, setCardComplete] = useState(false);
    const [processing, setProcessing] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        if (!cardComplete) {
            return;
        }

        setProcessing(true);
        setError(null);

        try {
            // Create the subscription
            const { subscriptionId, clientSecret } = await fetch('/api/create-subscription', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    priceId,
                }),
            }).then(r => r.json());

            // Confirm the payment
            const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
                clientSecret,
                {
                    payment_method: {
                        card: elements.getElement(CardElement),
                    },
                }
            );

            if (stripeError) {
                setError(stripeError.message);
                onError(stripeError);
                return;
            }

            // Update subscription status in your backend
            await upgradeToPremium({
                id: paymentIntent.id,
                subscriptionId,
                amount: paymentIntent.amount,
            });

            onSuccess(paymentIntent);
        } catch (error) {
            setError(error.message);
            onError(error);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <CardContent>
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Payment Information
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Your subscription will start immediately after your payment is processed.
                    </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                    <CardElement
                        options={CARD_ELEMENT_OPTIONS}
                        onChange={(e) => {
                            setError(e.error ? e.error.message : '');
                            setCardComplete(e.complete);
                        }}
                    />
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    disabled={processing || !cardComplete}
                    type="submit"
                >
                    {processing ? (
                        <CircularProgress size={24} />
                    ) : (
                        'Subscribe Now'
                    )}
                </Button>
            </CardContent>
        </form>
    );
}

export default function PaymentForm({ priceId, onSuccess, onError }) {
    return (
        <Elements stripe={stripePromise}>
            <Card>
                <PaymentFormContent
                    priceId={priceId}
                    onSuccess={onSuccess}
                    onError={onError}
                />
            </Card>
        </Elements>
    );
}
