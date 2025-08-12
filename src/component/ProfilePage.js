import * as React from 'react';
import {useState} from 'react';
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

export default function ProfilePage({userId}) {

    const [selectedWishlistId, setSelectedWishlistId] = useState(null);
    const [isOwner, setIsOwner] = useState();
    const [refreshKey, setRefreshKey] = useState(0);
    const [lists, setLists] = useState();

    const onListCreated = (newListId) => {
        setRefreshKey(prev => prev + 1);
        setSelectedWishlistId(newListId);
    };

    const onListGetting = (lists) => {
        setLists(lists);
    };

    const onListDeleted = () => {
        setRefreshKey(prev => prev + 1);
        setSelectedWishlistId(null);
    };

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
                                <Item>
                                    <MainMenu
                                        isOwner={isOwner}
                                        onListCreated={onListCreated}
                                        lists={lists}
                                    />
                                </Item>
                            </Grid>
                            <Grid container spacing={3} size={11}>
                                <Grid size={12}>
                                    <Item>
                                        <AccountInfo
                                            userId={userId}
                                            events={lists}
                                            onIsOwner={setIsOwner}
                                        />
                                    </Item>
                                </Grid>
                                <Grid size={12}>
                                    <Item>
                                        <WishLists
                                            userId={userId}
                                            onListGetting={onListGetting}
                                            onWishlistSelect={setSelectedWishlistId}
                                            refreshKey={refreshKey}
                                            selectedWishlistId={selectedWishlistId}
                                        />
                                    </Item>
                                </Grid>
                                <Grid size={12}>
                                    <Item>
                                        <WishListContent selectedWishlistId={selectedWishlistId} isOwner={isOwner}
                                                         onListDeleted={onListDeleted}/>
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