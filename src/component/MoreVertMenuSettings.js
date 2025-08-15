import * as React from 'react';
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

const ITEM_HEIGHT = 48;

export default function MoreVertMenuSettings({selectedWishlistId, onListDeleted}) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [openConfirmDialog, setOpenConfirmDialog] = React.useState(false);
    const [isDeleting, setIsDeleting] = React.useState(false);

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
                    list: {
                        'aria-labelledby': 'long-button',
                    },
                }}
            >
                <MenuItem onClick={handleClose}>
                    <EditOutlinedIcon sx={{mr: 1}}/>Редактировать
                </MenuItem>
                <MenuItem onClick={handleOpenConfirmDialog}>
                    <DeleteOutlinedIcon sx={{mr: 1}}/>Удалить
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
        </div>
    );
}