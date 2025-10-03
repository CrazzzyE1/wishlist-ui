import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import {deepPurple} from '@mui/material/colors';
import Grid from "@mui/material/Grid";


export const NotificationCard = ({notification, onMarkAsRead}) => {
    const handleMarkAsRead = () => {
        onMarkAsRead(notification.id);
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return null;

        const options = {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        };

        return new Date(dateString).toLocaleString('ru-RU', options);
    };

    return (
        <Grid
            size={{xs: 12, sm: 12}}
            key={notification.id}
        >
            <Card
                sx={{
                    padding: 0,
                    borderLeft: notification.isRead ? 'none' : `4px solid ${deepPurple[500]}`,
                    opacity: notification.isRead ? 0.8 : 1,
                    cursor: 'pointer'
                }}
                onClick={handleMarkAsRead}
            >
                <CardContent
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                        padding: {xs: 1, sm: 2}
                    }}
                >
                    <Avatar
                        sx={{
                            width: {xs: 40, sm: 56},
                            height: {xs: 40, sm: 56},
                            mr: 2
                        }}
                    >
                        {notification.text.charAt(0)}
                    </Avatar>
                    <Box sx={{
                        flexGrow: 1,
                        minWidth: 0,
                        padding: 0
                    }}>
                        <Typography variant="subtitle1" component="div"
                                    sx={{
                                        fontSize: {xs: '0.75rem', sm: '1rem'},
                                    }}
                        >
                            {notification.text}
                        </Typography>
                        <Typography variant="caption" color="text.secondary"
                                    sx={{
                                        fontSize: {xs: '0.6rem', sm: '0.8rem'},
                                    }}>
                            {formatDateTime(notification.created)}
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        </Grid>
    );
};