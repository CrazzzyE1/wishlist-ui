import * as React from 'react';
import {useCallback, useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import {httpClient} from "../http/HttpClient";
import {OthersSubscriberCard} from "./OthersSubscriberCard";

export default function OthersSubscribersList({userData}) {
    const [subscribers, setSubscribers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchSubscribers = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const subscribersResponse = await httpClient.get(`/subscribers/user/${userData.id}`);
            const subscribersData = await subscribersResponse.data;
            const subscribersDetails = await Promise.all(
                subscribersData.friendIds.map(async (subscriberId) => {
                    const profileResponse = await httpClient.get(`/profiles/${subscriberId}`);
                    return await profileResponse.data;
                })
            );

            setSubscribers(subscribersDetails);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [userData.id]);

    useEffect(() => {
        fetchSubscribers();
    }, [fetchSubscribers]);

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
        <Box sx={{flexGrow: 1}}>
            {subscribers.length === 0 ? (
                <Typography variant="body1"
                            sx={{
                                mt: 2,
                                fontSize: {xs: '0.75rem', sm: '1rem'}
                            }}>
                    У {userData.fullName} пока нет подписчиков
                </Typography>
            ) : (
                <Grid container spacing={2}>
                    {subscribers.map((subscriber) => (
                        <OthersSubscriberCard key={subscriber.id}
                                              subscriber={subscriber}
                        />
                    ))}
                </Grid>
            )}
        </Box>
    );
}