import Grid from "@mui/material/Grid";
import * as React from "react";
import {Typography} from "@mui/material";

function Counters({userData, giftsCount}) {

    return (
        <Grid container spacing={0}>
            <Grid size={{xs: 12, sm: 12}} container justifyContent="flex-start">
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
            <Grid size={{xs: 12, sm: 12}} container justifyContent="flex-start">
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
            <Grid size={{xs: 12, sm: 12}} container justifyContent="flex-start">
                <Typography variant="body1" sx={{
                    fontSize: {xs: '12px', sm: '16px'},
                    color: 'text.secondary',
                    justifyContent: 'flex-start',
                    textAlign: 'left',
                }}>
                    Подписки:
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
}

export default Counters;