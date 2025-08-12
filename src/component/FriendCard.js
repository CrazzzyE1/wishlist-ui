import * as React from 'react';
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
import DeleteIcon from '@mui/icons-material/Delete';
import { deepPurple } from '@mui/material/colors';
import { httpClient } from "../http/HttpClient";
import { useSnackbar } from 'notistack';

export function FriendCard({ friend, onFriendRemoved }) {
    const [open, setOpen] = React.useState(false);
    const [isDeleting, setIsDeleting] = React.useState(false);
    const { enqueueSnackbar } = useSnackbar();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleRemoveFriend = async () => {
        setIsDeleting(true);
        try {
            const response = await httpClient.delete(`http://localhost:9000/api/v1/friends/${friend.id}`);

            if (!response.ok) {
                throw new Error('Ошибка при удалении друга');
            }

            enqueueSnackbar(`${friend.fullName} удален из друзей`, { variant: 'success' });
            onFriendRemoved(friend.id);
        } catch (error) {
            enqueueSnackbar(error.message, { variant: 'error' });
            console.error('Error removing friend:', error);
        } finally {
            setIsDeleting(false);
            handleClose();
        }
    };

    return (
        <>
            <Card sx={{ minWidth: 275, mb: 2, borderRadius: 2, position: 'relative' }}>
                <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar sx={{ bgcolor: deepPurple[500], width: 56, height: 56, mr: 2 }}>
                            {friend.firstName.charAt(0)}{friend.familyName.charAt(0)}
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" component="div">
                                {friend.fullName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {friend.email}
                            </Typography>
                        </Box>
                        <IconButton
                            aria-label="delete"
                            onClick={handleClickOpen}
                            color="error"
                            sx={{ ml: 1 }}
                            disabled={isDeleting}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <Grid container spacing={1}>
                        <Grid item xs={6}>
                            <Typography variant="body2">
                                <strong>Дата рождения:</strong> {new Date(friend.birthDate).toLocaleDateString()}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body2">
                                <strong>Друзей:</strong> {friend.friendsCount}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body2">
                                <strong>Избранное:</strong> {friend.favouritesCount}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body2">
                                <strong>Статус:</strong> {friend.privacyLevel === 'PUBLIC' ? 'Публичный' : 'Приватный'}
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
        </>
    );
}