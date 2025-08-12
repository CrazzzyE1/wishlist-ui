import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import FriendsList from "./FriendsList";

export default function FriendsContent({itemMenu}) {
    return (
        <Box sx={{flexGrow: 1}}>
            <Grid container spacing={3}>
                {itemMenu === 0 && <FriendsList/>}
                {itemMenu === 1 && <FriendsList/>}
                {itemMenu === 2 && <FriendsList/>}
            </Grid>
        </Box>
    );
}