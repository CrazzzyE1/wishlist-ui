import Grid from "@mui/material/Grid";
import * as React from "react";
import {Box, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";

function Counters({isPublic, isFriendsOnly, isOwner, isFriend, userData, giftsCount}) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/users/${userData.id}/friends`);
    };

    const content = (
        <Grid container spacing={0}>
            <Grid size={{xs: 5, sm: 2}} container justifyContent="flex-start">
                <Typography variant="body1" sx={{
                    fontSize: {xs: '12px', sm: '16px'},
                    color: 'text.secondary',
                    justifyContent: 'flex-start',
                    textAlign: 'left',
                }}>
                    Желаний:
                </Typography>
                <Typography variant="body1" fontWeight="bold" sx={{
                    fontSize: {xs: '12px', sm: '16px'},
                    color: 'text.secondary',
                    justifyContent: 'flex-start',
                    textAlign: 'left',
                    ml: 1
                }}>{giftsCount}
                </Typography>
            </Grid>
            <Grid size={{xs: 7, sm: 10}} container justifyContent="flex-start">
                <Typography variant="body1" sx={{
                    fontSize: {xs: '12px', sm: '16px'},
                    color: 'text.secondary',
                    justifyContent: 'flex-start',
                    textAlign: 'left',
                }}>
                    Подписчиков:
                </Typography>
                <Typography variant="body1" fontWeight="bold" sx={{
                    fontSize: {xs: '12px', sm: '16px'},
                    color: 'text.secondary',
                    justifyContent: 'flex-start',
                    textAlign: 'left',
                    ml: 1
                }}>{userData.subscribersCount}
                </Typography>
            </Grid>
            <Grid size={{xs: 5, sm: 2}} container justifyContent="flex-start">
                <Typography variant="body1" sx={{
                    fontSize: {xs: '12px', sm: '16px'},
                    color: 'text.secondary',
                    justifyContent: 'flex-start',
                    textAlign: 'left',
                }}>
                    Друзей:
                </Typography>
                <Typography variant="body1" fontWeight="bold" sx={{
                    fontSize: {xs: '12px', sm: '16px'},
                    color: 'text.secondary',
                    justifyContent: 'flex-start',
                    textAlign: 'left',
                    ml: 1
                }}>{userData.friendsCount}
                </Typography>
            </Grid>
            <Grid size={{xs: 7, sm: 10}} container justifyContent="flex-start">
                <Typography variant="body1" sx={{
                    fontSize: {xs: '12px', sm: '16px'},
                    color: 'text.secondary',
                    justifyContent: 'flex-start',
                    textAlign: 'left',
                }}>
                    Подписок:
                </Typography>
                <Typography variant="body1" fontWeight="bold" sx={{
                    fontSize: {xs: '12px', sm: '16px'},
                    color: 'text.secondary',
                    justifyContent: 'flex-start',
                    textAlign: 'left',
                    ml: 1
                }}>{userData.favouritesCount}
                </Typography>
            </Grid>
        </Grid>
    );

    if (!isOwner && (isPublic || (isFriendsOnly && isFriend))) {
        return (
            <Box
                onClick={handleClick}
                sx={{
                    cursor: 'pointer',
                    '&:hover': {
                        opacity: 0.8
                    }
                }}
            >
                {content}
            </Box>
        );
    }
    return content;
}

export default Counters;