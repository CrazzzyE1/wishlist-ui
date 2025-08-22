import * as React from 'react';
import {useEffect, useState} from 'react';
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
import {useNotifications} from "./NotificationsContext";

export default function ProfilePage({userId}) {

    const [selectedWishlistId, setSelectedWishlistId] = useState(null);
    const [isOwner, setIsOwner] = useState();
    const [privacyLevel, setPrivacyLevel] = useState();
    const [refreshKey, setRefreshKey] = useState(0);
    const [profileRefreshKey, setProfileRefreshKey] = useState(0);
    const [refreshCounterKey, setRefreshCounterKey] = useState(0);
    const [editRefreshKey, setEditRefreshKey] = useState(0);
    const [lists, setLists] = useState();
    const [isFriend, setIsFriend] = useState(null);
    const {fetchUnreadCount} = useNotifications();

    const onGiftCreated = (newListId) => {
        setRefreshKey(prev => prev + 1);
        setRefreshCounterKey(prev => prev + 1);
        setSelectedWishlistId(newListId);
    };

    const onListCreated = (newListId) => {
        setRefreshKey(prev => prev + 1);
        setSelectedWishlistId(newListId);
    };

    const onProfileEdit = () => {
        setProfileRefreshKey(prev => prev + 1);
    };

    const onListGetting = (lists) => {
        setLists(lists);
    };

    const onListDeleted = () => {
        setRefreshKey(prev => prev + 1);
        setRefreshCounterKey(prev => prev + 1);
        setSelectedWishlistId(null);
    };

    const onGiftDeleted = () => {
        setEditRefreshKey(prev => prev + 1);
        setRefreshCounterKey(prev => prev + 1);
    };

    const onGiftEdit = () => {
        setEditRefreshKey(prev => prev + 1);
    };

    const onListEdit = (newListId) => {
        setRefreshKey(prev => prev + 1);
        setEditRefreshKey(prev => prev + 1);
        setSelectedWishlistId(newListId);
    };

    useEffect(() => {
        fetchUnreadCount();
    }, [fetchUnreadCount]);

    return (
        <React.Fragment>
            <CssBaseline/>
            <Container sx={{pt: 2}}>
                <Box sx={{flexGrow: 1}}>
                    <Grid container spacing={3}>
                        <Grid size={12}>
                            <Item><TopMenu
                                onProfileEdit={onProfileEdit}
                            /></Item>
                        </Grid>
                        <Grid container spacing={3} size={12}>
                            <Grid size={1}>
                                <Item>
                                    <MainMenu
                                        isOwner={isOwner}
                                        onListCreated={onListCreated}
                                        onGiftCreated={onGiftCreated}
                                        lists={lists}
                                    />
                                </Item>
                            </Grid>
                            <Grid container spacing={3} size={11}>
                                <Grid size={12}>
                                    <Item>
                                        <AccountInfo
                                            refreshCounterKey={refreshCounterKey}
                                            profileRefreshKey={profileRefreshKey}
                                            userId={userId}
                                            events={lists}
                                            onIsOwner={setIsOwner}
                                            onPrivacyLevel={setPrivacyLevel}
                                            onIsFriend={setIsFriend}
                                        />
                                    </Item>
                                </Grid>
                                {isOwner || privacyLevel === 'PUBLIC' || (privacyLevel === 'FRIENDS_ONLY' && isFriend) ?
                                    (<>
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
                                                <WishListContent selectedWishlistId={selectedWishlistId}
                                                                 isOwner={isOwner}
                                                                 editRefreshKey={editRefreshKey}
                                                                 onListDeleted={onListDeleted}
                                                                 onGiftDeleted={onGiftDeleted}
                                                                 onGiftEdit={onGiftEdit}
                                                                 onListEdit={onListEdit}
                                                                 lists={lists}
                                                                 userId={userId}
                                                />
                                            </Item>
                                        </Grid>
                                    </>)
                                    :
                                    null
                                }
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </React.Fragment>
    );
}