import * as React from 'react';
import {useCallback, useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import {httpClient} from "../http/HttpClient";
import {NotificationCard} from "./NotificationCard";
import {useNotifications} from './NotificationsContext';

export default function NotificationsList({isUnread}) {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [markAsReadLoading, setMarkAsReadLoading] = useState(false);
    const [error, setError] = useState(null);

    const {decrementCount, incrementCount} = useNotifications();

    const handleMarkAsRead = async (id) => {
        try {
            setMarkAsReadLoading(true);
            const response = await httpClient.patch(`/notifications/${id}`);

            setNotifications(prev => prev.map(n =>
                n.id === id ? {...n, isRead: response.data.isRead} : n
            ));

            if (response.data.isRead) {
                decrementCount();
            } else {
                incrementCount();
            }

        } catch (err) {
            console.error('Error marking notification as read:', err);
        } finally {
            setMarkAsReadLoading(false);
        }
    };

    const fetchNotifications = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await httpClient.get(`/notifications`);
            let notifications = response.data;

            if (isUnread) {
                notifications = notifications.filter(n => !n.isRead);
            }

            notifications.sort((a, b) => new Date(b.created) - new Date(a.created));

            setNotifications(notifications);
        } catch (err) {
            setError(err.message || 'Не удалось загрузить уведомления');
            setNotifications([]);
        } finally {
            setLoading(false);
        }
    }, [isUnread]);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    if (loading) {
        return (
            <Box sx={{display: 'flex', justifyContent: 'center', mt: 4}}>
                <CircularProgress/>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4}}>
                <Typography color="error" gutterBottom>
                    Произошла ошибка при загрузке данных
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {error}
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{flexGrow: 1, p: 3}}>
            {notifications.length === 0 ? (
                <Typography variant="body1" sx={{mt: 2, textAlign: 'center'}}>
                    {isUnread ? 'Все сообщения прочитаны' : 'У вас пока нет сообщений'}
                </Typography>
            ) : (
                <Grid container spacing={2}>
                    {notifications.map((notification) => (
                        <Grid size={{ xs: 12, sm: 12 }} key={notification.id}>
                            <NotificationCard
                                notification={notification}
                                onMarkAsRead={handleMarkAsRead}
                                isLoading={markAsReadLoading}
                            />
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
}