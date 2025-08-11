import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import RedeemOutlinedIcon from '@mui/icons-material/RedeemOutlined';
import InsertLinkOutlinedIcon from '@mui/icons-material/InsertLinkOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import AddToPhotosOutlinedIcon from '@mui/icons-material/AddToPhotosOutlined';
import {ExpandMoreButton} from "./ExpandMoreButton";
import {Tooltip} from "@mui/material";
import {httpClient} from "../http/HttpClient";

export default function GiftCard({data, isOwner}) {
    const [expanded, setExpanded] = React.useState(false);
    const [imageUrl, setImageUrl] = React.useState(null);

    React.useEffect(() => {
        const fetchImage = async () => {
            try {
                const response = await httpClient.get(`http://localhost:9000/api/v1/pictures/gift/${data.id}?size=MEDIUM`, {
                    responseType: 'arraybuffer'
                });

                const base64 = btoa(
                    new Uint8Array(response.data).reduce(
                        (data, byte) => data + String.fromCharCode(byte), '')
                );
                setImageUrl(`data:image/jpeg;base64,${base64}`);
            } catch (error) {
                console.error('Ошибка загрузки изображения:', error);
                // Можно установить fallback изображение
                // setImageUrl('https://via.placeholder.com/191x210');
            }
        };

        if (data.id) {
            fetchImage();
        }
    }, [data.id]);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const getShortName = (name) => {
        if (!name) return 'Без названия';

        if (name.length > 31) {
            return `${name.substring(0, 31)}...`;
        }

        return name;
    };

    return (
        <Card sx={{maxWidth: 191, minWidth: 191}}>
            <CardHeader
                sx={{
                    padding: "10px"
                }}
                avatar={
                    <Avatar
                        sx={{
                            width: "36px",
                            bgcolor: "#ffffff",
                            color: "gray",
                        }}
                        aria-label="recipe">
                        <RedeemOutlinedIcon sx={{
                            fontSize: 36
                        }}/>
                    </Avatar>
                }
                title=
                    {
                        <Tooltip title={data.name} placement="top-start" arrow>
                            <span>{getShortName(data.name)}</span>
                        </Tooltip>
                    }
            />
            <CardMedia
                component="img"
                height="210"
                image={imageUrl}
                alt="Paella dish"
            />
            <CardContent>
                <Tooltip title={`${data.price.amount} ${data.price.currency}`} placement="top-start" arrow>
                    <Typography variant="body1" sx={{color: 'text.secondary', textAlign: 'left', pl: '10px'}}>
                        Цена: {data.price.amount} {data.price.currency}
                    </Typography>
                </Tooltip>
            </CardContent>
            <CardActions disableSpacing>
                <IconButton
                    aria-label="like"
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: 42,
                        height: 42,
                        borderRadius: '50%',
                        '&:hover': {
                            '& .MuiSvgIcon-root': {
                                color: '#000000'
                            }
                        },
                        '&:active': {
                            boxShadow: '0px 0px 10px rgba(0,0,0,0.2)'
                        }
                    }}>
                    <FavoriteBorderOutlinedIcon
                        sx={{
                            transition: 'color 0.5s ease'
                        }}
                    />
                </IconButton>
                <IconButton
                    aria-label="link"
                    onClick={() => {
                        if (data.link) {
                            window.open(data.link, '_blank', 'noopener,noreferrer');
                        }
                    }}
                    disabled={!data.link}
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: 42,
                        height: 42,
                        borderRadius: '50%',
                        '&:hover': {
                            '& .MuiSvgIcon-root': {
                                color: data.link ? '#000000' : 'rgba(0,0,0,0.26)'
                            }
                        },
                        '&:active': {
                            boxShadow: data.link ? '0px 0px 10px rgba(0,0,0,0.2)' : 'none'
                        },
                        '&.Mui-disabled': {
                            opacity: 0.5
                        }
                    }}
                >
                    <InsertLinkOutlinedIcon
                        sx={{
                            transition: 'color 0.5s ease',
                            color: data.link ? 'inherit' : 'rgba(0,0,0,0.26)'
                        }}
                    />
                </IconButton>
                <IconButton
                    aria-label="clone"
                    disabled={isOwner}
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: 42,
                        height: 42,
                        borderRadius: '50%',
                        '&:hover': {
                            '& .MuiSvgIcon-root': {
                                color: '#000000'
                            }
                        },
                        '&:active': {
                            boxShadow: '0px 0px 10px rgba(0,0,0,0.2)'
                        }
                    }}>
                    <AddToPhotosOutlinedIcon
                        sx={{
                            transition: 'color 0.5s ease'
                        }}
                    />
                </IconButton>
                <ExpandMoreButton
                    description={data.description}
                    expanded={expanded}
                    onExpandClick={handleExpandClick}
                />
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    <Typography sx={{marginBottom: 2}}>Описание:</Typography>
                    <Typography sx={{marginBottom: 2}}>
                        {data.description}
                    </Typography>
                </CardContent>
            </Collapse>
        </Card>
    );
}