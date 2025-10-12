import * as React from 'react';
import {useEffect, useState, useCallback} from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import {httpClient} from "../http/HttpClient";
import {OthersFriendCard} from "./OthersFriendCard";

export default function OthersFriendsList({userData}) {
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchFriends = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const friendsResponse = await httpClient.get(`/friends/user/${userData.id}`);
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
    }, [userData.id]);

    useEffect(() => {
        fetchFriends();
    }, [fetchFriends]);

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
            {friends.length === 0 ? (
                <Typography variant="body1"
                            sx={{
                                mt: 2,
                                fontSize: {xs: '0.75rem', sm: '1rem'}
                            }}>
                    У {userData.fullName} пока нет друзей
                </Typography>
            ) : (
                <Grid container spacing={2}>
                    {friends.map((friend) => (
                        <OthersFriendCard key={friend.id}
                                          friend={friend}
                        />
                    ))}
                </Grid>
            )}
        </Box>
    );
}