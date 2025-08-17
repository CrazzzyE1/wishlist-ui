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
import AddToPhotosOutlinedIcon from '@mui/icons-material/AddToPhotosOutlined';
import {ExpandMoreButton} from "./ExpandMoreButton";
import {Tooltip} from "@mui/material";
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
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
};

export default function GiftCard({data, isOwner, onGiftDeleted, onGiftEdit, lists}) {
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

    return (
        <>
            <Card
                sx={{
                    maxWidth: 191,
                    minWidth: 191,
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

                <Box sx={{ position: "relative" }}>
                    <CardMedia
                        component="img"
                        height="180"
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
                </Box>

                <CardHeader
                    sx={{ p: 1.5 }}
                    title={
                        <Tooltip title={data.name} placement="top-start" arrow>
                            <Typography
                                variant="subtitle1"
                                sx={{
                                    fontWeight: 600,
                                    fontSize: "1rem",
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

                <CardContent sx={{ p: 1.5, pt: 0 }}>
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
                        px: 1.5,
                        pb: 1.5,
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                >
                    <Box>
                        <IconButton
                            aria-label="like"
                            sx={{
                                width: 38,
                                height: 38,
                                "&:hover .MuiSvgIcon-root": {
                                    color: "error.main",
                                },
                            }}
                        >
                            <FavoriteBorderOutlinedIcon />
                        </IconButton>

                        <IconButton
                            aria-label="link"
                            onClick={() => {
                                if (data.link) {
                                    window.open(data.link, "_blank", "noopener,noreferrer");
                                }
                            }}
                            disabled={!data.link}
                            sx={{
                                width: 38,
                                height: 38,
                                "&:hover .MuiSvgIcon-root": {
                                    color: data.link ? "primary.main" : "inherit",
                                },
                            }}
                        >
                            <InsertLinkOutlinedIcon />
                        </IconButton>

                        {!isOwner && (
                            <IconButton
                                aria-label="clone"
                                sx={{
                                    width: 38,
                                    height: 38,
                                    "&:hover .MuiSvgIcon-root": {
                                        color: "success.main",
                                    },
                                }}
                            >
                                <AddToPhotosOutlinedIcon />
                            </IconButton>
                        )}
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center" }}>
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
                    <CardContent sx={{ px: 2, pb: 2 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                            Описание
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
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
                        maxWidth: 400,
                        width: "90%",
                        bgcolor: "background.paper",
                    }}
                >
                    {/* Заголовок */}
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
                            sx={{ fontWeight: 600 }}
                        >
                            {data.name}
                        </Typography>
                    </Box>

                    {/* Картинка */}
                    <Box sx={{ position: "relative", mb: 2 }}>
                        <CardMedia
                            component="img"
                            height="350"
                            image={largeImageUrl || imageUrl}
                            alt="Gift image"
                            sx={{
                                borderRadius: 2,
                                objectFit: "cover",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                            }}
                        />
                    </Box>

                    {/* Цена */}
                    <Typography variant="body1" sx={{ mb: 1 }}>
                        <strong>Цена:</strong>{" "}
                        {data.price.amount
                            ? `${data.price.amount} ${data.price.currency}`
                            : "не указана"}
                    </Typography>

                    {/* Ссылка */}
                    {data.link && (
                        <Box sx={{ mb: 2 }}>
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
                                <InsertLinkOutlinedIcon sx={{ fontSize: "1.8rem" }} />
                                Ссылка на подарок
                            </a>
                        </Box>
                    )}

                    {/* Описание */}
                    {data.description && (
                        <>
                            <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
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

                    {/* Кнопка закрытия */}
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
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

        </>
    );
}