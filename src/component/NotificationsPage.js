import * as React from 'react';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import {CssBaseline} from "@mui/material";
import MainMenu from "./MainMenu";
import TopMenu from "./TopMenu";
import Item from "./StyledItem";
import NotificationsPageMenu from "./NotificationsPageMenu";
import NotificationsContent from "./NotificationsContent";

export default function NotificationsPage() {

    const [itemMenu, setItemMenu] = React.useState(0);

    return (
        <React.Fragment>
            <CssBaseline/>
            <Container sx={{pt: 2}}>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, sm: 12 }}>
                            <Item><TopMenu/></Item>
                        </Grid>
                        <Grid container spacing={3} size={{xs: 12, sm: 12}}>
                            <Grid size={{ xs: 12, sm: 1 }}>
                                <Item>
                                    <MainMenu/></Item>
                            </Grid>
                            <Grid container spacing={3} size={{ xs: 12, sm: 11 }}>
                                <Grid size={{ xs: 12, sm: 12 }}>
                                    <Item >
                                        <Grid size={{ xs: 12, sm: 12 }}>
                                            <Item noshadow>
                                                <NotificationsPageMenu onItemMenu={setItemMenu}/>
                                            </Item>
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 12 }}>
                                            <Item noshadow>
                                                <NotificationsContent itemMenu={itemMenu}/>
                                            </Item>
                                        </Grid>
                                    </Item>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
            </Container>
        </React.Fragment>
    );
}