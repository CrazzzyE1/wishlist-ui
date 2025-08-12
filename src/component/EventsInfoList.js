import EventsInfo from "./EventsInfo";
import Grid from "@mui/material/Grid";
import * as React from "react";
import Box from "@mui/material/Box";
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
                    <Grid item xs={12} justifyContent="flex-start">
                        {filteredAndSortedEvents.length > 0 ? (
                            filteredAndSortedEvents.map((event) => (
                                <EventsInfo
                                    event={event}
                                    key={event.id}
                                />
                            ))
                        ) : (
                            <Typography variant="body2" color="text.secondary">
                                Нет предстоящих событий
                            </Typography>
                        )}
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default EventsInfoList;