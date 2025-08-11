import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import {green, pink, yellow} from "@mui/material/colors";
import {httpClient} from "../http/HttpClient";

function WishListsItemInfo({onWishlistSelect, refreshKey, selectedWishlistId}) {
    const [wishlists, setWishlists] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    const fetchWishlists = async () => {
        try {
            setLoading(true);
            const response = await httpClient.get('http://localhost:9000/api/v1/wishlists/me');
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

    const formatBirthDate = (dateString) => {
        const options = {day: 'numeric', month: 'long', year: 'numeric'};
        return dateString ? new Date(dateString).toLocaleDateString('ru-RU', options) : null;
    };

    return (
        <Box sx={{
            width: '100%',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(170px, 100%), 1fr))',
            gap: 2,
        }}>
            {wishlists.map((wishlist) => {
                const isSelected = wishlist.id === selectedWishlistId;
                const bgColor = getPrivacyColor(wishlist.privacyLevel, isSelected ? 200 : 50);

                return (
                    <Card key={wishlist.id}>
                        <CardActionArea
                            onClick={() => handleCardClick(wishlist.id)}
                            sx={{
                                height: '100%',
                                backgroundColor: bgColor,
                                '&:hover': {
                                    backgroundColor: isSelected
                                        ? getPrivacyColor(wishlist.privacyLevel, 100)
                                        : getPrivacyColor(wishlist.privacyLevel, 200),
                                },
                                '&.MuiCardActionArea-root': {
                                    transition: 'background-color 0.3s ease',
                                }
                            }}
                        >
                            <CardContent sx={{height: '100%', pt: 0}}>
                                <Typography variant="h6" component="div"
                                            color={isSelected ? 'black' : 'grey.700'}>
                                    {wishlist.name}
                                </Typography>
                                <Typography variant="body2"
                                            color={isSelected ? 'black' : 'text.secondary'}>
                                    {formatBirthDate(wishlist.eventDate)}
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                );
            })}
        </Box>
    );
}

export default WishListsItemInfo;