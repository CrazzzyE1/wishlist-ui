import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import IconButton from "@mui/material/IconButton";
import GiftCreateBox from "./GiftCreateBox";
import { httpClient } from "../http/HttpClient";
import LoupeIcon from "@mui/icons-material/Loupe";
import { useState } from 'react';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    maxWidth: '90vw',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function GiftCreator({ onGiftCreated, lists }) {
    const [open, setOpen] = React.useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setError(null);
    };

    const handleCreateGift = async (giftData) => {
        setIsSubmitting(true);
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
                onGiftCreated();
            }
            handleClose();
        } catch (err) {
            console.error('Ошибка создания подарка:', err);
            setError(err.response?.data?.message || 'Произошла ошибка при создании подарка');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <IconButton
                onClick={handleOpen}
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
                <LoupeIcon sx={{
                    fontSize: 32,
                    transition: 'color 0.5s ease'
                }}/>
            </IconButton>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalStyle}>
                    <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
                        Создать новый подарок
                    </Typography>
                    {error && (
                        <Typography color="error" sx={{ mb: 2 }}>
                            {error}
                        </Typography>
                    )}
                    <GiftCreateBox
                        lists={lists}
                        onCreate={handleCreateGift}
                        onCancel={handleClose}
                    />
                </Box>
            </Modal>
        </div>
    );
}