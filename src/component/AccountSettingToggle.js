import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import FaceRetouchingNaturalOutlinedIcon from '@mui/icons-material/FaceRetouchingNaturalOutlined';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import {Avatar, Divider, Modal, Typography} from "@mui/material";
import keycloak from "../keycloak/Keycloak";
import * as React from "react";
import {useEffect, useState} from "react";
import {httpClient} from "../http/HttpClient";
import {useNavigate} from "react-router-dom";
import {useNotifications} from './NotificationsContext';
import ProfileEditBox from "./ProfileEditBox";


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

export default function AccountSettingToggle({onProfileEdit}) {
    const [avatarSrc, setAvatarSrc] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [profileModalOpen, setProfileModalOpen] = useState(false);
    const isMenuOpen = Boolean(anchorEl);
    const navigate = useNavigate();
    const {unreadCount} = useNotifications();

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleMenuClose();
        keycloak.logout();
    };

    const handleProfileClick = () => {
        handleMenuClose();
        setProfileModalOpen(true);
    };

    const handleProfileModalClose = () => {
        setProfileModalOpen(false);
    };

    const handleEditProfile = async (newProfile) => {
        try {
            await httpClient.patch(`/profiles/me`, {
                firstName: newProfile.firstName,
                familyName: newProfile.familyName,
                gender: newProfile.gender,
                email: newProfile.email,
                birthDate: newProfile.birthDate.format('YYYY-MM-DD'),
                status: newProfile.status,
                privacyLevel: newProfile.privacyLevel
            });

            if (newProfile.image) {
                const formData = new FormData();
                formData.append('file', newProfile.image);

                await httpClient.post('/avatars', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            }

            if (onProfileEdit) {
                onProfileEdit();
            }

            handleProfileModalClose();
            handleMenuClose();
        } catch (err) {
            console.error('Ошибка создания подарка:', err);
        }
    };

    const menuId = 'primary-search-account-menu';

    useEffect(() => {
        const fetchAvatar = async () => {
            try {
                const response = await httpClient.get('/avatars/me?size=SMALL', {
                    responseType: 'arraybuffer'
                });

                const blob = new Blob([response.data], {type: response.headers['content-type']});
                const imageUrl = URL.createObjectURL(blob);
                setAvatarSrc(imageUrl);
            } catch (err) {
                console.error('Ошибка загрузки аватара:', err);
            }
        };

        fetchAvatar();

        return () => {
            if (avatarSrc) {
                URL.revokeObjectURL(avatarSrc);
            }
        };
    }, []);

    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    minWidth: 180,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    mt: 1
                }
            }}
        >
            <MenuItem
                onClick={handleProfileClick}
                sx={{
                    py: 1,
                    fontSize: '0.9rem',
                    '&:hover': {
                        backgroundColor: 'action.hover'
                    }
                }}
            >
                <FaceRetouchingNaturalOutlinedIcon sx={{ mr: 1, fontSize: 20 }} />
                Профиль
            </MenuItem>
            <MenuItem
                onClick={handleMenuClose}
                disabled={true}
                sx={{
                    py: 1,
                    fontSize: '0.9rem',
                    '&.Mui-disabled': {
                        opacity: 0.5
                    }
                }}
            >
                <TuneOutlinedIcon sx={{ mr: 1, fontSize: 20 }} />
                Настройки
            </MenuItem>
            <Divider
                variant="middle"
                component="li"
                sx={{ my: 0.5 }}
            />
            <MenuItem
                onClick={handleLogout}
                sx={{
                    py: 1,
                    fontSize: '0.9rem',
                    color: 'error.main',
                }}
            >
                <LogoutOutlinedIcon sx={{ mr: 1, fontSize: 20 }} />
                Выход
            </MenuItem>
        </Menu>
    );

    return (
        <Box sx={{flexGrow: 1}}>
            <Box sx={{display: {xs: 'flex', md: 'flex', justifyContent: 'flex-end', display: 'flex'}}}>
                <IconButton
                    onClick={() => navigate('/notifications')}
                    size="large"
                    aria-label="show new notifications"
                    color="inherit"
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: {xs: 36, sm: 56},
                        height: {xs: 36, sm: 56},
                        borderRadius: '50%',
                        '&:hover': {
                            '& .MuiSvgIcon-root': {
                                color: '#000000'
                            }
                        },
                        '&:active': {
                            boxShadow: '0px 0px 10px rgba(0,0,0,0.2)'
                        }
                    }}
                >
                    <Badge badgeContent={unreadCount} color="error">
                        <NotificationsActiveOutlinedIcon sx={{
                            fontSize: {xs: 28, sm: 40},
                            transition: 'color 0.5s ease'
                        }}/>
                    </Badge>
                </IconButton>
                <IconButton
                    size="large"
                    edge="end"
                    aria-label="account of current user"
                    aria-controls={menuId}
                    aria-haspopup="true"
                    onClick={handleProfileMenuOpen}
                    color="inherit"
                    sx={{
                        width: {xs: 36, sm: 56},
                        height: {xs: 36, sm: 56},
                        mr: {xs: 0, sm: 1}
                    }}
                >
                    <Avatar
                        alt="Avatar"
                        src={avatarSrc}
                        sx={{
                            width: {xs: 26, sm: 40},
                            height: {xs: 26, sm: 40}
                        }}
                    />
                </IconButton>
            </Box>
            {renderMenu}

            <Modal
                open={profileModalOpen}
                onClose={handleProfileModalClose}
                aria-labelledby="profile-modal-title"
                aria-describedby="profile-modal-description"
            >
                <Box sx={modalStyle}>
                    <Typography id="modal-modal-title" variant="h6" component="h2" sx={{mb: 2}}>
                        Редактировать профиль
                    </Typography>
                    <ProfileEditBox
                        onEdit={handleEditProfile}
                        onCancel={handleProfileModalClose}
                    />
                </Box>
            </Modal>
        </Box>
    );
}