import EventsInfo from "./EventsInfo";
import Grid from "@mui/material/Grid";
import * as React from "react";
import Box from "@mui/material/Box";
import {Typography} from "@mui/material";

function EventsInfoList() {
    return (
        <Grid container justifyContent="flex-start" spacing={1}>
            <Grid size={12} container justifyContent="flex-start" sx={{paddingLeft: '22px'}}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start'
                }}>
                    <Typography variant="body1"><b>Ближайшие события:</b></Typography>
                </Box>
            </Grid>
            <Grid size={4}></Grid>
            <Grid size={8} justifyContent="flex-start">
                <Grid container justifyContent="flex-start" spacing={1} sx={{paddingLeft: '22px'}}>
                    <Grid size={12} justifyContent="flex-start">
                        <EventsInfo/>
                    </Grid>
                    <Grid size={12} justifyContent="flex-start">
                        <EventsInfo/>
                    </Grid>
                    <Grid size={12} justifyContent="flex-start">
                        <EventsInfo/>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default EventsInfoList;

