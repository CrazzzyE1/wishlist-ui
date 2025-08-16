import {Fragment, useState, useEffect} from 'react';
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
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ListVertMenuSettings from "./ListVertMenuSettings";
import * as React from "react";
import GiftVertMenuSettings from "./GiftVertMenuSettings";

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
};

export default function GiftCard({data, isOwner}) {
    const [expanded, setExpanded] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);
    const [largeImageUrl, setLargeImageUrl] = useState(null);
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
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
                console.error('Error fetching medium image:', error);
            }
        };

        if (data.id) {
            fetchImage();
        }
    }, [data.id]);

    const fetchLargeImage = async () => {
        try {
            const response = await httpClient.get(`http://localhost:9000/api/v1/pictures/gift/${data.id}?size=LARGE`, {
                responseType: 'arraybuffer'
            });

            const base64 = btoa(
                new Uint8Array(response.data).reduce(
                    (data, byte) => data + String.fromCharCode(byte), '')
            );
            setLargeImageUrl(`data:image/jpeg;base64,${base64}`);
        } catch (error) {
            console.error('Error fetching large image:', error);
        }
    };

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const handleOpenModal = () => {
        fetchLargeImage();
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const getShortName = (name) => {
        if (!name) return 'Без названия';

        if (name.length > 31) {
            return `${name.substring(0, 31)}...`;
        }

        return name;
    };

    return (
        <>
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
                <div
                    style={{position: 'relative'}}
                >
                    <CardMedia
                        component="img"
                        height="210"
                        image={imageUrl}
                        alt="Gift image"
                        onClick={handleOpenModal}
                        style={{cursor: 'pointer'}}
                    />
                </div>
                <CardContent>
                    {data.price.amount ? (
                        <Tooltip title={`${data.price.amount} ${data.price.currency}`} placement="top-start" arrow>
                            <Typography variant="body1" sx={{color: 'text.secondary', textAlign: 'left', pl: '10px'}}>
                                Цена: {data.price.amount} {data.price.currency}
                            </Typography>
                        </Tooltip>
                    ) : (
                        <Tooltip title='Цена не указана' placement="top-start" arrow>
                            <Typography variant="body1" sx={{color: 'text.secondary', textAlign: 'left', pl: '10px'}}>
                                Цена не указана
                            </Typography>
                        </Tooltip>
                    )}

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
                    {!isOwner ? (
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
                    ) : null}

                    <ExpandMoreButton
                        description={data.description}
                        expanded={expanded}
                        onExpandClick={handleExpandClick}
                    />
                    {isOwner  && (
                        <GiftVertMenuSettings
                            id={data.id}
                            // onListDeleted={onListDeleted}
                            // onListEdit={onListEdit}
                        />
                    )}
                </CardActions>

                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                        <Typography sx={{marginBottom: 2,}}>Описание:</Typography>
                        <Typography sx={{marginBottom: 2, textAlign: 'left'}}>
                            {data.description}
                        </Typography>
                    </CardContent>
                </Collapse>
            </Card>

            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalStyle}>
                    <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2}}>
                        <Typography variant="h6" component="h2">
                            {data.name}
                        </Typography>
                    </Box>
                    <Box sx={{position: 'relative'}}>
                        <CardMedia
                            component="img"
                            height="300"
                            image={largeImageUrl || imageUrl}
                            alt="Gift image"
                            sx={{mb: 2, borderRadius: 1}}
                        />
                    </Box>
                    {data.price.amount ? (
                        <Typography variant="body1" sx={{mb: 1}}>
                            <strong>Цена:</strong> {data.price.amount} {data.price.currency}
                        </Typography>
                    ) : (
                        <Typography variant="body1" sx={{mb: 1}}>
                            <strong>Цена:</strong> не указана
                        </Typography>
                    )}
                    {data.link && (
                        <Typography variant="body1" sx={{mb: 1}}>
                            <a
                                href={data.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    color: 'black',
                                    textDecoration: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                <InsertLinkOutlinedIcon sx={{fontSize: "2rem"}}/>
                                Ссылка на подарок
                            </a>
                        </Typography>
                    )}
                    {data.description ? (
                        <>
                            <Typography variant="body1" sx={{mb: 1}}>
                                <strong>Описание:</strong>
                            </Typography>
                            <Typography variant="body2" sx={{mb: 2}}>
                                {data.description}
                            </Typography>
                        </>
                    ) : null}

                    <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                        <Button
                            variant="outlined"
                            color="black"
                            onClick={handleCloseModal}
                        >
                            Закрыть
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </>
    );
}