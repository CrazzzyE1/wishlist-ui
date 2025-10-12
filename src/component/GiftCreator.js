import * as React from 'react';
import {useState} from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import IconButton from "@mui/material/IconButton";
import GiftCreateBox from "./GiftCreateBox";
import {httpClient} from "../http/HttpClient";
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import Grid from "@mui/material/Grid";
import ShareLinkModal from "./ShareLinkModal";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import {Tooltip} from "@mui/material";
import {blue, green, grey} from "@mui/material/colors";
import {getUserIdFromToken} from "../utils/Auth";
import keycloak from "../keycloak/Keycloak";

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

export default function GiftCreator({userId, onGiftCreated, lists, selectedWishlistId}) {
    const [open, setOpen] = React.useState(false);
    const [error, setError] = useState(null);
    const [openShareModal, setOpenShareModal] = useState(false);

    const ownerId = getUserIdFromToken(keycloak.token);

    const handleSharedClick = () => {
        setOpenShareModal(true);
    };

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setError(null);
    };

    const handleCreateGift = async (giftData) => {
        setError(null);

        try {
            const giftResponse = await httpClient.post('/gifts', {
                name: giftData.name,
                price: {
                    amount: giftData.price && !isNaN(giftData.price) ? giftData.price : 0,
                    currency: giftData.currency || 'RUB'
                },
                wishListId: giftData.listId,
                description: giftData.description,
                link: giftData.link
            });

            const giftId = giftResponse.data.id;

            if (giftData.image) {
                const formData = new FormData();
                formData.append('giftId', giftId);
                formData.append('file', giftData.image);

                await httpClient.post('/pictures', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            }

            if (onGiftCreated) {
                onGiftCreated(giftData.listId);
            }
            handleClose();
        } catch (err) {
            console.error('Ошибка создания желания:', err);
            setError(err.response?.data?.message || 'Произошла ошибка при создании желания');
        } finally {
            handleClose();
        }
    };

    return (
        <Grid container size={{xs: 12, sm: 12}}>
            <Grid size={{xs: 10, sm: 11}}>
                <IconButton
                    onClick={handleOpen}
                    disableRipple
                    sx={{
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        width: {xs: '100%', sm: '100%'},
                        height: {xs: 48, sm: 48},
                        borderRadius: '50%',
                        '&:hover': {
                            '& .MuiSvgIcon-root': {
                                color: green[700]
                            }
                        }
                    }}>
                    <AddCircleOutlineOutlinedIcon sx={{
                        fontSize: {xs: 28, sm: 40},
                        transition: 'color 0.5s ease'
                    }}/>
                    <Typography
                        sx={{
                            pl: 1,
                            fontSize: {xs: '1rem', sm: '1.3rem'}
                        }}>
                        Создать желание
                    </Typography>
                </IconButton>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={modalStyle}>
                        <Typography id="modal-modal-title" variant="h6" component="h2" sx={{mb: 2}}>
                            Создать желание
                        </Typography>
                        {error && (
                            <Typography color="error" sx={{mb: 2}}>
                                {error}
                            </Typography>
                        )}
                        <GiftCreateBox
                            selectedWishlistId={selectedWishlistId}
                            lists={lists}
                            onCreate={handleCreateGift}
                            onCancel={handleClose}
                        />
                    </Box>
                </Modal>
            </Grid>
            <Grid size={{xs: 2, sm: 1}}>
                <IconButton
                    onClick={handleSharedClick}
                    sx={{
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

                <ShareLinkModal
                    id={selectedWishlistId}
                    sublink={`users/${ownerId}/wishlists`}
                    open={openShareModal}
                    onClose={() => setOpenShareModal(false)}
                />
            </Grid>
        </Grid>
    );
}