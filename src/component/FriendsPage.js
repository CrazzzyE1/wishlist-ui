import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import {CssBaseline} from "@mui/material";
import MainMenu from "./MainMenu";
import TopMenu from "./TopMenu";
import Item from "./StyledItem";
import FriendsPageMenu from "./FriendsPageMenu";
import FriendsContent from "./FriendsContent";

export default function FriendsPage() {

    const [avatarUrl, setAvatarUrl] = React.useState(null);
    const [itemMenu, setItemMenu] = React.useState(0);

    return (
        <React.Fragment>
            <CssBaseline/>
            <Container sx={{pt: 2}}>
                <Box sx={{flexGrow: 1}}>
                    <Grid container spacing={3}>
                        <Grid size={12}>
                            <Item><TopMenu avatarUrl={avatarUrl}/></Item>
                        </Grid>
                        <Grid container spacing={3} size={12}>
                            <Grid size={1}>
                                <Item>
                                    <MainMenu/></Item>
                            </Grid>
                            <Grid container spacing={3} size={11}>
                                <Grid size={12}>
                                    <Item >
                                        <Grid size={12}>
                                            <Item noshadow>
                                                <FriendsPageMenu onItemMenu={setItemMenu}/>
                                            </Item>
                                        </Grid>
                                        <Grid size={12}>
                                            <Item noshadow>
                                                <FriendsContent itemMenu={itemMenu}/>
                                            </Item>
                                        </Grid>
                                    </Item>
                                </Grid>

                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </React.Fragment>
    );
}