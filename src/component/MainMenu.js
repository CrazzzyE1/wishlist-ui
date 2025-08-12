import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Item from "./StyledItem";
import * as React from "react";
import Face6Icon from '@mui/icons-material/Face6';
import IconButton from "@mui/material/IconButton";
import Diversity3Icon from '@mui/icons-material/Diversity3';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import ListCreator from "./ListCreator";
import GiftCreator from "./GiftCreator";
import {useNavigate} from "react-router-dom";

function MainMenu({onListCreated, lists, isOwner}) {
    const navigate = useNavigate();

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
                            onClick={() => navigate('/')}
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
                            onClick={() => navigate('/users')}
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
                    <Item noshadow>
                        <hr/>
                    </Item>
                </Grid>

                {isOwner && (
                    <>
                        <Grid size={12}>
                            <Item noshadow>
                                <ListCreator onListCreated={onListCreated}/>
                            </Item>
                        </Grid>
                        <Grid size={12}>
                            <Item noshadow>
                                <GiftCreator
                                    onListCreated={onListCreated}
                                    lists={lists}
                                />
                            </Item>
                        </Grid>
                    </>
                )}
            </Grid>
        </Box>
    );
}

export default MainMenu;