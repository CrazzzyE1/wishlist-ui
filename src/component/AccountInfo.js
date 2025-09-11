import {useEffect, useState} from 'react';
import ProfileAvatar from "./ProfileAvatar";
import Counters from "./Counters";
import {httpClient} from "../http/HttpClient";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import EventsInfoList from "./EventsInfoList";
import {Typography, useMediaQuery, useTheme} from "@mui/material";
import Item from "./StyledItem";
import IconButton from "@mui/material/IconButton";
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import TurnedInOutlinedIcon from '@mui/icons-material/TurnedInOutlined';
import CircularProgress from '@mui/material/CircularProgress';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import PersonRemoveOutlinedIcon from '@mui/icons-material/PersonRemoveOutlined';
import AddTaskOutlinedIcon from '@mui/icons-material/AddTaskOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import keycloak from '../keycloak/Keycloak';
import {getUserIdFromToken} from "../utils/Auth";
import {green, red, yellow} from "@mui/material/colors";

function AccountInfo({onIsOwner, events, userId, refreshCounterKey, profileRefreshKey, onPrivacyLevel, onIsFriend}) {
    const [userData, setUserData] = useState(null);
    const [giftsCount, setGiftsCount] = useState(0);
    const [isFriend, setIsFriend] = useState(null);
    const [isPrivate, setIsPrivate] = useState(null);
    const [isOwner, setIsOwner] = useState(null);
    const [isFavourites, setIsFavourites] = useState(null);
    const [hasIncomeFriendsRequest, setHasIncomeFriendsRequest] = useState(null);
    const [hasOutcomeFriendsRequest, setHasOutcomeFriendsRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        const fetchGiftCount = async () => {
            try {
                const id = userId ? userId : getUserIdFromToken(keycloak.token);
                const url = `/gifts/user/${id}/count`;
                const response = await httpClient.get(url);
                setGiftsCount(response.data.giftsCount);
            } catch (err) {
                setError(err.message);
                console.error('Ошибка загрузки данных:', err);
            } finally {
            }
        };

        fetchGiftCount();
    }, [refreshCounterKey]);

    useEffect(() => {
        const fetchUserDataWithRetry = async (retryCount = 0) => {
            try {
                setLoading(true);
                const url = userId
                    ? `/profiles/${userId}`
                    : '/profiles/me';

                const response = await httpClient.get(url);
                setUserData(response.data);
                if (onIsOwner) {
                    onIsOwner(response.data.isOwner);
                    setIsOwner(response.data.isOwner)
                }
                if (onPrivacyLevel) {
                    onPrivacyLevel(response.data.privacyLevel);
                    setIsPrivate(response.data.privacyLevel === 'PRIVATE');
                }
                setLoading(false);
            } catch (err) {
                if (err.response?.status === 404 && retryCount < 3) {
                    setTimeout(() => {
                        fetchUserDataWithRetry(retryCount + 1);
                    }, 2000);
                } else {
                    setError(err.message);
                    setLoading(false);
                }
            }
        };

        fetchUserDataWithRetry();
    }, [userId, profileRefreshKey, onIsOwner, onPrivacyLevel]);

    useEffect(() => {
        const fetchRelations = async () => {
            if (!userData) return;
            try {
                const me = getUserIdFromToken(keycloak.token);
                const url = `/profiles/relations`;
                const response = await httpClient.post(url, {
                    me: me,
                    friend: userId
                });
                setIsFriend(response.data.isFriends);
                if (onIsFriend) {
                    onIsFriend(response.data.isFriends);
                }
                setIsFavourites(response.data.isFavourites);
                setHasIncomeFriendsRequest(response.data.hasIncomeFriendsRequest);
                setHasOutcomeFriendsRequest(response.data.hasOutcomeFriendsRequest);
            } catch (err) {
                setError(err.message);
                console.error('Ошибка загрузки данных:', err);
            }
        };

        if (userData && !userData.isOwner) {
            fetchRelations();
        }
    }, [userId, userData, onIsFriend]);

    const handleClickBookmark = () => {
        try {
            if (isFavourites) {
                httpClient.delete(`/favourites/user/${userId}`);
                setIsFavourites(false)
            } else {
                const url = `/favourites`;
                httpClient.post(url, {
                    friendId: userId
                });
                setIsFavourites(true)
            }
        } catch (err) {
            setError(err.message);
            console.error('Ошибка загрузки данных:', err);
        }
    };

    const handleClickAddFriend = async () => {
        try {
            await httpClient.post(`/friends/requests`, {
                friendId: userId
            });
            setHasOutcomeFriendsRequest(true);
        } catch (error) {
            console.error('Ошибка при отправке запроса в друзья:', error);
        }
    };

    const handleClickRemoveFriend = async () => {
        try {
            await httpClient.delete(`/friends/${userId}`);
            setIsFriend(false);
            setHasOutcomeFriendsRequest(false);
        } catch (error) {
            console.error('Ошибка при удалении друга:', error);
        }
    };

    const handleCancelFriendRequest = async () => {
        try {
            const res = await httpClient.get(`/friends/requests?incoming=false`);
            const requests = res.data;
            const request = requests.find(r => r.receiver === userId);

            if (!request) {
                throw new Error('Запрос не найден');
            }

            const response = await httpClient.delete(
                `/friends/requests/${request.id}?isCanceled=true`
            );

            if (response.status !== 200 && response.status !== 204) {
                throw new Error('Не удалось отменить заявку');
            }
        } catch (error) {
            console.error('Ошибка отмены заявки:', error);
        } finally {
            setHasOutcomeFriendsRequest(false);
        }
    };

    const handleAcceptFriendRequest = async () => {
        try {
            const res = await httpClient.get(`/friends/requests?incoming=true`);
            const requests = res.data;
            const request = requests.find(r => r.sender === userId);

            if (!request) {
                throw new Error('Запрос не найден');
            }

            const response = await httpClient.put(
                `/friends/requests/${request.id}/accept`
            );

            if (response.status !== 200 && response.status !== 204) {
                throw new Error('Не удалось принять заявку');
            }

            setHasIncomeFriendsRequest(false);
        } catch (error) {
            console.error('Ошибка подтверждения заявки:', error);
        }
    };

    const formatBirthDate = (dateString) => {
        if (!dateString) return 'Скрыто';
        const options = {day: 'numeric', month: 'long', year: 'numeric'};
        return new Date(dateString).toLocaleDateString('ru-RU', options);
    };

    if (loading) {
        return (
            <Box sx={{display: 'flex', justifyContent: 'center', p: 4}}>
                <CircularProgress/>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{p: 2, color: 'error.main'}}>
                Ошибка: {error}
            </Box>
        );
    }

    if (!userData) {
        return (
            <Box sx={{p: 2}}>
                Данные не найдены
            </Box>
        );
    }

    const buttons = () => {
        if (userData.isOwner) {
            return;
        }

        if (isFriend) {
            return (
                <Item noshadow>
                    <IconButton
                        onClick={handleClickRemoveFriend}
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: isMobile ? 40 : 48,
                            height: isMobile ? 40 : 48,
                            borderRadius: '50%',
                            mr: 0,
                            '&:hover': {
                                '& .MuiSvgIcon-root': {
                                    color: red[500]
                                }
                            },
                            '&:active': {
                                boxShadow: '0px 0px 10px rgba(0,0,0,0.2)'
                            }
                        }}
                    >
                        <PersonRemoveOutlinedIcon
                            sx={{
                                fontSize: isMobile ? 32 : 40,
                                transition: 'color 0.5s ease',
                                color: 'inherit'
                            }}
                        />
                    </IconButton>
                </Item>)
        }

        if (isPrivate) {
            return;
        }

        if (hasOutcomeFriendsRequest) {
            return (
                <Item noshadow>
                    <IconButton
                        onClick={handleCancelFriendRequest}
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: isMobile ? 40 : 48,
                            height: isMobile ? 40 : 48,
                            borderRadius: '50%',
                            mr: 0,
                            '&:hover': {
                                '& .MuiSvgIcon-root': {
                                    color: red[500]
                                }
                            },
                            '&:active': {
                                boxShadow: '0px 0px 10px rgba(0,0,0,0.2)'
                            }
                        }}
                    > <CancelOutlinedIcon
                        sx={{
                            fontSize: isMobile ? 32 : 40,
                            transition: 'color 0.5s ease',
                            color: 'inherit'
                        }}
                    />

                    </IconButton>
                </Item>)
        }

        if (hasIncomeFriendsRequest) {
            return (
                <Item noshadow>
                    <IconButton
                        onClick={handleAcceptFriendRequest}
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: isMobile ? 40 : 48,
                            height: isMobile ? 40 : 48,
                            borderRadius: '50%',
                            mr: 0,
                            '&:hover': {
                                '& .MuiSvgIcon-root': {
                                    color: green[500]
                                }
                            },
                            '&:active': {
                                boxShadow: '0px 0px 10px rgba(0,0,0,0.2)'
                            }
                        }}
                    > <AddTaskOutlinedIcon
                        sx={{
                            fontSize: isMobile ? 32 : 40,
                            transition: 'color 0.5s ease',
                            color: 'inherit'
                        }}
                    />

                    </IconButton>
                </Item>)
        }

        return (
            <Item noshadow>
                <IconButton
                    onClick={handleClickAddFriend}
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: isMobile ? 40 : 48,
                        height: isMobile ? 40 : 48,
                        borderRadius: '50%',
                        mr: 0,
                        '&:hover': {
                            '& .MuiSvgIcon-root': {
                                color: !isFriend && 'PRIVATE' !== userData.privacyLevel
                                    ? green[500]
                                    : red[500]
                            }
                        },
                        '&:active': {
                            boxShadow: '0px 0px 10px rgba(0,0,0,0.2)'
                        }
                    }}
                >
                    {(!isFriend && 'PRIVATE' !== userData.privacyLevel) ? (
                        <PersonAddAltOutlinedIcon
                            sx={{
                                fontSize: isMobile ? 32 : 40,
                                transition: 'color 0.5s ease',
                                color: 'inherit'
                            }}
                        />
                    ) : (
                        <PersonRemoveOutlinedIcon
                            sx={{
                                fontSize: isMobile ? 32 : 40,
                                transition: 'color 0.5s ease',
                                color: 'inherit'
                            }}
                        />
                    )}
                </IconButton>
            </Item>)
    }

    return (
        <Grid container spacing={{xs: 2, sm: 2}}>
            <Grid size={{xs: 3, sm: 2}}>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    mb: isMobile ? 2 : 0
                }}>
                    <ProfileAvatar userId={userId}/>
                </Box>
            </Grid>

            <Grid size={{xs: 9, sm: 10}}>
                <Grid container spacing={{xs: 1, sm: 2}}>
                    <Grid container size={{xs: 12, sm: 12}}>
                        <Typography
                            variant="h6"
                            sx={{
                                fontSize: {xs: '1.5rem', sm: '2rem'},
                                color: 'text.secondary',
                                fontWeight: 'bold'
                            }}>
                            {userData.fullName}
                        </Typography>
                        {userData.isOwner && (
                            <Typography
                                variant="body2"
                                sx={{
                                    fontSize: {xs: '0.5rem', sm: '0.75rem'},
                                    color: green[500],
                                    mt: 0.5
                                }}>
                                это Вы
                            </Typography>
                        )}
                    </Grid>

                    <Grid size={{xs: 3, sm: 3}}>
                        {(isOwner || !isPrivate) && (
                            <>
                                <Typography sx={{
                                    fontSize: {xs: '12px', sm: '16px'},
                                    color: 'text.secondary',
                                    justifyContent: 'flex-start',
                                    textAlign: 'left',
                                    fontWeight: 'bold'
                                }}>
                                    Статус:
                                </Typography>
                                <Typography sx={{
                                    fontSize: {xs: '10px', sm: '14px'},
                                    color: 'text.secondary',
                                    justifyContent: 'flex-start',
                                    textAlign: 'left',
                                    mt: 0.5
                                }}>
                                    {userData.status}
                                </Typography>
                            </>
                        )}
                    </Grid>

                    <Grid size={{xs: 4, sm: 4}}>
                        <Typography
                            sx={{
                                fontSize: {xs: '12px', sm: '16px'},
                                color: 'text.secondary',
                                justifyContent: 'flex-start',
                                textAlign: 'left',
                                fontWeight: 'bold'
                            }}>
                            Приватность:
                        </Typography>
                        <Typography sx={{
                            fontSize: {xs: '10px', sm: '14px'},
                            color: 'text.secondary',
                            mt: 0.5,
                            justifyContent: 'flex-start',
                            textAlign: 'left',
                        }}>
                            {userData.privacyLevel}
                        </Typography>
                    </Grid>

                    <Grid size={{xs: 5, sm: 5}}>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: isMobile ? 0 : 1,
                            mt: 0
                        }}>
                            {buttons()}
                            {(!isOwner && !isFriend && userData.isPublic) && (
                                <Item noshadow>
                                    <IconButton
                                        onClick={handleClickBookmark}
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            width: isMobile ? 40 : 48,
                                            height: isMobile ? 40 : 48,
                                            borderRadius: '50%',
                                            '&:hover': {
                                                '& .MuiSvgIcon-root': {
                                                    color: '#FFD700'
                                                }
                                            },
                                            '&:active': {
                                                boxShadow: '0px 0px 10px rgba(0,0,0,0.2)'
                                            }
                                        }}>
                                        {isFavourites ?
                                            <TurnedInOutlinedIcon sx={{
                                                color: yellow[500],
                                                fontSize: isMobile ? 32 : 40,
                                                transition: 'color 0.5s ease'
                                            }}/>
                                            :
                                            <BookmarkBorderIcon sx={{
                                                fontSize: isMobile ? 32 : 40,
                                                transition: 'color 0.5s ease'
                                            }}/>
                                        }
                                    </IconButton>
                                </Item>
                            )}
                        </Box>
                    </Grid>

                    <Grid size={{xs: 5, sm: 3}}>
                        {(isOwner || !isPrivate) && (
                            <>
                                <Typography variant="body2" fontWeight="bold" sx={{
                                    fontSize: {xs: '12px', sm: '16px'},
                                    color: 'text.secondary',
                                    justifyContent: 'flex-start',
                                    textAlign: 'left',
                                }}>
                                    День Рождения:
                                </Typography>
                                <Typography color="text.info" sx={{
                                    fontSize: {xs: '10px', sm: '14px'},
                                    color: 'text.secondary',
                                    mt: 0.5,
                                    justifyContent: 'flex-start',
                                    textAlign: 'left',
                                }}>
                                    {formatBirthDate(userData.birthDate)}
                                </Typography>
                            </>
                        )}
                    </Grid>

                    <Grid size={{xs: 3, sm: 2}}>
                        {(isOwner || !isPrivate) && (
                            <>
                                <Typography fontWeight="bold" sx={{
                                    fontSize: {xs: '12px', sm: '16px'},
                                    color: 'text.secondary',
                                    justifyContent: 'flex-start',
                                    textAlign: 'left',
                                }}>
                                    Пол:
                                </Typography>
                                <Typography color="text.info" sx={{
                                    fontSize: {xs: '10px', sm: '14px'},
                                    color: 'text.secondary',
                                    mt: 0.5,
                                    justifyContent: 'flex-start',
                                    textAlign: 'left',
                                }}>
                                    {userData.gender ? userData.gender : 'Не указан'}
                                </Typography>
                            </>
                        )}
                    </Grid>

                    <Grid size={{xs: 4, sm: 7}}>
                        {(isOwner || !isPrivate) && (
                            <Counters userData={userData} giftsCount={giftsCount}/>
                        )}
                    </Grid>
                    <Grid size={{xs: 12, sm: 12}}>
                        {(isOwner || !isPrivate) && (
                            <EventsInfoList events={events}/>
                        )}
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default AccountInfo;