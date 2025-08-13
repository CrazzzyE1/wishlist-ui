import * as React from 'react';
import {useCallback, useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import {httpClient} from "../http/HttpClient";
import keycloak from '../keycloak/Keycloak';
import {getUserIdFromToken} from "../utils/Auth";
import {IncomingFriendRequest} from "./IncomingFriendRequest";

export default function IncomingFriendRequestList() {
    const [incomingRequests, setOutcomingRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleFriendRemoved = (requestId) => {
        setOutcomingRequests(incomingRequests.filter(f => f.id !== requestId));
    };

    const userId = getUserIdFromToken(keycloak.token);

    const fetchOutcomingRequests = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await httpClient.get(`http://localhost:9000/api/v1/friends/requests?incoming=true`);
            const requests = await response.data;
            const friendsDetails = await Promise.all(
                requests.map(async (req) => {
                    const profileResponse = await httpClient.get(`http://localhost:9000/api/v1/profiles/${req.sender}`);
                    return await profileResponse.data;
                })
            );

            setOutcomingRequests(friendsDetails);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchOutcomingRequests();
    }, [fetchOutcomingRequests]);

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
            {incomingRequests.length === 0 ? (
                <Typography variant="body1" sx={{mt: 2}}>
                    У вас пока нет друзей
                </Typography>
            ) : (
                <Grid container spacing={3}>
                    {incomingRequests.map((friend) => (
                        <Grid size={12} key={friend.id}>
                            <IncomingFriendRequest key={friend.id}
                                                   friend={friend}
                                                   onFriendRemoved={handleFriendRemoved}/>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
}