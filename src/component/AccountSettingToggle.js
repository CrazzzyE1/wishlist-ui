import * as React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import FaceRetouchingNaturalOutlinedIcon from '@mui/icons-material/FaceRetouchingNaturalOutlined';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import {Avatar, Divider} from "@mui/material";
import keycloak from "../keycloak/Keycloak";
import {useEffect, useState} from "react";
import {httpClient} from "../http/HttpClient";

export default function AccountSettingToggle() {
    const [avatarSrc, setAvatarSrc] = useState(null);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const isMenuOpen = Boolean(anchorEl);

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

    const menuId = 'primary-search-account-menu';

    useEffect(() => {
        const fetchAvatar = async () => {
            try {
                const response = await httpClient.get('http://localhost:9000/api/v1/avatars/me?size=SMALL', {
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
        >
            <MenuItem onClick={handleMenuClose}><FaceRetouchingNaturalOutlinedIcon sx={{mr: '5px'}} />Профиль</MenuItem>
            <MenuItem onClick={handleMenuClose}><TuneOutlinedIcon sx={{mr: '5px'}} />Настройки</MenuItem>
            <Divider variant="middle" component="li"/>
            <MenuItem onClick={handleLogout}><LogoutOutlinedIcon sx={{mr: '5px'}} />Выход</MenuItem>
        </Menu>
    );





    return (
        <Box sx={{flexGrow: 1}}>
            <Box sx={{display: {xs: 'none', md: 'flex', justifyContent: 'flex-end', display: 'flex'}}}>
                <IconButton
                    size="large"
                    aria-label="show 17 new notifications"
                    color="inherit"
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: 56,
                        height: 56,
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
                    <Badge badgeContent={17} color="error">
                        <NotificationsActiveOutlinedIcon sx={{
                            fontSize: 40,
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
                    sx={{mr: 1}}
                >
                    <Avatar
                        alt="Remy Sharp"
                        src={avatarSrc}
                        sx={{width: 40, height: 40}}
                    />
                </IconButton>
            </Box>
            {renderMenu}
        </Box>
    );
}