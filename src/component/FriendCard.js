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
import PersonRemoveOutlinedIcon from '@mui/icons-material/PersonRemoveOutlined';
import {httpClient} from "../http/HttpClient";
import {useSnackbar} from 'notistack';
import {useNavigate} from 'react-router-dom';

export function FriendCard({friend, onFriendRemoved}) {
    const [open, setOpen] = React.useState(false);
    const [isDeleting, setIsDeleting] = React.useState(false);
    const {enqueueSnackbar} = useSnackbar();
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

    const handleClickOpen = (e) => {
        e.stopPropagation();
        setOpen(true);
    };

    const handleClose = (e) => {
        e?.stopPropagation();
        setOpen(false);
    };

    const handleRemoveFriend = async (e) => {
        e?.stopPropagation();
        setIsDeleting(true);
        try {
            await httpClient.delete(`/friends/${friend.id}`);
            enqueueSnackbar(`${friend.fullName} удален из друзей`, {variant: 'success'});
            onFriendRemoved(friend.id);
        } catch (error) {
            enqueueSnackbar(error.message, {variant: 'error'});
            console.error('Error removing friend:', error);
        } finally {
            setIsDeleting(false);
            handleClose();
        }
    };

    const handleCardClick = () => {
        navigate(`/users/${friend.id}`);
    };

    return (
        <Grid size={{xs: 12, sm: 6}}  key={friend.id}>
            <Card
                sx={{
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
                }}>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%'
                    }}>
                        <Avatar
                            src={avatarSrc}
                            sx={{
                                width: {xs: 26, sm: 56},
                                height: {xs: 26, sm: 56},
                                mr: 2
                            }}>
                        </Avatar>
                        <Box sx={{
                            flexGrow: 1,
                            minWidth: 0
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
                        <IconButton
                            aria-label="delete"
                            onClick={handleClickOpen}
                            color="gray"
                            sx={{ml: 1}}
                            disabled={isDeleting}
                        >
                            <PersonRemoveOutlinedIcon sx={{fontSize: {xs: '24px', sm: '40px'}}}/>
                        </IconButton>
                    </Box>
                    <Grid container spacing={2}>
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
            >
                <DialogTitle id="alert-dialog-title">
                    {`Вы уверены, что хотите удалить ${friend.fullName} из друзей?`}
                </DialogTitle>
                <DialogActions>
                    <Button onClick={handleClose} disabled={isDeleting}>
                        Отмена
                    </Button>
                    <Button
                        onClick={handleRemoveFriend}
                        color="error"
                        autoFocus
                        disabled={isDeleting}
                    >
                        {isDeleting ? 'Удаление...' : 'Удалить'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Grid>
    );
}