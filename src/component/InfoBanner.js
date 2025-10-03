
import React, { useState, useEffect } from 'react';
import {
    Box,
    Alert,
    Button,
    Typography,
    Card,
    CardContent,
    IconButton,
    Collapse
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {httpClient} from "../http/HttpClient";

const InfoBanner = () => {
    const [bannerData, setBannerData] = useState(null);
    const [open, setOpen] = useState(true);

    useEffect(() => {
        fetchBannerData();

        // Опционально: периодически проверяем обновления
        const interval = setInterval(fetchBannerData, 300000);

        return () => clearInterval(interval);
    }, []);

    const fetchBannerData = async () => {
        try {
            const response = await httpClient.get('/api/banner');
            if (response.data && response.data.visible) {
                setBannerData(response.data);
                setOpen(true);
            } else {
                setBannerData(null);
            }
        } catch (error) {
            console.error('Error fetching banner data:', error);
        }
    };

    const handleClose = () => {
        setOpen(false);
        // Опционально: сообщить бэку, что пользователь закрыл баннер
        if (bannerData?.id) {
            httpClient.post(`/api/banner/${bannerData.id}/dismiss`);
        }
    };

    if (!bannerData || !open) return null;

    const renderContent = () => {
        // Если бэк присылает готовый HTML
        if (bannerData.htmlContent) {
            return (
                <div dangerouslySetInnerHTML={{ __html: bannerData.htmlContent }} />
            );
        }

        // Если бэк присылает структурированные данные
        switch (bannerData.type) {
            case 'alert':
                return (
                    <Alert
                        severity={bannerData.severity || 'info'}
                        action={
                            bannerData.dismissible && (
                                <IconButton size="small" onClick={handleClose}>
                                    <CloseIcon />
                                </IconButton>
                            )
                        }
                    >
                        {bannerData.message}
                        {bannerData.action && (
                            <Button
                                color="inherit"
                                size="small"
                                onClick={() => window.location.href = bannerData.action.url}
                            >
                                {bannerData.action.text}
                            </Button>
                        )}
                    </Alert>
                );

            case 'custom':
                return (
                    <Card sx={{ backgroundColor: bannerData.backgroundColor }}>
                        <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography variant="h6">{bannerData.title}</Typography>
                                {bannerData.dismissible && (
                                    <IconButton onClick={handleClose}>
                                        <CloseIcon />
                                    </IconButton>
                                )}
                            </Box>
                            <Typography>{bannerData.content}</Typography>
                            {bannerData.actions?.map((action, index) => (
                                <Button
                                    key={index}
                                    variant={action.variant || 'contained'}
                                    onClick={() => window.location.href = action.url}
                                    sx={{ mt: 1, mr: 1 }}
                                >
                                    {action.text}
                                </Button>
                            ))}
                        </CardContent>
                    </Card>
                );

            default:
                return (
                    <Alert severity="info">
                        {bannerData.message}
                    </Alert>
                );
        }
    };

    return (
        <Collapse in={open}>
            <Box sx={{ p: 1 }}>
                {renderContent()}
            </Box>
        </Collapse>
    );
};

export default InfoBanner;