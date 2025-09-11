import * as React from "react";
import {Typography} from "@mui/material";

const formatDate = (dateString) => {
    const options = {day: 'numeric', month: 'long', year: 'numeric'};
    return dateString ? new Date(dateString).toLocaleDateString('ru-RU', options) : 'Без даты';
};

function EventsInfo({event}) {
    return (
        <Typography variant="body2" color="text.secondary" sx={{
            fontSize: {xs: '12px', sm: '16px'},
            color: 'text.secondary',
            justifyContent: 'flex-start',
            textAlign: 'left',
        }}>
            {formatDate(event.eventDate)} - {event.name}
        </Typography>
    );
}

export default EventsInfo;