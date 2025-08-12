import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import {deepPurple} from '@mui/material/colors';

export function FriendCard({ friend }) {
    return (
        <Card sx={{ minWidth: 275, mb: 2, borderRadius: 2 }}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: deepPurple[500], width: 56, height: 56, mr: 2 }}>
                        {friend.firstName.charAt(0)}{friend.familyName.charAt(0)}
                    </Avatar>
                    <Box>
                        <Typography variant="h6" component="div">
                            {friend.fullName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {friend.email}
                        </Typography>
                    </Box>
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
    );
}