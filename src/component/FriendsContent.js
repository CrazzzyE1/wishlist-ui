import * as React from 'react';
import Grid from '@mui/material/Grid';
import FriendsList from "./FriendsList";
import FavouritesList from "./FavouritesList";
import IncomingFriendRequestList from "./IncomingFriendRequestList";
import OutcomingFriendRequestList from "./OutcomingFriendRequestList";
import SubscribersList from "./SubscribersList";

export default function FriendsContent({itemMenu}) {
    return (
        <Grid spacing={3}>
            {itemMenu === 0 && <FriendsList/>}
            {itemMenu === 1 && <FavouritesList/>}
            {itemMenu === 2 && <SubscribersList/>}
            {itemMenu === 3 && <IncomingFriendRequestList/>}
            {itemMenu === 4 && <OutcomingFriendRequestList/>}
        </Grid>
    );
}