import * as React from 'react';
import {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import {httpClient} from "../http/HttpClient";
import {useNavigate} from 'react-router-dom';
import {green, red} from "@mui/material/colors";
import AddTaskOutlinedIcon from "@mui/icons-material/AddTaskOutlined";
import {Tooltip} from "@mui/material";
import {useNotifications} from "./NotificationsContext";

export function IncomingFriendRequest({friend, onIncomingRequestRemoved, requestId}) {
    const [open, setOpen] = React.useState(false);
    const [isDeleting, setIsDeleting] = React.useState(false);
    const [isAccepted, setIsAccepted] = React.useState(false);
    const [avatarSrc, setAvatarSrc] = useState(null);
    const navigate = useNavigate();
    const {decrementIncomingFriendsRequestCount} = useNotifications();

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

    const handleClickOpen = (e) => {
        e.stopPropagation();
        setOpen(true);
    };

    const handleClose = (e) => {
        e?.stopPropagation();
        setOpen(false);
    };

    const handleRemoveRequest = async (e) => {
        e?.stopPropagation();
        setIsDeleting(true);
        try {
            const response = await httpClient.delete(
                `/friends/requests/${requestId}?isCanceled=false`
            );

            if (response.status !== 200 && response.status !== 204) {
                throw new Error('Не удалось отменить заявку');
            }
            onIncomingRequestRemoved(requestId);
            decrementIncomingFriendsRequestCount();
        } catch (error) {
            console.error('Ошибка отмены заявки:', error);
        } finally {
            setIsDeleting(false);
            handleClose();
        }
    };

    const handleIncomingRequestAccepted = async (e) => {
        e?.stopPropagation();
        try {
            const response = await httpClient.put(
                `/friends/requests/${requestId}/accept`
            );

            if (response.status !== 200 && response.status !== 204) {
                throw new Error('Не удалось отменить заявку');
            }
            setIsAccepted(true);
            decrementIncomingFriendsRequestCount();
        } catch (error) {
            console.error('Ошибка подтверждения заявки:', error);
        } finally {

        }
    };

    const handleCardClick = () => {
        navigate(`/users/${friend.id}`);
    };

    return (
        <Grid
            size={{xs: 12, sm: 6}}
            key={requestId}>
            <Card
                sx={{
                    minWidth: 275,
                    mb: 2,
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
                        <Box sx={{
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
                                {friend.status}
                            </Typography>
                        </Box>
                        {isAccepted ? null :
                            (
                                <IconButton
                                    aria-label="accept"
                                    onClick={handleIncomingRequestAccepted}
                                    sx={{
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        width: {xs: 40, sm: 48},
                                        height: {xs: 40, sm: 48},
                                        borderRadius: '50%',
                                        padding: 0,
                                        '&:hover': {
                                            '& .MuiSvgIcon-root': {
                                                color: green[700]
                                            }
                                        },
                                        '&:active': {
                                            boxShadow: '0px 0px 10px rgba(0,0,0,0.2)'
                                        }
                                    }}
                                    disabled={isDeleting}
                                >
                                    <Tooltip title="Принять заявку в друзья" placement="top-start" arrow>
                                        <AddTaskOutlinedIcon
                                            sx={{
                                                fontSize: {
                                                    xs: '28px', sm: '40px',
                                                    color: green[400],
                                                    transition: 'color 0.5s ease'
                                                }
                                            }}
                                        />
                                    </Tooltip>
                                </IconButton>
                            )}
                        {isAccepted ?
                            (
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Typography variant="body1"
                                                sx={{
                                                    fontSize: {xs: '0.75rem', sm: '1rem'},
                                                    color: green[500],
                                                    textAlign: "left"
                                                }}>Добавлен в друзья</Typography>

                                </Box>
                            )
                            :
                            (
                                <IconButton
                                    aria-label="delete"
                                    onClick={handleClickOpen}
                                    sx={{
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        width: {xs: 40, sm: 48},
                                        height: {xs: 40, sm: 48},
                                        borderRadius: '50%',
                                        padding: 0,
                                        '&:hover': {
                                            '& .MuiSvgIcon-root': {
                                                color: red[700]
                                            }
                                        },
                                        '&:active': {
                                            boxShadow: '0px 0px 10px rgba(0,0,0,0.2)'
                                        }
                                    }}
                                    disabled={isDeleting}
                                >
                                    <Tooltip title="Отменить заявку в друзья" placement="top-start" arrow>
                                        <HighlightOffOutlinedIcon
                                            sx={{
                                                fontSize: {
                                                    xs: '28px', sm: '40px',
                                                    color: red[400],
                                                    transition: 'color 0.5s ease'
                                                }
                                            }}
                                        />
                                    </Tooltip>
                                </IconButton>
                            )
                        }
                    </Box>
                    <Grid container spacing={1}
                          sx={{
                              padding: 0
                          }}
                    >
                        <Grid item xs={12} sm={6} md={3}>
                            {!friend.isPublic ? (
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
                            {!friend.isPublic ? (
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
                            {!friend.isPublic ? (
                                <Typography variant="body2"
                                            sx={{
                                                fontSize: {xs: '0.75rem', sm: '0.8rem'},
                                            }}>
                                    <strong>Избранное:</strong> скрыто
                                </Typography>
                            ) : (
                                <Typography variant="body2"
                                            sx={{
                                                fontSize: {xs: '0.75rem', sm: '0.8rem'},
                                            }}>
                                    <strong>Избранное:</strong> {friend.favouritesCount}
                                </Typography>
                            )}
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Typography variant="body2"
                                        sx={{
                                            fontSize: {xs: '0.75rem', sm: '0.8rem'},
                                        }}>
                                <strong>Приватность:</strong> {friend.privacyLevel}
                            </Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                onClick={(e) => e.stopPropagation()}
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        textAlign: 'center',
                        p: 2,
                        minWidth: 300
                    }
                }}
            >
                <DialogTitle id="alert-dialog-title" sx={{
                    textAlign: 'center',
                    fontSize: {xs: '0.75rem', sm: '0.875rem'},
                    pb: 2
                }}>
                    {`Вы уверены, что хотите отказать ${friend.fullName}?`}
                </DialogTitle>
                <DialogActions sx={{
                    justifyContent: 'center',
                    gap: 2,
                    pt: 1
                }}>
                    <Button
                        onClick={handleClose}
                        disabled={isDeleting}
                        variant="outlined"
                        sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            fontSize: {xs: '0.75rem', sm: '0.875rem'},
                            minWidth: 120
                        }}
                    >
                        Отмена
                    </Button>
                    <Button
                        onClick={handleRemoveRequest}
                        color="error"
                        autoFocus
                        disabled={isDeleting}
                        variant="contained"
                        sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            fontSize: {xs: '0.75rem', sm: '0.875rem'},
                            minWidth: 120,
                            backgroundColor: 'error.main',
                            '&:hover': {
                                backgroundColor: 'error.dark'
                            }
                        }}
                    >
                        {isDeleting ? 'Удаление...' : 'Отказать'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Grid>
    );
}