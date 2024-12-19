import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Grid,
    Paper,
    Typography,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Button,
    CircularProgress,
    Alert,
    Chip,
    IconButton,
    Tooltip,
} from '@mui/material';
import {
    Timeline,
    TimelineItem,
    TimelineSeparator,
    TimelineConnector,
    TimelineContent,
    TimelineDot,
} from '@mui/lab';
import {
    TrendingUp,
    TrendingDown,
    AttachMoney,
    People,
    Refresh,
    Edit,
    Cancel,
    CheckCircle,
} from '@mui/icons-material';
import { Line } from 'react-chartjs-2';
import axios from 'axios';

const SubscriptionDashboard = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [stats, setStats] = useState({});
    const [analytics, setAnalytics] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [timeframe, setTimeframe] = useState('30');

    useEffect(() => {
        fetchData();
    }, [timeframe]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [subsResponse, analyticsResponse] = await Promise.all([
                axios.get('/api/admin/subscriptions'),
                axios.get(`/api/admin/analytics/subscriptions?timeframe=${timeframe}`)
            ]);

            setSubscriptions(subsResponse.data.subscriptions);
            setStats(subsResponse.data.stats);
            setAnalytics(analyticsResponse.data.analytics);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleExtendSubscription = async (userId) => {
        try {
            await axios.post(`/api/admin/subscriptions/${userId}/extend`);
            fetchData();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleCancelSubscription = async (userId) => {
        if (window.confirm('Are you sure you want to cancel this subscription?')) {
            try {
                await axios.post(`/api/admin/subscriptions/${userId}/cancel`);
                fetchData();
            } catch (err) {
                setError(err.message);
            }
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    const chartData = {
        labels: analytics.subscriptionsByDay?.map(day => day._id) || [],
        datasets: [
            {
                label: 'New Subscriptions',
                data: analytics.subscriptionsByDay?.map(day => day.count) || [],
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }
        ]
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Grid container spacing={3}>
                {/* Stats Cards */}
                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Total Subscriptions
                            </Typography>
                            <Typography variant="h4">
                                {stats.total || 0}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Active Subscriptions
                            </Typography>
                            <Typography variant="h4" color="primary">
                                {stats.active || 0}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Total Revenue
                            </Typography>
                            <Typography variant="h4" color="success.main">
                                ${(stats.revenue / 100).toFixed(2)}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Conversion Rate
                            </Typography>
                            <Typography variant="h4" color="info.main">
                                {analytics.conversionRate?.toFixed(1)}%
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Chart */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 2 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h6">Subscription Trends</Typography>
                            <Button
                                startIcon={<Refresh />}
                                onClick={fetchData}
                            >
                                Refresh
                            </Button>
                        </Box>
                        <Box height={300}>
                            <Line data={chartData} options={{ maintainAspectRatio: false }} />
                        </Box>
                    </Paper>
                </Grid>

                {/* Subscriptions Table */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Subscription Management
                        </Typography>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>User</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Start Date</TableCell>
                                        <TableCell>End Date</TableCell>
                                        <TableCell>Plan</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {subscriptions
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((subscription) => (
                                            <TableRow key={subscription._id}>
                                                <TableCell>
                                                    {subscription.userId?.email || 'N/A'}
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={subscription.subscriptionStatus}
                                                        color={subscription.isActive() ? 'success' : 'default'}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(subscription.subscriptionDate).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell>
                                                    {subscription.subscriptionEndDate
                                                        ? new Date(subscription.subscriptionEndDate).toLocaleDateString()
                                                        : 'N/A'}
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={subscription.plan}
                                                        color={subscription.plan === 'premium' ? 'primary' : 'default'}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Tooltip title="Extend Subscription">
                                                        <IconButton
                                                            onClick={() => handleExtendSubscription(subscription.userId?._id)}
                                                            color="primary"
                                                        >
                                                            <Edit />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Cancel Subscription">
                                                        <IconButton
                                                            onClick={() => handleCancelSubscription(subscription.userId?._id)}
                                                            color="error"
                                                        >
                                                            <Cancel />
                                                        </IconButton>
                                                    </Tooltip>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={subscriptions.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default SubscriptionDashboard;
