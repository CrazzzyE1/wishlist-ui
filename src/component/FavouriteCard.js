import * as React from 'react';
import {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import TurnedInOutlinedIcon from '@mui/icons-material/TurnedInOutlined';
import {deepPurple} from '@mui/material/colors';
import {httpClient} from "../http/HttpClient";
import {useSnackbar} from 'notistack';
import {useNavigate} from 'react-router-dom';

export function FavouriteCard({favourite, onFavouriteRemoved}) {
    const [open, setOpen] = React.useState(false);
    const [isDeleting, setIsDeleting] = React.useState(false);
    const {enqueueSnackbar} = useSnackbar();
    const [avatarSrc, setAvatarSrc] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAvatar = async () => {
            try {
                const response = await httpClient.get(`/avatars/user/${favourite.id}`, {
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

    const handleRemoveFavourite = async (e) => {
        e?.stopPropagation();
        setIsDeleting(true);
        try {
            await httpClient.delete(`/favourites/user/${favourite.id}`);
            enqueueSnackbar(`${favourite.fullName} удален из друзей`, {variant: 'success'});
            onFavouriteRemoved(favourite.id);
        } catch (error) {
            enqueueSnackbar(error.message, {variant: 'error'});
            console.error('Error removing friend:', error);
        } finally {
            setIsDeleting(false);
            handleClose();
        }
    };

    const handleCardClick = () => {
        navigate(`/users/${favourite.id}`);
    };

    return (
        <Grid
            size={{ xs: 12, sm: 6 }}
            key={favourite.id}
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
                        <Box sx={{
                            flexGrow: 1,
                            minWidth: 0,
                            padding: 0
                        }}>
                            <Typography noWrap variant="h6" component="div"
                                        sx={{
                                            fontSize: {xs: '0.75rem', sm: '1rem'},
                                        }}>
                                {favourite.fullName}
                            </Typography>
                            <Typography noWrap variant="body2" color="text.secondary"
                                        sx={{
                                            fontSize: {xs: '0.6rem', sm: '0.8rem'},
                                        }}>
                                {favourite.status}
                            </Typography>
                        </Box>
                        <IconButton
                            aria-label="delete"
                            onClick={handleClickOpen}
                            color="gray"
                            sx={{
                                ml: 1,
                                padding: 0
                            }}
                            disabled={isDeleting}
                        >
                            <TurnedInOutlinedIcon sx={{fontSize: {xs: '24px', sm: '40px'}}}/>
                        </IconButton>
                    </Box>
                    <Grid container spacing={1}
                          sx={{
                              padding: 0
                          }}
                    >
                        <Grid item xs={12} sm={6} md={3}>
                            {!favourite.isPublic ? (
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
                                    <strong>Дата рождения:</strong> {new Date(favourite.birthDate).toLocaleDateString()}
                                </Typography>
                            )}
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            {!favourite.isPublic ? (
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
                                    <strong>Друзей:</strong> {favourite.friendsCount}
                                </Typography>
                            )}
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            {!favourite.isPublic ? (
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
                                    <strong>Избранное:</strong> {favourite.favouritesCount}
                                </Typography>
                            )}
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Typography variant="body2"
                                        sx={{
                                            fontSize: {xs: '0.75rem', sm: '0.8rem'},
                                        }}>
                                <strong>Приватность:</strong> {favourite.privacyLevel}
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
                    {`Вы уверены, что хотите удалить ${favourite.fullName} из подписок?`}
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
                        onClick={handleRemoveFavourite}
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
                        {isDeleting ? 'Удаление...' : 'Удалить'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Grid>
    );
}