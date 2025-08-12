import * as React from 'react';
import { useEffect, useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { httpClient } from "../http/HttpClient";
import keycloak from '../keycloak/Keycloak';
import {getUserIdFromToken} from "../utils/Auth";
import {FavouriteCard} from "./FavouriteCard";

export default function FavouritesList() {
    const [favourites, setFavourites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleFavouriteRemoved = useCallback((favouriteId) => {
        setFavourites(prev => prev.filter(f => f.id !== favouriteId));
    }, []);

    const userId = getUserIdFromToken(keycloak.token);

    const fetchFavourites = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const favouritesResponse = await httpClient.get(`http://localhost:9000/api/v1/favourites`);
            const favouritesData = await favouritesResponse.data;
            const favouritesDetails = await Promise.all(
                favouritesData.favouritesIds.map(async (favouriteId) => {
                    const profileResponse = await httpClient.get(`http://localhost:9000/api/v1/profiles/${favouriteId}`);
                    return await profileResponse.data;
                })
            );

            setFavourites(favouritesDetails);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchFavourites();
    }, [fetchFavourites]);

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
            {favourites.length === 0 ? (
                <Typography variant="body1" sx={{ mt: 2 }}>
                    У вас пока нет подписок
                </Typography>
            ) : (
                <Grid container spacing={3}>
                    {favourites.map((favourite) => (
                        <Grid size={12} key={favourite.id}>
                            <FavouriteCard key={favourite.id}
                                           favourite={favourite}
                                           onFavouriteRemoved={handleFavouriteRemoved}  />
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
}