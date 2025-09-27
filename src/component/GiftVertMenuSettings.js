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
import GiftEditBox from "./GiftEditBox";

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

export default function GiftVertMenuSettings({giftId, onGiftDeleted, onGiftEdit, gift, lists}) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [openModal, setOpenModal] = useState(false);

    const handleCloseModal = () => setOpenModal(false);

    const handleEditClick = () => {
        setAnchorEl(null);
        setOpenModal(true);
    };

    const handleEditGift = async (giftData) => {
        try {
            const giftResponse = await httpClient.patch(`/gifts/${giftData.id}`, {
                name: giftData.name,
                price: {
                    amount: giftData.price && !isNaN(giftData.price) ? giftData.price : 0,
                    currency: giftData.currency || 'RUB'
                },
                wishListId: giftData.listId,
                description: giftData.description,
                link: giftData.link
            });

            const savedId = giftResponse.data.id;

            if (giftData.image) {
                const formData = new FormData();
                formData.append('giftId', savedId);
                formData.append('file', giftData.image);

                await httpClient.post('/pictures', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            }

            if (onGiftEdit) {
                onGiftEdit();
            }
            handleClose();
        } catch (err) {
            console.error('Ошибка создания подарка:', err);
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
        if (!giftId) return;
        setIsDeleting(true);
        try {
            await httpClient.delete(`/gifts/${giftId}`);
            onGiftDeleted?.();
        } catch (error) {
            console.error('Ошибка при удалении подарка:', error);
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
                    width: {xs: 24, sm: 40},
                    height: {xs: 24, sm: 40},
                    '&:hover': {
                        '& .MuiSvgIcon-root': {
                            color: '#000000'
                        }
                    },
                }}
            >
                <MoreVertIcon
                    sx={{
                        width: {xs: 20, sm: 24},
                        height: {xs: 20, sm: 24},
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
                sx={{zIndex: 1300}}
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
                        Вы уверены, что хотите удалить этот подарок?
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
                        Редактировать подарок
                    </Typography>
                    <GiftEditBox
                        gift={gift}
                        lists={lists}
                        onEdit={handleEditGift}
                        onCancel={handleCloseModal}
                    />
                </Box>
            </Modal>
        </div>
    );
}