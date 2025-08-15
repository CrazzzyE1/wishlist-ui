import {useState} from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {httpClient} from "../http/HttpClient";
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import {red} from "@mui/material/colors";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import * as React from "react";
import ListEditBox from "./ListEditBox";

const ITEM_HEIGHT = 48;

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

export default function MoreVertMenuSettings({selectedWishlistId, onListDeleted}) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [openModal, setOpenModal] = useState(false);

    const handleCloseModal = () => setOpenModal(false);

    const handleEditClick = () => {
        setAnchorEl(null);
        setOpenModal(true);
    };

    const handleEditList = async (listData) => {
        try {
            const response = await httpClient.patch(`http://localhost:9000/api/v1/wishlists/${selectedWishlistId}`, {
                id: selectedWishlistId,
                name: listData.name,
                eventDate: listData.date ? listData.date.format('YYYY-MM-DD') : null,
                privacyLevel: listData.privacyLevel
            });
            handleClose();
        } catch (error) {
            console.error('Ошибка при создании списка:', error);
        }
    };

    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleOpenConfirmDialog = () => {
        setOpenConfirmDialog(true);
        handleClose(); // Закрываем меню
    };

    const handleCloseConfirmDialog = () => {
        setOpenConfirmDialog(false);
    };

    const removeList = async () => {
        if (!selectedWishlistId) return;

        setIsDeleting(true);
        try {
            await httpClient.delete(`http://localhost:9000/api/v1/wishlists/${selectedWishlistId}`);
            onListDeleted?.();
        } catch (error) {
            console.error('Ошибка при удалении списка:', error);
        } finally {
            setIsDeleting(false);
            handleCloseConfirmDialog();
        }
    };

    return (
        <div>
            <IconButton
                aria-label="more"
                id="long-button"
                aria-controls={open ? 'long-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleClick}
                sx={{
                    '&:hover': {
                        '& .MuiSvgIcon-root': {
                            color: '#000000'
                        }
                    },
                }}
            >
                <MoreVertIcon
                    sx={{
                        transition: 'color 0.5s ease'
                    }}
                />
            </IconButton>

            <Menu
                id="long-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                slotProps={{
                    paper: {
                        style: {
                            maxHeight: ITEM_HEIGHT * 4.5,
                            width: '19ch',
                        },
                    },
                }}
                sx={{ zIndex: 1300 }}
            >
                <MenuItem onClick={handleEditClick}>
                    <EditOutlinedIcon sx={{mr: 1}}/>
                    Редактировать
                </MenuItem>
                <MenuItem onClick={handleOpenConfirmDialog}>
                    <DeleteOutlinedIcon sx={{mr: 1}}/>
                    Удалить
                </MenuItem>
            </Menu>

            <Dialog
                open={openConfirmDialog}
                onClose={handleCloseConfirmDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    <HelpOutlineOutlinedIcon
                        sx={{
                            fontSize: 40,
                            color: red[500]
                        }}
                    /> Подтверждение удаления
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Вы уверены, что хотите удалить этот список?
                    </DialogContentText>
                    <DialogContentText id="alert-dialog-description">
                        Это так же приведет к удалению всех подарков из
                        этого списка.
                    </DialogContentText>
                    <DialogContentText id="alert-dialog-description">
                        Это действие нельзя отменить.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleCloseConfirmDialog}
                        disabled={isDeleting}
                    >
                        Отмена
                    </Button>
                    <Button
                        onClick={removeList}
                        color="error"
                        disabled={isDeleting}
                        autoFocus
                    >
                        {isDeleting ? 'Удаление...' : 'Удалить'}
                    </Button>
                </DialogActions>
            </Dialog>
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalStyle}>
                    <Typography id="modal-modal-title" variant="h6" component="h2" sx={{mb: 2}}>
                        Редактировать список
                    </Typography>
                    <ListEditBox
                        selectedWishlistId={selectedWishlistId}
                        onEdit={handleEditList}
                        onCancel={handleCloseModal}
                    />
                </Box>
            </Modal>
        </div>
    );
}