import Grid from "@mui/material/Grid";
import * as React from "react";
import Face6Icon from '@mui/icons-material/Face6';
import IconButton from "@mui/material/IconButton";
import Diversity3Icon from '@mui/icons-material/Diversity3';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import {useNavigate} from "react-router-dom";
import {useNotifications} from './NotificationsContext';
import {red} from "@mui/material/colors";
import {Divider, useMediaQuery, useTheme} from "@mui/material";

function MainMenu() {
    const navigate = useNavigate();
    const {unreadCount} = useNotifications();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    return (
        <Grid container spacing={0}>
            <Grid size={{xs: 2, sm: 12}}
                  sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      mb: {sm: 1}
                  }}>
                <IconButton
                    onClick={() => navigate('/')}
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: {xs: 32, sm: 42},
                        height: {xs: 32, sm: 42},
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
                    <Face6Icon sx={{
                        fontSize: {xs: 24, sm: 32},
                        transition: 'color 0.5s ease'
                    }}/>
                </IconButton>
            </Grid>
            <Grid size={{xs: 2, sm: 12}}
                  sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      mb: {sm: 1}
                  }}>
                <IconButton
                    onClick={() => navigate('/users')}
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: {xs: 32, sm: 42},
                        height: {xs: 32, sm: 42},
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
                    <Diversity3Icon sx={{
                        fontSize: {xs: 24, sm: 32},
                        transition: 'color 0.5s ease'
                    }}/>
                </IconButton>
            </Grid>
            <Grid size={{xs: 2, sm: 12}}
                  sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      mb: {sm: 1}
                  }}>
                <IconButton
                    onClick={() => navigate('/notifications')}
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: {xs: 32, sm: 42},
                        height: {xs: 32, sm: 42},
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
                    {unreadCount > 0 ?
                        (<NotificationsActiveOutlinedIcon sx={{
                            color: red[500],
                            fontSize: {xs: 24, sm: 32},
                            transition: 'color 0.5s ease'
                        }}/>)
                        :
                        (<NotificationsActiveOutlinedIcon sx={{

                            fontSize: {xs: 24, sm: 32},
                            transition: 'color 0.5s ease'
                        }}/>)
                    }
                </IconButton>
            </Grid>
            <Grid size={{xs: 2, sm: 12}}
                  sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      mb: {sm: 1},
                      minHeight: '32px'
                  }}>
                <Divider
                    orientation={isMobile ? "vertical" : "horizontal"}
                    sx={{
                        width: isMobile ? '1px' : '100%',
                        height: isMobile ? '100%' : '100%'
                    }}
                    flexItem
                />
            </Grid>
            {/*{isOwner && (*/}
            {/*    <Grid size={{xs: 2, sm: 12}}*/}
            {/*          sx={{*/}
            {/*              display: 'flex',*/}
            {/*              justifyContent: 'center',*/}
            {/*              alignItems: 'center',*/}
            {/*              mb: {sm: 1}*/}
            {/*          }}>*/}
            {/*        <GiftCreator*/}
            {/*            onGiftCreated={onGiftCreated}*/}
            {/*            lists={lists}*/}
            {/*        />*/}
            {/*    </Grid>*/}
            {/*)}*/}
        </Grid>
    );
}

export default MainMenu;