import * as React from 'react';
import {Fragment, useEffect, useState} from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InsertLinkOutlinedIcon from '@mui/icons-material/InsertLinkOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import AddToPhotosOutlinedIcon from '@mui/icons-material/AddToPhotosOutlined';
import {ExpandMoreButton} from "./ExpandMoreButton";
import {Skeleton, Tooltip} from "@mui/material";
import {httpClient} from "../http/HttpClient";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import GiftVertMenuSettings from "./GiftVertMenuSettings";

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: {
        xs: '90vw',
        sm: '80vw',
        md: 600,
        lg: 800
    },
    maxHeight: '85vh',
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 3,
    overflow: 'auto',
};

export default function GiftCard({data, isOwner, onGiftDeleted, onGiftEdit, lists}) {
    const [expanded, setExpanded] = useState(false);
    const [imageLoading, setImageLoading] = useState(false);
    const [imageLargeLoading, setImageLargeLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);
    const [largeImageUrl, setLargeImageUrl] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const [isLikeLoading, setIsLikeLoading] = useState(false);
    const [isUnlikeLoading, setIsUnlikeLoading] = useState(false);
    const [openConfirmModal, setOpenConfirmModal] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const fetchLike = async () => {
            try {
                const response = await httpClient.get(`/likes/gift/${data.id}`);

                if (isMounted) {
                    const data = response.data;
                    setIsLiked(data.hasMyLike);
                    setLikesCount(data.likesCount);
                }
            } catch (error) {
                console.error('Error fetching likes:', error);
            }
        };
        if (data.id) {
            fetchLike();
        }
        return () => {
            isMounted = false;
        };
    }, [data.id]);

    useEffect(() => {
        const fetchImage = async () => {
            setImageLoading(true);
            try {
                const response = await httpClient.get(`/pictures/gift/${data.id}?size=MEDIUM`, {
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
            setImageLoading(false);
        };

        if (data.id) {
            fetchImage();
        }
    }, [data.id]);

    const fetchLargeImage = async () => {
        setImageLargeLoading(true);
        try {
            const response = await httpClient.get(`/pictures/gift/${data.id}?size=LARGE`, {
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
        setImageLargeLoading(false);
    };

    const handleCopyGift = async () => {
        try {
            await httpClient.post(`/gifts/add`, {
                giftId: data.id
            });
            setOpenConfirmModal(false);
        } catch (error) {
            console.error('Ошибка при копировании подарка:', error);
            setOpenConfirmModal(false);
        }
    };

    const handleOpenConfirmModal = () => {
        setOpenConfirmModal(true);
    };

    const handleCloseConfirmModal = () => {
        setOpenConfirmModal(false);
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
    const handleUnlike = async () => {
        if (isUnlikeLoading) return;

        setIsUnlikeLoading(true);

        const previousIsLiked = isLiked;
        const previousLikesCount = likesCount;

        setIsLiked(false);
        setLikesCount(likesCount - 1);

        try {
            await httpClient.delete(`/likes/gift/${data.id}`);
        } catch (error) {
            console.error('Error unlikes:', error);
            setIsLiked(previousIsLiked);
            setLikesCount(previousLikesCount);
        } finally {
            setIsUnlikeLoading(false);
        }
    };

    const handleLike = async () => {
        if (isLikeLoading) return;

        setIsLikeLoading(true);
        const previousIsLiked = isLiked;
        const previousLikesCount = likesCount;

        setIsLiked(true);
        setLikesCount(likesCount + 1);

        try {
            await httpClient.post(`/likes/gift/${data.id}`);
        } catch (error) {
            console.error('Error likes:', error);
            setIsLiked(previousIsLiked);
            setLikesCount(previousLikesCount);
        } finally {
            setIsLikeLoading(false);
        }
    };

    return (
        <>
            <Card
                sx={{
                    maxWidth: {xs: 136, sm: 191},
                    borderRadius: 4,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    overflow: "hidden",
                    transition: "transform 0.2s ease, box-shadow 0.3s ease",
                    "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
                    },
                }}
            >

                <Box sx={{position: "relative"}}>
                    {imageLoading ? (
                            <Skeleton
                                variant="rectangular"
                                sx={{
                                    width: {xs: 136, sm: 191},
                                    height: {xs: 136, sm: 191},
                                }}
                            />
                        ) :
                        <CardMedia
                            component="img"
                            image={imageUrl}
                            alt="Gift image"
                            onClick={handleOpenModal}
                            sx={{
                                cursor: "pointer",
                                objectFit: "cover",
                                transition: "0.3s ease",
                                "&:hover": {
                                    filter: "brightness(0.9)",
                                },
                            }}
                        />
                    }

                </Box>

                <CardHeader
                    sx={{pl: 1.5, pt: 1, pb: 1}}
                    title={
                        <Tooltip title={data.name} placement="top-start" arrow>
                            <Typography
                                variant="subtitle1"
                                sx={{
                                    fontWeight: 600,
                                    fontSize: {xs: '0.75rem', sm: '1rem'},
                                    textAlign: "left",
                                    lineHeight: 1.3,
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    color: "text.primary",
                                }}
                            >
                                {data.name}
                            </Typography>
                        </Tooltip>
                    }
                />

                <CardContent sx={{pl: 1.5, pt: 0, pb: 0}}>
                    {data.price.amount ? (
                        <Tooltip
                            title={`${data.price.amount} ${data.price.currency}`}
                            placement="top-start"
                            arrow
                        >
                            <Typography
                                variant="body2"
                                sx={{
                                    color: "text.secondary",
                                    textAlign: "left",
                                    fontWeight: 500,
                                    fontSize: {xs: '0.6rem', sm: '0.8rem'},
                                }}
                            >
                                Цена: {data.price.amount} {data.price.currency}
                            </Typography>
                        </Tooltip>
                    ) : (
                        <Tooltip title="Цена не указана" placement="top-start" arrow>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: "text.disabled",
                                    textAlign: "left",
                                    fontStyle: "italic",
                                    fontSize: {xs: '0.55rem', sm: '0.8rem'},
                                }}
                            >
                                Цена не указана
                            </Typography>
                        </Tooltip>
                    )}
                </CardContent>

                <CardActions
                    disableSpacing
                    sx={{
                        px: 1,
                        pb: 1.5,
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                >
                    <Box>
                        {isLiked ? (
                                <IconButton
                                    onClick={handleUnlike}
                                    aria-label="like"
                                    sx={{
                                        width: {xs: 24, sm: 40},
                                        height: {xs: 24, sm: 40},
                                        color: "error.main",
                                        "&:hover .MuiSvgIcon-root": {
                                            color: "error.main",
                                        },
                                    }}
                                >
                                    <FavoriteOutlinedIcon
                                        sx={{
                                            width: {xs: 20, sm: 24},
                                            height: {xs: 20, sm: 24},
                                        }}
                                    />
                                </IconButton>
                            ) :
                            (
                                <IconButton
                                    onClick={handleLike}
                                    aria-label="like"
                                    sx={{
                                        width: {xs: 24, sm: 40},
                                        height: {xs: 24, sm: 40},
                                        "&:hover .MuiSvgIcon-root": {
                                            color: "error.main",
                                        },
                                    }}
                                >
                                    <FavoriteBorderOutlinedIcon
                                        sx={{
                                            width: {xs: 20, sm: 24},
                                            height: {xs: 20, sm: 24},
                                        }}
                                    />
                                </IconButton>
                            )}
                        {likesCount ? likesCount : ""}
                        <IconButton
                            aria-label="link"
                            onClick={() => {
                                if (data.link) {
                                    window.open(data.link, "_blank", "noopener,noreferrer");
                                }
                            }}
                            disabled={!data.link}
                            sx={{
                                width: {xs: 24, sm: 40},
                                height: {xs: 24, sm: 40},
                                "&:hover .MuiSvgIcon-root": {
                                    color: data.link ? "primary.main" : "inherit",
                                },
                            }}
                        >
                            <InsertLinkOutlinedIcon
                                sx={{
                                    width: {xs: 20, sm: 24},
                                    height: {xs: 20, sm: 24},
                                }}
                            />
                        </IconButton>

                        {!isOwner && (
                            <IconButton
                                aria-label="clone"
                                onClick={handleOpenConfirmModal}
                                sx={{
                                    width: {xs: 24, sm: 40},
                                    height: {xs: 24, sm: 40},
                                    "&:hover .MuiSvgIcon-root": {
                                        color: "success.main",
                                    },
                                }}
                            >
                                <AddToPhotosOutlinedIcon
                                    sx={{
                                        width: {xs: 20, sm: 24},
                                        height: {xs: 20, sm: 24},
                                    }}
                                />
                            </IconButton>
                        )}
                    </Box>

                    <Box sx={{display: "flex", alignItems: "center"}}>
                        <ExpandMoreButton
                            description={data.description}
                            expanded={expanded}
                            onExpandClick={handleExpandClick}
                        />
                        {isOwner && (
                            <GiftVertMenuSettings
                                giftId={data.id}
                                gift={data}
                                lists={lists}
                                onGiftDeleted={onGiftDeleted}
                                onGiftEdit={onGiftEdit}
                            />
                        )}
                    </Box>
                </CardActions>

                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent sx={{px: 2, pb: 2}}>
                        <Typography
                            variant="body2"
                            sx={{
                                fontSize: {xs: '0.6rem', sm: '0.8rem'},
                                color: "text.secondary",
                                textAlign: "left",
                                whiteSpace: "pre-line",
                            }}
                        >
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
                <Box
                    sx={{
                        ...modalStyle,
                        borderRadius: 3,
                        boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                        p: 3,
                        maxWidth: {xs: 348, sm: 548, md: 848},
                        width: "90%",
                        bgcolor: "background.paper",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 2,
                        }}
                    >
                        <Typography
                            id="modal-modal-title"
                            variant="h6"
                            component="h2"
                            sx={{fontWeight: 600}}
                        >
                            {data.name}
                        </Typography>
                    </Box>

                    <Box sx={{position: "relative", mb: 2}}>
                        {imageLargeLoading ? (
                            <Skeleton variant="rectangular" width="100%">
                                <div style={{paddingTop: '100%'}}/>
                            </Skeleton>

                        ) : (
                            <CardMedia
                                component="img"
                                image={largeImageUrl || imageUrl}
                                alt="Gift image"
                                sx={{
                                    height: {xs: 300, sm: 500,  md: 800},
                                    borderRadius: 2,
                                    objectFit: "cover",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                                }}
                            />)
                        }
                    < /Box>

                    <Typography variant="body1" sx={{mb: 1}}>
                        <strong>Цена:</strong>{" "}
                        {data.price.amount
                            ? `${data.price.amount} ${data.price.currency}`
                            : "не указана"}
                    </Typography>

                    {data.link && (
                        <Box sx={{mb: 2}}>
                            <a
                                href={data.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    color: "black",
                                    textDecoration: "none",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.5rem",
                                    fontWeight: 500,
                                    transition: "color 0.2s ease",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = "#1976d2")}
                                onMouseLeave={(e) => (e.currentTarget.style.color = "black")}
                            >
                                <InsertLinkOutlinedIcon sx={{fontSize: "1.8rem"}}/>
                                Открыть ссылку
                            </a>
                        </Box>
                    )}

                    {/* Описание */}
                    {data.description && (
                        <>
                            <Typography variant="body1" sx={{mb: 1, fontWeight: 500}}>
                                Описание:
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    mb: 2,
                                    color: "text.secondary",
                                    lineHeight: 1.5,
                                }}
                            >
                                {data.description}
                            </Typography>
                        </>
                    )}


                    <Box sx={{display: "flex", justifyContent: "flex-end"}}>
                        <Button
                            variant="contained"
                            onClick={handleCloseModal}
                            sx={{
                                borderRadius: 2,
                                textTransform: "none",
                                fontWeight: 500,
                                backgroundColor: "grey.800",
                                "&:hover": {
                                    backgroundColor: "grey.900",
                                    transform: "translateY(-2px)",
                                    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                                },
                                transition: "all 0.2s ease",
                            }}
                        >
                            Закрыть
                        </Button>
                    </Box>
                </Box>
            </Modal>
            <Modal
                open={openConfirmModal}
                onClose={handleCloseConfirmModal}
                aria-labelledby="confirm-copy-modal-title"
                aria-describedby="confirm-copy-modal-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 3,
                        textAlign: 'center'
                    }}
                >
                    <Typography id="confirm-copy-modal-title" variant="h6" component="h2" sx={{mb: 2}}>
                        Копирование подарка
                    </Typography>

                    <Typography id="confirm-copy-modal-description" sx={{mb: 3}}>
                        Вы точно хотите добавить подарок "{data.name}" в свою коллекцию?
                    </Typography>

                    <Box sx={{display: 'flex', justifyContent: 'center', gap: 2}}>
                        <Button
                            variant="outlined"
                            onClick={handleCloseConfirmModal}
                            sx={{
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 500
                            }}
                        >
                            Отмена
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleCopyGift}
                            sx={{
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 500,
                                backgroundColor: 'success.main',
                                '&:hover': {
                                    backgroundColor: 'success.dark'
                                }
                            }}
                        >
                            Да, добавить
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </>
    );
}