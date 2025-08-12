import Grid from "@mui/material/Grid";
import * as React from "react";
import Box from "@mui/material/Box";
import {Typography} from "@mui/material";

function Counters({userData}) {

    return (
        <Box sx={{flexGrow: 1, pl: 0}}>
            <Grid container spacing={0}>
                <Grid size={12} container justifyContent="flex-start" sx={{paddingLeft: '22px'}}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start'
                    }}>
                        {/*fixme кол-во желаний поправить*/}
                        <Typography variant="body1">Желаний: <b>17</b> </Typography>
                    </Box>
                </Grid>
                <Grid size={12} container justifyContent="flex-start" sx={{paddingLeft: '22px'}}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start'
                    }}>
                        <Typography variant="body1">Друзей: <b>{userData.friendsCount}</b></Typography>
                    </Box>
                </Grid>
                <Grid size={12} container justifyContent="flex-start" sx={{paddingLeft: '22px'}}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start'
                    }}>
                        <Typography variant="body1">Подписки: <b>{userData.favouritesCount}</b></Typography>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}

export default Counters;