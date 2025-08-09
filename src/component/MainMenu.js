import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Item from "./StyledItem";
import * as React from "react";
import Face6Icon from '@mui/icons-material/Face6';
import IconButton from "@mui/material/IconButton";
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import RedeemIcon from '@mui/icons-material/Redeem';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import PostAddIcon from '@mui/icons-material/PostAdd';
import LoupeIcon from '@mui/icons-material/Loupe';


function MainMenu() {
    return (
        <Box sx={{
            flexGrow: 1,
            pl: 0,
            minWidth: 56,
            width: 56,
            display: 'flex',
            justifyContent: 'center'
        }}>
            <Grid container spacing={0} sx={{justifyContent: 'center'}}>
                <Grid size={12}>
                    <Item noshadow>
                        <IconButton
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
                            <Face6Icon sx={{
                                fontSize: 32,
                                transition: 'color 0.5s ease'
                            }}/>
                        </IconButton>
                    </Item>
                </Grid>
                <Grid size={12}>
                    <Item noshadow>
                        <IconButton
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
                            <FolderOpenIcon sx={{
                                fontSize: 32,
                                transition: 'color 0.5s ease'
                            }}/>
                        </IconButton>
                    </Item>
                </Grid>
                <Grid size={12}>
                    <Item noshadow>
                        <IconButton
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
                            <RedeemIcon sx={{
                                fontSize: 32,
                                transition: 'color 0.5s ease'
                            }}/>
                        </IconButton>
                    </Item>
                </Grid>
                <Grid size={12}>
                    <Item noshadow>
                        <IconButton
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
                            <Diversity3Icon sx={{
                                fontSize: 32,
                                transition: 'color 0.5s ease'
                            }}/>
                        </IconButton>
                    </Item>
                </Grid>
                <Grid size={12}>
                    <Item noshadow>
                        <IconButton
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
                            <NotificationsActiveOutlinedIcon sx={{
                                fontSize: 32,
                                transition: 'color 0.5s ease'
                            }}/>
                        </IconButton>
                    </Item>
                </Grid>

                <Grid size={12}>
                    <Item noshadow><hr/></Item>
                </Grid>

                <Grid size={12}>
                    <Item noshadow>
                        <IconButton
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
                            <PostAddIcon sx={{
                                fontSize: 32,
                                transition: 'color 0.5s ease'
                            }}/>
                        </IconButton>
                    </Item>
                </Grid>
                <Grid size={12}>
                    <Item noshadow>
                        <IconButton
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
                    </Item>
                </Grid>
            </Grid>
        </Box>
    );
}

export default MainMenu;