import * as React from 'react';
import {useEffect, useState} from 'react';
import ProfileAvatar from "./ProfileAvatar";
import Counters from "./Counters";
import {httpClient} from "../http/HttpClient";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import EventsInfoList from "./EventsInfoList";
import {Typography} from "@mui/material";
import Item from "./StyledItem";
import IconButton from "@mui/material/IconButton";
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import TurnedInOutlinedIcon from '@mui/icons-material/TurnedInOutlined';
import CircularProgress from '@mui/material/CircularProgress';
import keycloak from '../keycloak/Keycloak';
import {getUserIdFromToken} from "../utils/Auth";
import {yellow} from "@mui/material/colors";

function AccountInfo({onIsOwner, events, userId}) {
    const [userData, setUserData] = useState(null);
    const [bookmark, setBookmark] = useState(null);
    const [relations, setRelations] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                const url = userId
                    ? `http://localhost:9000/api/v1/profiles/${userId}`
                    : 'http://localhost:9000/api/v1/profiles/me';

                const response = await httpClient.get(url);
                setUserData(response.data);
                if (onIsOwner) {
                    onIsOwner(response.data.isOwner);
                }
            } catch (err) {
                setError(err.message);
                console.error('Ошибка загрузки данных:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [userId, onIsOwner]);

    useEffect(() => {
        const fetchRelations = async () => {
            if (!userData) return;

            try {
                setLoading(true);
                const me = getUserIdFromToken(keycloak.token);
                const url = `http://localhost:9000/api/v1/profiles/relations`;
                const response = await httpClient.post(url, {
                    me: me,
                    friend: userId
                });
                setRelations(response.data);
            } catch (err) {
                setError(err.message);
                console.error('Ошибка загрузки данных:', err);
            } finally {
                setLoading(false);
            }
        };

        if (userData && !userData.isOwner && userData.privacyLevel !== 'PRIVATE') {
            fetchRelations();
        }
    }, [userId, userData]);

    useEffect(() => {
        const fetchBookmark = async () => {
            if (!userData || !userId) return;

            try {
                setLoading(true);
                const url = `http://localhost:9000/api/v1/favourites`;
                const response = await httpClient.get(url);

                const isBookmarked = response.data.favouritesIds.includes(userId);
                setBookmark(isBookmarked);

            } catch (err) {
                setError(err.message);
                console.error('Ошибка загрузки данных:', err);
            } finally {
                setLoading(false);
            }
        };

        if (userData && !userData.isOwner && userData.privacyLevel !== 'PRIVATE') {
            fetchBookmark();
        }
    }, [userId, userData]);

    const handleClickBookmark = () => {
        try {
            setLoading(true);
            if (bookmark) {
                httpClient.delete(`http://localhost:9000/api/v1/favourites/user/${userId}`);
                setBookmark(false)
            } else {
                const url = `http://localhost:9000/api/v1/favourites`;
                httpClient.post(url, {
                    friendId: userId
                });
                setBookmark(true)
            }
        } catch (err) {
            setError(err.message);
            console.error('Ошибка загрузки данных:', err);
        } finally {
            setLoading(false);
        }

    };

    const formatBirthDate = (dateString) => {
        if (!dateString) return 'Не указано';
        const options = {day: 'numeric', month: 'long', year: 'numeric'};
        return new Date(dateString).toLocaleDateString('ru-RU', options);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 2, color: 'error.main' }}>
                Ошибка: {error}
            </Box>
        );
    }

    if (!userData) {
        return (
            <Box sx={{ p: 2 }}>
                Данные не найдены
            </Box>
        );
    }

    return (
        <Box sx={{flexGrow: 1, pl: 0}}>
            <Grid container spacing={1}>
                <Grid size={3}>
                    <ProfileAvatar userId={userId} />
                </Grid>
                <Grid size={9}>
                    <Grid container spacing={2}>
                        <Grid size={6} container justifyContent="flex-start" sx={{paddingLeft: '22px'}}>
                            <h2>{userData.fullName}</h2>
                        </Grid>
                        <Grid size={2} container justifyContent="flex-start" sx={{paddingLeft: '0px'}}>
                            <Item noshadow>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        fontSize: '16px',
                                        color: 'text.secondary',
                                        textAlign: 'left',
                                        pl: '0px'
                                    }}>
                                    Статус:
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        fontSize: '12px',
                                        color: 'text.secondary',
                                        textAlign: 'left',
                                        pl: '0px'
                                    }}>
                                    {userData.status}
                                </Typography>
                            </Item>
                        </Grid>
                        <Grid size={2} container justifyContent="flex-start" sx={{paddingLeft: '0px'}}>
                            <Item noshadow>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        fontSize: '16px',
                                        color: 'text.secondary',
                                        textAlign: 'left',
                                        pl: '0px'
                                    }}>
                                    Приватность:
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        fontSize: '12px',
                                        color: 'text.secondary',
                                        textAlign: 'left',
                                        pl: '0px'
                                    }}>
                                    {userData.privacyLevel}
                                </Typography>
                            </Item>
                        </Grid>
                        <Grid size={2} container justifyContent="flex-end">
                            {(!userData.isOwner && !relations?.isFriends) && (
                                <Item noshadow>
                                    <IconButton
                                        onClick={handleClickBookmark}
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            width: 48,
                                            height: 48,
                                            borderRadius: '50%',
                                            mr: 2,
                                            '&:hover': {
                                                '& .MuiSvgIcon-root': {
                                                    color: '#FFD700'
                                                }
                                            },
                                            '&:active': {
                                                boxShadow: '0px 0px 10px rgba(0,0,0,0.2)'
                                            }
                                        }}>
                                        {bookmark ?
                                            <TurnedInOutlinedIcon sx={{
                                                fontSize: 40,
                                                color: yellow,
                                                transition: 'color 0.5s ease'
                                            }}/>
                                            :
                                            <BookmarkBorderIcon sx={{
                                                fontSize: 40,
                                                transition: 'color 0.5s ease'
                                            }}/>
                                        }
                                    </IconButton>
                                </Item>
                            )}
                        </Grid>
                        <Grid size={4} container justifyContent="flex-start" sx={{paddingLeft: '22px'}} spacing={0}>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-start'
                            }}>
                                <Typography variant="body1"><b>День Рождения:</b></Typography>
                                <Typography variant="body2" color="text.info">
                                    {formatBirthDate(userData.birthDate)}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid size={8} container justifyContent="flex-start" sx={{paddingLeft: '22px'}}>
                            <Counters userData={userData}/>
                        </Grid>
                        <Grid size={12} container justifyContent="flex-start">
                            <EventsInfoList events={events}/>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
}

export default AccountInfo;