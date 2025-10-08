import * as React from 'react';
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
import ListEditBox from "./ListEditBox";

const ITEM_HEIGHT = 48;

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

export default function ListVertMenuSettings({selectedWishlistId, onListDeleted, onListEdit}) {
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
            const response = await httpClient.patch(`/wishlists/${selectedWishlistId}`, {
                name: listData.name,
                eventDate: listData.date ? listData.date.format('YYYY-MM-DD') : null,
                privacyLevel: listData.privacyLevel
            });
            handleClose();
            handleCloseModal();
            if (onListEdit) {
                onListEdit(response.data.id);
            }
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
            await httpClient.delete(`/wishlists/${selectedWishlistId}`);
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
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        mt: 1
                    }
                }}
                sx={{ zIndex: 1300 }}
            >
                <MenuItem
                    onClick={handleEditClick}
                    sx={{
                        py: 1,
                        fontSize: '0.9rem',
                        '&:hover': {
                            backgroundColor: 'action.hover'
                        }
                    }}
                >
                    <EditOutlinedIcon sx={{ mr: 1, fontSize: 20 }} />
                    Редактировать
                </MenuItem>
                <MenuItem
                    onClick={handleOpenConfirmDialog}
                    sx={{
                        py: 1,
                        fontSize: '0.9rem',
                        color: 'error.main',

                    }}
                >
                    <DeleteOutlinedIcon sx={{ mr: 1, fontSize: 20 }} />
                    Удалить
                </MenuItem>
            </Menu>

            <Dialog
                open={openConfirmDialog}
                onClose={handleCloseConfirmDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        textAlign: 'center',
                        p: 2,
                        minWidth: 300
                    }
                }}
            >
                <DialogTitle id="alert-dialog-title" sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1,
                    fontSize: {xs: '0.875rem', sm: '1.25rem'},
                    fontWeight: 600
                }}>
                    <HelpOutlineOutlinedIcon
                        sx={{
                            fontSize: {xs: 24, sm: 40},
                            color: 'error.main'
                        }}
                    />
                    Подтверждение удаления
                </DialogTitle>
                <DialogContent sx={{textAlign: 'center'}}>
                    <DialogContentText id="alert-dialog-description"
                                       sx={{
                                           mb: 1,
                                           fontSize: {xs: '0.75rem', sm: '0.875rem'},
                                       }}>
                        Вы уверены, что хотите удалить этот список?
                    </DialogContentText>
                    <DialogContentText id="alert-dialog-description" sx={{mb: 1, fontSize: {xs: '0.75rem', sm: '0.875rem'},}}>
                        Это так же приведет к удалению всех желаний из этого списка.
                    </DialogContentText>
                    <DialogContentText id="alert-dialog-description" sx={{mb: 1, fontSize: {xs: '0.75rem', sm: '0.875rem'}, fontWeight: 500}}>
                        Это действие нельзя отменить.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{
                    justifyContent: 'center',
                    gap: 2,
                    pb: 3
                }}>
                    <Button
                        onClick={handleCloseConfirmDialog}
                        disabled={isDeleting}
                        variant="outlined"
                        sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 500,
                            minWidth: 120
                        }}
                    >
                        Отмена
                    </Button>
                    <Button
                        onClick={removeList}
                        color="error"
                        disabled={isDeleting}
                        variant="contained"
                        autoFocus
                        sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 500,
                            minWidth: 120,
                            backgroundColor: 'error.main',
                            '&:hover': {
                                backgroundColor: 'error.dark'
                            }
                        }}
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