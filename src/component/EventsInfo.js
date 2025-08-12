import Grid from "@mui/material/Grid";
import * as React from "react";

const formatDate = (dateString) => {
    const options = {day: 'numeric', month: 'long', year: 'numeric'};
    return dateString ? new Date(dateString).toLocaleDateString('ru-RU', options) : 'Без даты';
};

function EventsInfo({event}) {
    return (
        <Grid container justifyContent="flex-start" sx={{ paddingLeft: '22px' }} spacing={1}>
            <Grid size={12} container justifyContent="flex-start" >
                <span>{formatDate(event.eventDate)} - {event.name}</span>
            </Grid>
        </Grid>
    );
}

export default EventsInfo;