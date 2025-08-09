import Grid from "@mui/material/Grid";
import * as React from "react";

function EventsInfo() {
    return (
        <Grid container justifyContent="flex-start" sx={{ paddingLeft: '22px' }} spacing={1}>
            <Grid size={12} container justifyContent="flex-start" >
                <span>5 августа 2025 - День города</span>
            </Grid>
        </Grid>
    );
}

export default EventsInfo;