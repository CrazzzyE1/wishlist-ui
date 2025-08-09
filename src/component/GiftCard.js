import * as React from 'react';
import {styled} from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RedeemOutlinedIcon from '@mui/icons-material/RedeemOutlined';
import InsertLinkOutlinedIcon from '@mui/icons-material/InsertLinkOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import AddToPhotosOutlinedIcon from '@mui/icons-material/AddToPhotosOutlined';
import MoreVertMenuSettings from "./MoreVertMenuSettings";

const ExpandMore = styled((props) => {
    const {expand, ...other} = props;
    return <IconButton {...other} />;
})(({theme}) => ({
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
    variants: [
        {
            props: ({expand}) => !expand,
            style: {
                transform: 'rotate(0deg)',
            },
        },
        {
            props: ({expand}) => !!expand,
            style: {
                transform: 'rotate(180deg)',
            },
        },
    ],
}));

function ExpandMoreButton({ description, expanded, onExpandClick }) {
    if (!description) return null;

    return (
        <ExpandMore
            expand={expanded}
            onClick={onExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
        >
            <ExpandMoreIcon/>
        </ExpandMore>
    );
}


export default function GiftCard({data}) {
    const [expanded, setExpanded] = React.useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    return (
        <Card sx={{maxWidth: 243}}>
            <CardHeader
                avatar={
                    <Avatar
                        sx={{
                            bgcolor: "#ffffff",
                            color: "gray",

                        }}
                        aria-label="recipe">
                        <RedeemOutlinedIcon sx={{
                            fontSize: 36
                        }}/>
                    </Avatar>
                }
                action={
                    <MoreVertMenuSettings/>
                }
                title={data.name}
            />
            <CardMedia
                component="img"
                height="243"
                image="https://avatars.mds.yandex.net/get-goods_pic/13754523/hat81f158666324eef7a38fe825ef11b902/600x600"
                alt="Paella dish"
            />
            <CardContent>
                <Typography variant="body1" sx={{color: 'text.secondary', textAlign: 'left', pl: '10px'}}>
                    Цена: {data.price.amount} {data.price.currency}.
                </Typography>
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
                                color: data.link ? '#000000' : 'rgba(0,0,0,0.26)' // Серый если ссылки нет
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