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
            const friendsResponse = await httpClient.get(`http://localhost:9000/api/v1/friends/user/${userId}`);
            const friendsData = await friendsResponse.data;
            const friendsDetails = await Promise.all(
                friendsData.friendIds.map(async (friendId) => {
                    const profileResponse = await httpClient.get(`http://localhost:9000/api/v1/profiles/${friendId}`);
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
        <Box sx={{ flexGrow: 1, p: 3 }}>
            {friends.length === 0 ? (
                <Typography variant="body1" sx={{ mt: 2 }}>
                    У вас пока нет друзей
                </Typography>
            ) : (
                <Grid container spacing={3}>
                    {friends.map((friend) => (
                        // <Grid item xs={12} sm={6} md={4} lg={3} key={friend.id}>
                        <Grid size={12} key={friend.id}>
                            <FriendCard key={friend.id}
                                        friend={friend}
                                        onFriendRemoved={handleFriendRemoved}  />
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
}