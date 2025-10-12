import * as React from 'react';
import {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import {httpClient} from "../http/HttpClient";
import {useNavigate} from 'react-router-dom';
import {green} from "@mui/material/colors";

export function OthersFriendCard({friend}) {
    const [avatarSrc, setAvatarSrc] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAvatar = async () => {
            try {
                const response = await httpClient.get(`/avatars/user/${friend.id}`, {
                    responseType: 'arraybuffer'
                });

                const blob = new Blob([response.data], {type: response.headers['content-type']});
                const imageUrl = URL.createObjectURL(blob);
                setAvatarSrc(imageUrl);
            } catch (err) {
                console.error('Ошибка загрузки аватара:', err);
            }
        };

        fetchAvatar();

        return () => {
            if (avatarSrc) {
                URL.revokeObjectURL(avatarSrc);
            }
        };
    }, []);

    const handleCardClick = () => {
        if (friend.isOwner) {
            navigate(`/`);
            return;
        }
        navigate(`/users/${friend.id}`);
    };

    return (
        <Grid
            size={{xs: 12, sm: 6}}
            key={friend.id}
        >
            <Card
                sx={{
                    padding: 0,
                    borderRadius: 2,
                    cursor: 'pointer',
                    '&:hover': {
                        boxShadow: 3,
                    }
                }}
                onClick={handleCardClick}
            >
                <CardContent sx={{
                    width: '100%',
                    padding: {xs: 1, sm: 2}
                }}>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                        padding: 0
                    }}>
                        <Avatar
                            src={avatarSrc}
                            sx={{
                                width: {xs: 40, sm: 56},
                                height: {xs: 40, sm: 56},
                                mr: 2
                            }}>
                        </Avatar>
                        <Box
                            sx={{
                                flexGrow: 1,
                                minWidth: 0,
                                padding: 0
                            }}>
                            <Typography noWrap variant="h6" component="div"
                                        sx={{
                                            fontSize: {xs: '0.75rem', sm: '1rem'},
                                        }}>
                                {friend.fullName}
                            </Typography>
                            <Typography noWrap variant="body2" color="text.secondary"
                                        sx={{
                                            fontSize: {xs: '0.6rem', sm: '0.8rem'},
                                        }}>
                                {friend.status === 'WAITING' ? 'Жду подарки' :
                                    friend.status === 'NO_WAITING' ? 'Собираю идеи' : ''}
                            </Typography>
                        </Box>
                        {friend.isFriend ?
                            (
                                <Box
                                    sx={{
                                        flexGrow: 1,
                                        minWidth: 0,
                                        padding: 0
                                    }}>
                                    <Typography variant="body1"
                                                sx={{
                                                    color: green[500],
                                                    fontSize: {xs: '0.75rem', sm: '1rem'}
                                                }}>
                                        У вас в друзьях
                                    </Typography>
                                </Box>
                            )
                            : null
                        }
                    </Box>
                    <Grid container spacing={1}
                          sx={{
                              padding: 0
                          }}
                    >
                        <Grid item xs={12} sm={6} md={3}>
                            {!friend.isPublic && friend.birthDate === null ? (
                                <Typography variant="body2"
                                            sx={{
                                                fontSize: {xs: '0.75rem', sm: '0.8rem'},
                                            }}>
                                    <strong>Дата рождения:</strong> скрыто
                                </Typography>
                            ) : (
                                <Typography variant="body2"
                                            sx={{
                                                fontSize: {xs: '0.75rem', sm: '0.8rem'},
                                            }}>
                                    <strong>Дата рождения:</strong> {new Date(friend.birthDate).toLocaleDateString()}
                                </Typography>
                            )}
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            {!friend.isPublic && friend.friendsCount === null ? (
                                <Typography variant="body2"
                                            sx={{
                                                fontSize: {xs: '0.75rem', sm: '0.8rem'},
                                            }}>
                                    <strong>Друзей:</strong> скрыто
                                </Typography>
                            ) : (
                                <Typography variant="body2"
                                            sx={{
                                                fontSize: {xs: '0.75rem', sm: '0.8rem'},
                                            }}>
                                    <strong>Друзей:</strong> {friend.friendsCount}
                                </Typography>
                            )}
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            {!friend.isPublic && friend.favouritesCount === null ? (
                                <Typography variant="body2"
                                            sx={{
                                                fontSize: {xs: '0.75rem', sm: '0.8rem'},
                                            }}>
                                    <strong>Подписчиков:</strong> скрыто
                                </Typography>
                            ) : (
                                <Typography variant="body2"
                                            sx={{
                                                fontSize: {xs: '0.75rem', sm: '0.8rem'},
                                            }}>
                                    <strong>Подписчиков:</strong> {friend.subscribersCount}
                                </Typography>
                            )}
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            {!friend.isPublic && friend.favouritesCount === null ? (
                                <Typography variant="body2"
                                            sx={{
                                                fontSize: {xs: '0.75rem', sm: '0.8rem'},
                                            }}>
                                    <strong>Подписок:</strong> скрыто
                                </Typography>
                            ) : (
                                <Typography variant="body2"
                                            sx={{
                                                fontSize: {xs: '0.75rem', sm: '0.8rem'},
                                            }}>
                                    <strong>Подписок:</strong> {friend.favouritesCount}
                                </Typography>
                            )}
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Typography variant="body2"
                                        sx={{
                                            fontSize: {xs: '0.75rem', sm: '0.8rem'},
                                        }}>
                                <strong>Приватность: </strong>
                                {friend.privacyLevel === 'PRIVATE' ? 'Приватный' :
                                    friend.privacyLevel === 'PUBLIC' ? 'Публичный' : 'Только друзья'}
                            </Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Grid>
    );
}