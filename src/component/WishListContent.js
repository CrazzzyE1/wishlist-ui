import WishList from "./WishList";
import Grid from "@mui/material/Grid";
import Item from "./StyledItem";
import React, {useEffect, useState} from "react";
import Typography from "@mui/material/Typography";
import ListVertMenuSettings from "./ListVertMenuSettings";
import {httpClient} from "../http/HttpClient";
import {LinearProgress} from "@mui/material";
import GiftCreator from "./GiftCreator";

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
                            userId={userId}
                            onGiftCreated={onGiftCreated}
                            lists={lists}
                            selectedWishlistId={selectedWishlistId}
                        />
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