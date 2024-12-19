import React, { useState } from 'react';
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Container,
    Grid,
    Typography,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import {
    Check as CheckIcon,
    Style as StyleIcon,
    Palette as PaletteIcon,
    Description as DescriptionIcon
} from '@mui/icons-material';
import { useSubscription, SUBSCRIPTION_TIERS } from '../../contexts/SubscriptionContext';
import { PREMIUM_TEMPLATES, getTemplatePreview } from '../../services/PremiumTemplates';

export default function PremiumTemplateSelector({ onSelectTemplate }) {
    const { subscription } = useSubscription();
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [previewOpen, setPreviewOpen] = useState(false);

    const handlePreview = (templateName) => {
        setSelectedTemplate(getTemplatePreview(templateName));
        setPreviewOpen(true);
    };

    const handleSelect = (templateName) => {
        if (subscription !== SUBSCRIPTION_TIERS.PREMIUM) {
            alert('This template is only available for premium users. Please upgrade to access premium templates.');
            return;
        }
        onSelectTemplate(templateName);
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Premium Resume Templates
            </Typography>
            <Typography variant="subtitle1" align="center" color="text.secondary" paragraph>
                Choose from our collection of professionally designed templates
            </Typography>

            <Grid container spacing={4}>
                {Object.entries(PREMIUM_TEMPLATES).map(([key, template]) => (
                    <Grid item key={key} xs={12} sm={6} md={4}>
                        <Card 
                            sx={{ 
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                position: 'relative'
                            }}
                        >
                            {subscription !== SUBSCRIPTION_TIERS.PREMIUM && (
                                <Chip
                                    label="PREMIUM"
                                    color="primary"
                                    size="small"
                                    sx={{
                                        position: 'absolute',
                                        top: 12,
                                        right: 12,
                                        zIndex: 1
                                    }}
                                />
                            )}
                            <CardMedia
                                component="img"
                                height="200"
                                image={`/templates/${key}-preview.jpg`}
                                alt={template.name}
                                sx={{ objectFit: 'cover' }}
                            />
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography gutterBottom variant="h5" component="h2">
                                    {template.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {template.description}
                                </Typography>
                                <Box sx={{ mt: 2 }}>
                                    {template.features.slice(0, 2).map((feature, index) => (
                                        <Chip
                                            key={index}
                                            label={feature}
                                            size="small"
                                            sx={{ mr: 1, mb: 1 }}
                                        />
                                    ))}
                                    {template.features.length > 2 && (
                                        <Chip
                                            label={`+${template.features.length - 2} more`}
                                            size="small"
                                            variant="outlined"
                                            sx={{ mb: 1 }}
                                        />
                                    )}
                                </Box>
                            </CardContent>
                            <CardActions>
                                <Button 
                                    size="small" 
                                    onClick={() => handlePreview(key)}
                                >
                                    Preview
                                </Button>
                                <Button
                                    size="small"
                                    color="primary"
                                    onClick={() => handleSelect(key)}
                                >
                                    Use Template
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Template Preview Dialog */}
            <Dialog
                open={previewOpen}
                onClose={() => setPreviewOpen(false)}
                maxWidth="md"
                fullWidth
            >
                {selectedTemplate && (
                    <>
                        <DialogTitle>
                            {selectedTemplate.name}
                        </DialogTitle>
                        <DialogContent dividers>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <img
                                        src={`/templates/${selectedTemplate.name.toLowerCase()}-preview.jpg`}
                                        alt={selectedTemplate.name}
                                        style={{ width: '100%', height: 'auto' }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle1" gutterBottom>
                                        {selectedTemplate.description}
                                    </Typography>
                                    <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                                        Features
                                    </Typography>
                                    <List>
                                        {selectedTemplate.features.map((feature, index) => (
                                            <ListItem key={index}>
                                                <ListItemIcon>
                                                    <CheckIcon color="primary" />
                                                </ListItemIcon>
                                                <ListItemText primary={feature} />
                                            </ListItem>
                                        ))}
                                    </List>
                                    <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                                        Style Information
                                    </Typography>
                                    <List>
                                        <ListItem>
                                            <ListItemIcon>
                                                <StyleIcon />
                                            </ListItemIcon>
                                            <ListItemText 
                                                primary="Font Family" 
                                                secondary={selectedTemplate.preview.styling.fontFamily} 
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemIcon>
                                                <PaletteIcon />
                                            </ListItemIcon>
                                            <ListItemText 
                                                primary="Color Scheme" 
                                                secondary={selectedTemplate.preview.styling.accentColor} 
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemIcon>
                                                <DescriptionIcon />
                                            </ListItemIcon>
                                            <ListItemText 
                                                primary="Layout Style" 
                                                secondary={selectedTemplate.preview.styling.headerStyle} 
                                            />
                                        </ListItem>
                                    </List>
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setPreviewOpen(false)}>
                                Close
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                    handleSelect(selectedTemplate.name.toLowerCase());
                                    setPreviewOpen(false);
                                }}
                            >
                                Use This Template
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </Container>
    );
}
