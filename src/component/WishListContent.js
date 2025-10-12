import WishList from "./WishList";
import Grid from "@mui/material/Grid";
import Item from "./StyledItem";
import React, {useEffect, useState} from "react";
import Typography from "@mui/material/Typography";
import ListVertMenuSettings from "./ListVertMenuSettings";
import {httpClient} from "../http/HttpClient";
import {Box, LinearProgress, Tooltip} from "@mui/material";
import GiftCreator from "./GiftCreator";
import IconButton from "@mui/material/IconButton";
import {getUserIdFromToken} from "../utils/Auth";
import keycloak from "../keycloak/Keycloak";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import {blue, grey} from "@mui/material/colors";
import ShareLinkModal from "./ShareLinkModal";

function WishListContent({
                             selectedWishlistId,
                             isOwner,
                             onListDeleted,
                             onGiftEdit,
                             onListEdit,
                             editRefreshKey,
                             onGiftDeleted,
                             lists,
                             userId,
                             onGiftCreated,
                             refreshKey,
                         }) {
    const [wishlistData, setWishlistData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openShareModal, setOpenShareModal] = useState(false);

    const ownerId = getUserIdFromToken(keycloak.token);

    const handleSharedClick = () => {
        setOpenShareModal(true);
    };

    useEffect(() => {
        if (selectedWishlistId) {
            fetchWishlistData();
        }
    }, [selectedWishlistId, editRefreshKey, refreshKey]);

    const fetchWishlistData = async () => {
        let response;
        try {
            setLoading(true);
            if (selectedWishlistId === "default") {
                const url = userId
                    ? `/gifts/user/${userId}?withList=false`
                    : `/gifts/me?withList=false`;
                response = await httpClient.get(url);
            } else {
                response = await httpClient.get(`/wishlists/${selectedWishlistId}`);
            }
            setWishlistData(response.data);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LinearProgress color="success"/>;
    if (error) return <Typography color="error">Ошибка: {error}</Typography>;
    if (!wishlistData) return <Typography>Выберите список</Typography>;

    const formatDate = (dateString) => {
        const options = {day: "numeric", month: "long", year: "numeric"};
        return dateString
            ? new Date(dateString).toLocaleDateString("ru-RU", options)
            : null;
    };

    const checkName = (name) => {
        return name ? name : "Без списка";
    };

    const resolvePrivacyLevel = (wishlistData) => {
        if (selectedWishlistId === "default") {
            return "PUBLIC";
        }
        return wishlistData.privacyLevel;
    };

    const resolveItemList = (wishlistData) => {
        if (selectedWishlistId === "default") {
            return wishlistData;
        }
        return wishlistData.gifts;
    };

    return (
        <Grid container spacing={2} sx={{flexGrow: 1}}>
            {isOwner ? (
                    <Grid size={{xs: 12, sm: 12}}
                          sx={{
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              mb: {sm: 1}
                          }}>
                        <GiftCreator
                            onGiftCreated={onGiftCreated}
                            lists={lists}
                            selectedWishlistId={selectedWishlistId}
                        />
                        <Grid size={{xs: 2, sm: 1}}>
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                gap: {xs: 0, sm: 1},
                                mt: 0
                            }}>
                                <IconButton
                                    onClick={handleSharedClick}
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        width: {xs: 40, sm: 48},
                                        height: {xs: 40, sm: 48},
                                        borderRadius: '50%',
                                        '&:hover': {
                                            '& .MuiSvgIcon-root': {
                                                color: {xs: grey[400], sm: blue[400]},
                                            }
                                        },
                                        '&:active': {
                                            boxShadow: '0px 0px 10px rgba(0,0,0,0.2)'
                                        }
                                    }}
                                >
                                    <Tooltip title="Поделиться" placement="top-start" arrow>
                                        <ShareOutlinedIcon sx={{
                                            color: grey[600],
                                            fontSize: {
                                                xs: 28, sm: 40
                                            },
                                            transition: 'color 0.5s ease'
                                        }}/>
                                    </Tooltip>
                                </IconButton>
                            </Box>
                            <ShareLinkModal
                                id={selectedWishlistId}
                                sublink={`users/${ownerId}/wishlists`}
                                open={openShareModal}
                                onClose={() => setOpenShareModal(false)}
                            />

                        </Grid>
                    </Grid>
                )
                : null
            }
            <Grid size={{xs: 5, sm: 9}}>
                <Item noshadow>
                    <Typography
                        variant="body1"
                        sx={{
                            fontSize: {xs: '0.75rem', sm: '1rem'},
                            color: "text.secondary",
                            textAlign: "left"
                        }}
                    >
                        {checkName(wishlistData.name)}
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            fontSize: {xs: '0.6rem', sm: '0.8rem'},
                            color: "text.secondary",
                            textAlign: "left"
                        }}
                    >
                        {formatDate(wishlistData.eventDate)}
                    </Typography>
                </Item>
            </Grid>
            <Grid size={{xs: 5, sm: 2}} container sx={{flexGrow: 1}} justifyContent="flex-start">
                <Item noshadow>
                    <Typography
                        variant="body1"
                        sx={{
                            fontSize: {xs: '0.75rem', sm: '1rem'},
                            color: "text.secondary",
                            textAlign: "left",
                            pl: "0px",
                        }}
                    >
                        Приватность:
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            fontSize: {xs: '0.6rem', sm: '0.8rem'},
                            color: "text.secondary",
                            textAlign: "left",
                            pl: "0px",
                        }}
                    >
                        {resolvePrivacyLevel(wishlistData) === 'PRIVATE' ? 'Приватный' :
                            resolvePrivacyLevel(wishlistData) === 'PUBLIC' ? 'Публичный' : 'Только друзья'}
                    </Typography>
                </Item>
            </Grid>
            <Grid size={{xs: 2, sm: 1}} container sx={{flexGrow: 1}} justifyContent="flex-end" alignItems="flex-start">
                {isOwner && selectedWishlistId !== "default" && (
                    <ListVertMenuSettings
                        selectedWishlistId={selectedWishlistId}
                        onListDeleted={onListDeleted}
                        onListEdit={onListEdit}
                    />
                )}
            </Grid>
            <Grid size={{xs: 12, sm: 12}}>
                <Item noshadow>
                    <WishList
                        data={resolveItemList(wishlistData)}
                        isOwner={isOwner}
                        onGiftDeleted={onGiftDeleted}
                        onGiftEdit={onGiftEdit}
                        lists={lists}
                    />
                </Item>
            </Grid>
        </Grid>
    );
}

export default WishListContent