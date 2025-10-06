import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import {green, pink, yellow} from "@mui/material/colors";
import {httpClient} from "../http/HttpClient";

function WishListsItemInfo({onWishlistSelect, refreshKey, selectedWishlistId, onListGetting, userId}) {
    const [wishlists, setWishlists] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    const fetchWishlists = async () => {
        try {
            setLoading(true);
            const url = userId
                ? `/wishlists/user/${userId}`
                : '/wishlists/me';

            const response = await httpClient.get(url);
            const dataWithDefault = [
                ...response.data,
                {
                    id: 'default',
                    name: 'Без списка',
                    privacyLevel: 'PUBLIC',
                    eventDate: null
                }
            ];

            setWishlists(dataWithDefault);

            if (onListGetting) {
                onListGetting(response.data);
            }

            if (selectedWishlistId) {
                onWishlistSelect?.(selectedWishlistId);
            } else {
                const firstId = response.data[0]?.id || 'default';
                onWishlistSelect?.(firstId);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCardClick = (id) => {
        onWishlistSelect?.(id);
    };

    React.useEffect(() => {
        fetchWishlists();
    }, [refreshKey]);

    const getPrivacyColor = (privacyLevel, shade = 50) => {
        switch (privacyLevel) {
            case 'PUBLIC':
                return green[shade];
            case 'PRIVATE':
                return pink[shade];
            case 'FRIENDS_ONLY':
                return yellow[shade];
            default:
                return 'background.paper';
        }
    };

    if (loading) return <Typography>Загрузка...</Typography>;
    if (error) return <Typography color="error">Ошибка: {error}</Typography>;

    const formatDate = (dateString) => {
        const options = {day: 'numeric', month: 'long', year: 'numeric'};
        return dateString ? new Date(dateString).toLocaleDateString('ru-RU', options) : 'Без даты';
    };

    return (
        <Box
            sx={{
                width: '100%',
                display: 'grid',
                gridTemplateColumns: {
                    xs: 'repeat(auto-fill, minmax(min(100px, 100%), 1fr))',
                    sm: 'repeat(auto-fill, minmax(min(160px, 100%), 1fr))'},
                gap: {xs: 1, sm: 2},
            }}
        >
            {wishlists.map((wishlist) => {
                const isSelected = wishlist.id === selectedWishlistId;
                const bgColor = getPrivacyColor(wishlist.privacyLevel, isSelected ? 200 : 50);

                return (
                    <Card
                        key={wishlist.id}
                        sx={{
                            borderRadius: 3,
                            boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                            transition: "transform 0.2s ease, box-shadow 0.3s ease",
                            "&:hover": {
                                transform: "translateY(-3px)",
                                boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
                            },
                        }}
                    >
                        <CardActionArea
                            onClick={() => handleCardClick(wishlist.id)}
                            sx={{
                                height: '100%',
                                backgroundColor: bgColor,
                                transition: 'background-color 0.3s ease',
                                "&:hover": {
                                    backgroundColor: isSelected
                                        ? getPrivacyColor(wishlist.privacyLevel, 100)
                                        : getPrivacyColor(wishlist.privacyLevel, 200),
                                },
                            }}
                        >
                            <CardContent sx={{p: {xs: 1, sm: 2}}}>
                                <Typography
                                    variant="h6"
                                    component="div"
                                    sx={{
                                        fontWeight: 600,
                                        fontSize: {xs: '0.75rem', sm: '1rem'},
                                        lineHeight: 1.3,
                                        display: "-webkit-box",
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: "vertical",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        color: isSelected ? "black" : "grey.800",
                                    }}
                                >
                                    {wishlist.name}
                                </Typography>

                                {wishlist.id !== "default" && (
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            mt: {xs: 0.5, sm: 1},
                                            color: isSelected ? "black" : "text.secondary",
                                            fontSize: {xs: '0.6rem', sm: '0.8rem'},
                                            fontStyle: wishlist.eventDate ? "normal" : "italic",
                                        }}
                                    >
                                        {formatDate(wishlist.eventDate)}
                                    </Typography>
                                )}
                            </CardContent>
                        </CardActionArea>
                    </Card>
                );
            })}
        </Box>
    );
}

export default WishListsItemInfo;
