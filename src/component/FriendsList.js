import * as React from 'react';
import { useEffect, useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { FriendCard } from "./FriendCard";
import { httpClient } from "../http/HttpClient";
import keycloak from '../keycloak/Keycloak';
import {getUserIdFromToken} from "../utils/Auth";

export default function FriendsList() {
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleFriendRemoved = (friendId) => {
        setFriends(friends.filter(f => f.id !== friendId));
    };

    const userId = getUserIdFromToken(keycloak.token);

    const fetchFriends = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const friendsResponse = await httpClient.get(`/friends/user/${userId}`);
            const friendsData = await friendsResponse.data;
            const friendsDetails = await Promise.all(
                friendsData.friendIds.map(async (friendId) => {
                    const profileResponse = await httpClient.get(`/profiles/${friendId}`);
                    return await profileResponse.data;
                })
            );

            setFriends(friendsDetails);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchFriends();
    }, [fetchFriends]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
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
        <Box sx={{ flexGrow: 1 }}>
            {friends.length === 0 ? (
                <Typography variant="body1"
                            sx={{
                                mt: 2,
                                fontSize: {xs: '0.75rem', sm: '1rem'}
                }}>
                    У вас пока нет друзей
                </Typography>
            ) : (
                <Grid container spacing={2}>
                    {friends.map((friend) => (

                            <FriendCard key={friend.id}
                                        friend={friend}
                                        onFriendRemoved={handleFriendRemoved}  />
                    ))}
                </Grid>
            )}
        </Box>
    );
}