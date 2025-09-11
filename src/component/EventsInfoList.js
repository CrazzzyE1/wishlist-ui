import EventsInfo from "./EventsInfo";
import Grid from "@mui/material/Grid";
import * as React from "react";
import {Typography} from "@mui/material";

function EventsInfoList({events = []}) {
    const filteredAndSortedEvents = React.useMemo(() => {
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        return events
            .filter(event => event.eventDate && new Date(event.eventDate) >= currentDate)
            .filter(event => event.isOwner || event.privacyLevel !== "PRIVATE")
            .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate))
            .slice(0, 3);
    }, [events]);

    return (
        <Grid container spacing={{xs: 0, sm: 1}}>
            <Grid size={{xs: 12, sm: 12}}>
                <Typography fontWeight="bold" sx={{
                    fontSize: {xs: '12px', sm: '16px'},
                    color: 'text.secondary',
                    justifyContent: 'flex-start',
                    textAlign: 'left',
                }}>
                    Ближайшие события:
                </Typography>
            </Grid>
            <Grid size={{xs: 12, sm: 12}}>
                {filteredAndSortedEvents.length > 0 ? (
                    filteredAndSortedEvents.map((event) => (
                        <EventsInfo
                            event={event}
                            key={event.id}
                        />
                    ))
                ) : (
                    <Typography variant="body2" color="text.secondary" sx={{
                        fontSize: {xs: '12px', sm: '16px'},
                        color: 'text.secondary',
                        justifyContent: 'flex-start',
                        textAlign: 'left',
                    }}>
                        Нет предстоящих событий
                    </Typography>
                )}
            </Grid>
        </Grid>
    );
}

export default EventsInfoList;