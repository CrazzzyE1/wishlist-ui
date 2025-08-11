import * as React from 'react';
import {useEffect, useState} from 'react';
import ProfileInfo from "./ProfileInfo";
import Counters from "./Counters";
import {httpClient} from "../http/HttpClient";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import EventsInfoList from "./EventsInfoList";
import {Typography} from "@mui/material";
import Item from "./StyledItem";
import IconButton from "@mui/material/IconButton";
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';

function AccountInfo({onIsOwner}) {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await httpClient.get('http://localhost:9000/api/v1/profiles/me');
                setUserData(response.data);
                onIsOwner?.(response.data.isOwner)
            } catch (err) {
                setError(err.message);
                console.error('Ошибка загрузки данных:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    if (loading) return <div>Загрузка данных...</div>;
    if (error) return <div>Ошибка: {error}</div>;
    if (!userData) return <div>Данные не найдены</div>;

    const formatBirthDate = (dateString) => {
        const options = {day: 'numeric', month: 'long', year: 'numeric'};
        return new Date(dateString).toLocaleDateString('ru-RU', options);
    };

    return (
        <Box sx={{flexGrow: 1, pl: 0}}>
            <Grid container spacing={1}>
                <Grid size={3}>
                    <ProfileInfo user={userData}/>
                </Grid>
                <Grid size={9}>
                    <Grid container spacing={2}>
                        <Grid size={6} container justifyContent="flex-start" sx={{paddingLeft: '22px'}}>
                            <h2>{userData.fullName}</h2>
                        </Grid>
                        <Grid size={2} container justifyContent="flex-start" sx={{paddingLeft: '0px'}}>
                            <Item noshadow>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        fontSize: '16px',
                                        color: 'text.secondary',
                                        textAlign: 'left',
                                        pl: '0px'
                                    }}>
                                    Статус:
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        fontSize: '12px',
                                        color: 'text.secondary',
                                        textAlign: 'left',
                                        pl: '0px'
                                    }}>
                                    {userData.status}
                                </Typography>
                            </Item>
                        </Grid>
                        <Grid size={2} container justifyContent="flex-start" sx={{paddingLeft: '0px'}}>
                            <Item noshadow>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        fontSize: '16px',
                                        color: 'text.secondary',
                                        textAlign: 'left',
                                        pl: '0px'
                                    }}>
                                    Приватность:
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        fontSize: '12px',
                                        color: 'text.secondary',
                                        textAlign: 'left',
                                        pl: '0px'
                                    }}>
                                    {userData.privacyLevel}
                                </Typography>
                            </Item>
                        </Grid>
                        <Grid size={2} container justifyContent="flex-end">
                            <Item noshadow>
                                <IconButton
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        width: 48,
                                        height: 48,
                                        borderRadius: '50%',
                                        mr: 2,
                                        '&:hover': {
                                            '& .MuiSvgIcon-root': {
                                                color: '#FFD700'
                                            }
                                        },
                                        '&:active': {
                                            boxShadow: '0px 0px 10px rgba(0,0,0,0.2)'
                                        }
                                    }}>
                                    <BookmarkBorderIcon sx={{
                                        fontSize: 40,
                                        transition: 'color 0.5s ease'
                                    }}/>
                                </IconButton>
                            </Item>
                        </Grid>
                        <Grid size={4} container justifyContent="flex-start" sx={{paddingLeft: '22px'}} spacing={0}>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-start'
                            }}>
                                <Typography variant="body1"><b>День Рождения:</b></Typography>
                                <Typography variant="body2" color="text.info">
                                    {formatBirthDate(userData.birthDate)}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid size={8} container justifyContent="flex-start" sx={{paddingLeft: '22px'}}>
                            <Counters userData={userData}/>
                        </Grid>
                        <Grid size={12} container justifyContent="flex-start">
                            <EventsInfoList/>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
}

export default AccountInfo;