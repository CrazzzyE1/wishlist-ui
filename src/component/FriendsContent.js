import * as React from 'react';
import Grid from '@mui/material/Grid';
import FriendsList from "./FriendsList";

export default function FriendsContent({itemMenu}) {
    return (
        <Grid spacing={3}>
            {itemMenu === 0 && <FriendsList/>}
            {itemMenu === 1 && <FriendsList/>}
            {itemMenu === 2 && <FriendsList/>}
        </Grid>
    );
}