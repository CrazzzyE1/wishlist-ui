import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import IconButton from "@mui/material/IconButton";
import GiftCreateBox from "./GiftCreateBox";
import {httpClient} from "../http/HttpClient";
import LoupeIcon from "@mui/icons-material/Loupe";

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function GiftCreator({onListCreated, lists}) {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleCreateList = async (listData) => {
        try {
            const response = await httpClient.post('http://localhost:9000/api/v1/wishlists', {
                name: listData.name,
                eventDate: listData.date ? listData.date.format('YYYY-MM-DD') : null,
                privacyLevel: listData.privacyLevel
            });
            handleClose();
            if (onListCreated) {
                onListCreated(response.data.id);
            }
        } catch (error) {
            console.error('Ошибка при создании подарка:', error);
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
                    <Typography id="modal-modal-title" variant="h6" component="h2" sx={{mb: 2}}>
                        Создать новый подарок
                    </Typography>
                    <GiftCreateBox
                        lists={lists}
                        onCreate={handleCreateList}
                        onCancel={handleClose}
                    />
                </Box>
            </Modal>
        </div>
    );
}