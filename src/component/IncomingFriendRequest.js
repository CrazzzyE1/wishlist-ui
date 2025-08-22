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
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import {deepPurple} from '@mui/material/colors';
import {httpClient} from "../http/HttpClient";
import {useSnackbar} from 'notistack';
import {useNavigate} from 'react-router-dom';

export function IncomingFriendRequest({friend, onIncomingRequestRemoved, onIncomingRequestAccepted, requestId}) {
    const [open, setOpen] = React.useState(false);
    const [isDeleting, setIsDeleting] = React.useState(false);
    const {enqueueSnackbar} = useSnackbar();
    const [avatarSrc, setAvatarSrc] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAvatar = async () => {
            try {
                const response = await httpClient.get(`http://localhost:9000/api/v1/avatars/user/${friend.id}`, {
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
                `http://localhost:9000/api/v1/friends/requests/${requestId}?isCanceled=false`
            );

            if (response.status !== 200 && response.status !== 204) {
                throw new Error('Не удалось отменить заявку');
            }

            enqueueSnackbar(`Заявка в друзья с ${friend.fullName} отменена`, {variant: 'success'});
            onIncomingRequestAccepted(requestId);
        } catch (error) {
            enqueueSnackbar(error.response?.data?.message || error.message, {variant: 'error'});
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
                `http://localhost:9000/api/v1/friends/requests/${requestId}/accept`
            );

            if (response.status !== 200 && response.status !== 204) {
                throw new Error('Не удалось отменить заявку');
            }

            enqueueSnackbar(`Заявка в друзья с ${friend.fullName} подтверждена`, {variant: 'success'});
            onIncomingRequestRemoved(requestId);
        } catch (error) {
            enqueueSnackbar(error.response?.data?.message || error.message, {variant: 'error'});
            console.error('Ошибка подтверждения заявки:', error);
        } finally {

        }
    };

    const handleCardClick = () => {
        navigate(`/users/${friend.id}`);
    };

    return (
        <>
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
                    p: 3
                }}>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 2,
                        width: '100%'
                    }}>
                        <Avatar
                            src={avatarSrc}
                            sx={{
                                bgcolor: deepPurple[500],
                                width: 56,
                                height: 56,
                                mr: 2
                            }}>
                        </Avatar>
                        <Box sx={{
                            flexGrow: 1,
                            minWidth: 0
                        }}>
                            <Typography noWrap variant="h6" component="div">
                                {friend.fullName}
                            </Typography>
                            <Typography noWrap variant="body2" color="text.secondary">
                                {friend.status}
                            </Typography>
                        </Box>
                        <IconButton
                            aria-label="accept"
                            onClick={handleIncomingRequestAccepted}
                            color="green"
                            sx={{ml: 1}}
                            disabled={isDeleting}
                        >
                            <CheckCircleOutlineOutlinedIcon sx={{fontSize: '36px', color: 'green'}}/>
                        </IconButton>
                        <IconButton
                            aria-label="delete"
                            onClick={handleClickOpen}
                            color="gray"
                            sx={{ml: 0}}
                            disabled={isDeleting}
                        >
                            <HighlightOffOutlinedIcon sx={{fontSize: '36px'}}/>
                        </IconButton>
                    </Box>
                    <Divider sx={{my: 2}}/>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={3}>
                            {friend.privacyLevel === 'PRIVATE' ? (
                                <Typography variant="body2">
                                    <strong>Дата рождения:</strong> скрыто
                                </Typography>
                            ) : (
                                <Typography variant="body2">
                                    <strong>Дата рождения:</strong> {new Date(friend.birthDate).toLocaleDateString()}
                                </Typography>
                            )}
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            {friend.privacyLevel === 'PRIVATE' ? (
                                <Typography variant="body2">
                                    <strong>Друзей:</strong> скрыто
                                </Typography>
                            ) : (
                                <Typography variant="body2">
                                    <strong>Друзей:</strong> {friend.friendsCount}
                                </Typography>
                            )}
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            {friend.privacyLevel === 'PRIVATE' ? (
                                <Typography variant="body2">
                                    <strong>Избранное:</strong> скрыто
                                </Typography>
                            ) : (
                                <Typography variant="body2">
                                    <strong>Избранное:</strong> {friend.favouritesCount}
                                </Typography>
                            )}
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Typography variant="body2">
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
                    {`Вы уверены, что хотите отказать ${friend.fullName}?`}
                </DialogTitle>
                <DialogActions>
                    <Button onClick={handleClose} disabled={isDeleting}>
                        Отмена
                    </Button>
                    <Button
                        onClick={handleRemoveRequest}
                        color="error"
                        autoFocus
                        disabled={isDeleting}
                    >
                        {isDeleting ? 'Удаление...' : 'Отказать'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}