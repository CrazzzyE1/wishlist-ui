import * as React from 'react';
import Grid from '@mui/material/Grid';
import OthersFriendsList from "./OthersFriendsList";

export default function OthersFriendsContent({itemMenu, userData}) {
    return (
        <Grid spacing={3}>
            {itemMenu === 0 && <OthersFriendsList
                userData={userData}
            />}
            {/*{itemMenu === 1 && <FavouritesList/>}*/}
        </Grid>
    );
}