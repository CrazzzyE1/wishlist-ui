import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import {CssBaseline} from "@mui/material";
import MainMenu from "./MainMenu";
import AccountInfo from "./AccountInfo";
import TopMenu from "./TopMenu";
import Item from "./StyledItem";
import WishLists from "./WishLists";
import WishListContent from "./WishListContent";

export default function ProfilePage() {

    const [selectedWishlistId, setSelectedWishlistId] = React.useState(null);
    const [isOwner, setIsOwner] = React.useState();

    return (
        <React.Fragment>
            <CssBaseline/>
            <Container sx={{pt: 2}}>
                <Box sx={{flexGrow: 1}}>
                    <Grid container spacing={3}>
                        <Grid size={12}>
                            <Item><TopMenu/></Item>
                        </Grid>
                        <Grid container spacing={3} size={12}>
                            <Grid size={1}>
                                <Item><MainMenu/></Item>
                            </Grid>
                            <Grid container spacing={3} size={11}>
                                <Grid size={12}>
                                    <Item>
                                        <AccountInfo
                                            onIsOwner={setIsOwner}/>
                                    </Item>
                                </Grid>
                                <Grid size={12}>
                                    <Item>
                                        <WishLists
                                            onWishlistSelect={setSelectedWishlistId}/>
                                    </Item>
                                </Grid>
                                <Grid size={12}>
                                    <Item>
                                        <WishListContent selectedWishlistId={selectedWishlistId} isOwner={isOwner}/>
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