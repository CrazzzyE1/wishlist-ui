import * as React from 'react';
import Grid from '@mui/material/Grid';
import NotificationsList from "./NotificationsList";

export default function NotificationsContent({itemMenu}) {
    return (
        <Grid spacing={3}>
            {itemMenu === 0 && <NotificationsList isUnread={true}/>}
            {itemMenu === 1 && <NotificationsList/>}
        </Grid>
    );
}