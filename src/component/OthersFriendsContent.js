import * as React from 'react';
import Grid from '@mui/material/Grid';
import OthersFriendsList from "./OthersFriendsList";
import OthersSubscribersList from "./OthersSubscribersList";

export default function OthersFriendsContent({itemMenu, userData}) {
    return (
        <Grid spacing={3}>
            {itemMenu === 0 && <OthersFriendsList
                userData={userData}
            />
            }
            {itemMenu === 1 && <OthersSubscribersList
                userData={userData}
            />
            }
        </Grid>
    );
}