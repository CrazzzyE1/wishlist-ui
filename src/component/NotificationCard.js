import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import {deepPurple} from '@mui/material/colors';


export const NotificationCard = ({ notification, onMarkAsRead }) => {
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
        <Card
            sx={{
                mb: 2,
                borderLeft: notification.isRead ? 'none' : `4px solid ${deepPurple[500]}`,
                opacity: notification.isRead ? 0.8 : 1,
                cursor: 'pointer'
            }}
            onClick={handleMarkAsRead}
        >
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: deepPurple[500], mr: 2 }}>
                    {notification.text.charAt(0)}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1" component="div">
                        {notification.text}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {formatDateTime(notification.created)}
                    </Typography>
                </Box>
            </CardContent>
            {/*{notification.type === 'FRIENDS_REQUEST' && !notification.isRead && (*/}
            {/*    <CardActions>*/}
            {/*        <Button size="small" color="success">Принять</Button>*/}
            {/*        <Button size="small" color="grey">Отклонить</Button>*/}
            {/*    </CardActions>*/}
            {/*)}*/}
        </Card>
    );
};