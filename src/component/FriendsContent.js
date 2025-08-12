import * as React from 'react';
import Grid from '@mui/material/Grid';
import FriendsList from "./FriendsList";
import FavouritesList from "./FavouritesList";

export default function FriendsContent({itemMenu}) {
    return (
        <Grid spacing={3}>
            {itemMenu === 0 && <FriendsList/>}
            {itemMenu === 1 && <FavouritesList/>}
            {itemMenu === 2 && <FavouritesList/>}
            {itemMenu === 3 && <FavouritesList/>}
        </Grid>
    );
}