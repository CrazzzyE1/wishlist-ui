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

    useEffect(() => {
        const fetchGiftCount = async () => {
            try {
                setLoading(true);
                const id = userId ? userId : getUserIdFromToken(keycloak.token);
                const url = `http://localhost:9000/api/v1/gifts/user/${id}/count`;
                const response = await httpClient.get(url);
                setGiftsCount(response.data.giftsCount);
            } catch (err) {
                setError(err.message);
                console.error('Ошибка загрузки данных:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchGiftCount();
    }, [refreshCounterKey]);

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
                    setIsOwner(response.data.isOwner)
                }
                if (onPrivacyLevel) {
                    onPrivacyLevel(response.data.privacyLevel);
                    setIsPrivate(response.data.privacyLevel === 'PRIVATE');
                }
            } catch (err) {
                setError(err.message);
                console.error('Ошибка загрузки данных:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [userId, profileRefreshKey, onIsOwner, onPrivacyLevel]);

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
                setIsFriend(response.data.isFriends);
                if(onIsFriend) {
                    onIsFriend(response.data.isFriends);
                }
                setIsFavourites(response.data.isFavourites);
                setHasIncomeFriendsRequest(response.data.hasIncomeFriendsRequest);
                setHasOutcomeFriendsRequest(response.data.hasOutcomeFriendsRequest);
            } catch (err) {
                setError(err.message);
                console.error('Ошибка загрузки данных:', err);
            } finally {
                setLoading(false);
            }
        };

        if (userData && !userData.isOwner) {
            fetchRelations();
        }
    }, [userId, userData]);

    const handleClickBookmark = () => {
        try {
            setLoading(true);
            if (isFavourites) {
                httpClient.delete(`http://localhost:9000/api/v1/favourites/user/${userId}`);
                setIsFavourites(false)
            } else {
                const url = `http://localhost:9000/api/v1/favourites`;
                httpClient.post(url, {
                    friendId: userId
                });
                setIsFavourites(true)
            }
        } catch (err) {
            setError(err.message);
            console.error('Ошибка загрузки данных:', err);
        } finally {
            setLoading(false);
        }

    };

    const handleClickAddFriend = async () => {
        try {
            setLoading(true);
            await httpClient.post(`http://localhost:9000/api/v1/friends/requests`, {
                friendId: userId
            });
            setHasOutcomeFriendsRequest(true);
        } catch (error) {
            console.error('Ошибка при отправке запроса в друзья:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClickRemoveFriend = async () => {
        try {
            setLoading(true);
            await httpClient.delete(`http://localhost:9000/api/v1/friends/${userId}`);
            setIsFriend(false);
            setHasOutcomeFriendsRequest(false);
        } catch (error) {
            console.error('Ошибка при удалении друга:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelFriendRequest = async () => {
        try {
            const res = await httpClient.get(`http://localhost:9000/api/v1/friends/requests?incoming=false`);
            const requests = res.data;
            const request = requests.find(r => r.receiver === userId);

            if (!request) {
                throw new Error('Запрос не найден');
            }

            const response = await httpClient.delete(
                `http://localhost:9000/api/v1/friends/requests/${request.id}?isCanceled=true`
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
            const res = await httpClient.get(`http://localhost:9000/api/v1/friends/requests?incoming=true`);
            const requests = res.data;
            const request = requests.find(r => r.sender === userId);

            if (!request) {
                throw new Error('Запрос не найден');
            }

            const response = await httpClient.put(
                `http://localhost:9000/api/v1/friends/requests/${request.id}/accept`
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
                            width: 48,
                            height: 48,
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
                                fontSize: 40,
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
                            width: 48,
                            height: 48,
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
                            fontSize: 40,
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
                            width: 48,
                            height: 48,
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
                            fontSize: 40,
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
                        width: 48,
                        height: 48,
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
                                fontSize: 40,
                                transition: 'color 0.5s ease',
                                color: 'inherit'
                            }}
                        />
                    ) : (
                        <PersonRemoveOutlinedIcon
                            sx={{
                                fontSize: 40,
                                transition: 'color 0.5s ease',
                                color: 'inherit'
                            }}
                        />
                    )}
                </IconButton>
            </Item>)
    }

    return (
        <Box sx={{flexGrow: 1, pl: 0}}>
            <Grid container spacing={1}>
                <Grid size={3}>
                    <ProfileAvatar userId={userId}/>
                </Grid>
                <Grid size={9}>
                    <Grid container spacing={2}>
                        <Grid size={5} container justifyContent="flex-start" sx={{paddingLeft: '22px'}}>
                            <Typography
                                variant="body1"
                                sx={{
                                    fontSize: '2rem',
                                    color: 'text.secondary',
                                    textAlign: 'left',
                                    pl: '0px'
                                }}>
                                {userData.fullName}
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{
                                    fontSize: '0.75rem',
                                    color: green[500],
                                    textAlign: 'left',
                                    pl: '0px'
                                }}>
                                {userData.isOwner ? ('это Вы') : null}
                            </Typography>
                        </Grid>
                        <Grid size={2} container justifyContent="flex-start" sx={{paddingLeft: '0px'}}>
                            {isOwner || !isPrivate ? (
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

                            ) : null}
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
                        <Grid size={3} container justifyContent="flex-end" spacing={0}>
                            {buttons()}
                            {(!isOwner && !isFriend && userData.isPublic) && (
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
                                            mr: 0,
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
                                                fontSize: 40,
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
                        <Grid size={3} container justifyContent="flex-start" sx={{paddingLeft: '22px'}} spacing={0}>
                            {isOwner || !isPrivate ? (
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'flex-start'
                                }}>
                                    <Typography variant="body1"><b>День Рождения:</b></Typography>
                                    <Typography variant="body2" color="text.info">
                                        {formatBirthDate(userData.birthDate)}
                                    </Typography>
                                </Box>) : null}
                        </Grid>
                        <Grid size={2} container justifyContent="flex-start" sx={{paddingLeft: '22px'}} spacing={0}>
                            {isOwner || !isPrivate ? (
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'flex-start'
                                }}>
                                    <Typography variant="body1"><b>Пол:</b></Typography>
                                    <Typography variant="body2" color="text.info">
                                        {userData.gender}
                                    </Typography>
                                </Box>) : null}
                        </Grid>
                        <Grid size={7} container justifyContent="flex-start">
                            {isOwner || !isPrivate ? (
                                <Counters userData={userData} giftsCount={giftsCount}/>
                            ) : null}
                        </Grid>
                        <Grid size={12} container justifyContent="flex-start">
                            {isOwner || !isPrivate ? (
                                <EventsInfoList events={events}/>
                            ) : null}
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
}

export default AccountInfo;