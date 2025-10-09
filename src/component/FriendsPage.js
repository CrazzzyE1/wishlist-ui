import * as React from 'react';
import {useEffect} from 'react';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import {CssBaseline} from "@mui/material";
import TopMenu from "./TopMenu";
import Item from "./StyledItem";
import FriendsPageMenu from "./FriendsPageMenu";
import FriendsContent from "./FriendsContent";
import {useNotifications} from "./NotificationsContext";

export default function FriendsPage() {

    const [itemMenu, setItemMenu] = React.useState(0);
    const {fetchUnreadCount, fetchIncomingFriendsRequestCount} = useNotifications();

    useEffect(() => {
        fetchUnreadCount();
        fetchIncomingFriendsRequestCount();
    }, [fetchUnreadCount, fetchIncomingFriendsRequestCount]);

    return (
        <React.Fragment>
            <CssBaseline/>
            <Container sx={{pt: 2}}>
                <Grid container spacing={3}>
                    <Grid size={{xs: 12, sm: 12}}>
                        <Item>
                            <TopMenu/>
                        </Item>
                    </Grid>
                    <Grid size={{xs: 12, sm: 12}}>
                        <Item>
                            <Grid size={{xs: 12, sm: 12}}>
                                <Item noshadow>
                                    <FriendsPageMenu onItemMenu={setItemMenu}/>
                                </Item>
                            </Grid>
                            <Grid size={{xs: 12, sm: 12}}>
                                <Item noshadow>
                                    <FriendsContent itemMenu={itemMenu}/>
                                </Item>
                            </Grid>
                        </Item>
                    </Grid>
                </Grid>
            </Container>
        </React.Fragment>
    );
}