import WishList from "./WishList";
import Grid from "@mui/material/Grid";
import Item from "./StyledItem";
import {useEffect, useState} from "react";
import Typography from "@mui/material/Typography";
import ListVertMenuSettings from "./ListVertMenuSettings";
import {httpClient} from "../http/HttpClient";

function WishListContent({
                             selectedWishlistId,
                             isOwner,
                             onListDeleted,
                             onGiftEdit,
                             onListEdit,
                             editRefreshKey,
                             onGiftDeleted,
                             lists,
                             userId
                         }) {
    const [wishlistData, setWishlistData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (selectedWishlistId) {
            fetchWishlistData();
        }
    }, [selectedWishlistId, editRefreshKey]);

    const fetchWishlistData = async () => {
        let response;
        try {
            setLoading(true);
            if (selectedWishlistId === 'default') {
                const url = userId ? `/gifts/user/${userId}?withList=false`
                    : `/gifts/me?withList=false`
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

    if (loading) return <Typography>Загрузка...</Typography>;
    if (error) return <Typography color="error">Ошибка: {error}<    /Typography>;
    if (!wishlistData) return <Typography>Выберите список</Typography>;

    const formatDate = (dateString) => {
        const options = {day: 'numeric', month: 'long', year: 'numeric'};
        return dateString ? new Date(dateString).toLocaleDateString('ru-RU', options) : null;
    };
    const checkName = (name) => {
        return name ? name : "Без списка";
    };
    const resolvePrivacyLevel = (wishlistData) => {
        if (selectedWishlistId === 'default') {
            return 'PUBLIC';
        }
        return wishlistData.privacyLevel;
    };

    const resolveItemList = (wishlistData) => {
        if (selectedWishlistId === 'default') {
            return wishlistData;
        }
        return wishlistData.gifts;
    };

    return (
        <Grid container spacing={3}>
            <Grid size={9}>
                <Item noshadow>
                    <Typography
                        variant="body1"
                        sx={{
                            fontSize: '22px',
                            color: 'text.secondary',
                            textAlign: 'left',
                            pl: '10px'
                        }}>
                        {checkName(wishlistData.name)}
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            fontSize: '14px',
                            color: 'text.secondary',
                            textAlign: 'left',
                            pl: '10px'
                        }}>
                        {formatDate(wishlistData.eventDate)}
                    </Typography>
                </Item>
            </Grid>
            <Grid size={2} container justifyContent="flex-start" sx={{paddingLeft: '0px'}}>
                <Item noshadow>
                    <Typography
                        variant="body1"
                        sx={{
                            fontSize: '16px',
                            color: 'text.secondary',
                            textAlign: 'left',
                            pl: '0px'
                        }}>
                        Приватность:
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            fontSize: '12px',
                            color: 'text.secondary',
                            textAlign: 'left',
                            pl: '0px'
                        }}>
                        {resolvePrivacyLevel(wishlistData)}
                    </Typography>
                </Item>
            </Grid>
            <Grid size={1}>
                {isOwner && selectedWishlistId !== 'default' && (
                    <ListVertMenuSettings
                        selectedWishlistId={selectedWishlistId}
                        onListDeleted={onListDeleted}
                        onListEdit={onListEdit}
                    />
                )}
            </Grid>
            <Grid size={12}>
                <Item noshadow><WishList
                    data={resolveItemList(wishlistData)}
                    isOwner={isOwner}
                    onGiftDeleted={onGiftDeleted}
                    onGiftEdit={onGiftEdit}
                    lists={lists}
                /></Item>
            </Grid>
        </Grid>
    );
}

export default WishListContent;