import * as React from 'react';
import {useCallback, useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import {httpClient} from "../http/HttpClient";
import {IncomingFriendRequest} from "./IncomingFriendRequest";

export default function IncomingFriendRequestList() {
    const [incomingRequests, setIncomingRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleIncomingRequestRemoved = (requestId) => {
        setIncomingRequests(prev => prev.filter(req => req.requestId !== requestId));
    };

    const fetchIncomingRequests = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await httpClient.get(`/friends/requests?incoming=true`);
            const requests = response.data;

            const requestsWithProfiles = await Promise.all(
                requests.map(async (req) => {
                    try {
                        const profileResponse = await httpClient.get(`/profiles/${req.sender}`);
                        return {
                            ...profileResponse.data,
                            requestId: req.id,
                            requestData: req
                        };
                    } catch (error) {
                        console.error(`Ошибка загрузки профиля для запроса ${req.id}:`, error);
                        return null;
                    }
                })
            );

            setIncomingRequests(requestsWithProfiles.filter(Boolean));

        } catch (err) {
            setError(err.message);
            console.error('Ошибка загрузки исходящих запросов:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchIncomingRequests();
    }, [fetchIncomingRequests]);

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
            {incomingRequests.length === 0 ? (
                <Typography variant="body1"
                            sx={{
                                mt: 2,
                                fontSize: {xs: '0.75rem', sm: '1rem'}
                            }}>
                    У вас пока нет входящих заявок
                </Typography>
            ) : (
                <Grid container spacing={2}>
                    {incomingRequests.map((request) => (
                        <IncomingFriendRequest
                            friend={request}
                            requestId={request.requestId}
                            onIncomingRequestRemoved={handleIncomingRequestRemoved}
                        />
                    ))}
                </Grid>
            )}
        </Box>
    );
}