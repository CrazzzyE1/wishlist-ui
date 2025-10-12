import * as React from 'react';
import {useEffect, useState} from 'react';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import {CssBaseline, Typography} from "@mui/material";
import TopMenu from "./TopMenu";
import Item from "./StyledItem";
import OthersFriendsPageMenu from "./OthersFriendsPageMenu";
import {httpClient} from "../http/HttpClient";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import OthersFriendsContent from "./OthersFriendsContent";
import {useParams} from "react-router-dom";

export default function OthersFriends() {

    const [itemMenu, setItemMenu] = React.useState(0);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    const {userId} = useParams();

    useEffect(() => {
        const fetchUserDataWithRetry = async (retryCount = 0) => {
            try {
                setLoading(true);
                console.log(userData)
                const response = await httpClient.get(`/profiles/${userId}`);
                setUserData(response.data);
                setLoading(false);
            } catch (err) {
                if (err.response?.status === 404 && retryCount < 3) {
                    setTimeout(() => {
                        fetchUserDataWithRetry(retryCount + 1);
                    }, 2000);
                } else {
                    setLoading(false);
                }
            }
        };

        fetchUserDataWithRetry();
    }, [userId]);

    if (loading) {
        return (
            <Box sx={{display: 'flex', justifyContent: 'center', p: 4}}>
                <CircularProgress/>
            </Box>
        );
    }

    return (
        <React.Fragment>
            <CssBaseline/>
            <Container sx={{pt: 2}}>
                <Grid container spacing={3}>
                    <Grid size={{xs: 12, sm: 12}}>
                        <Item>
                            <TopMenu/>
                        </Item>
                    </Grid>
                    <Grid size={{xs: 12, sm: 12}}>
                        <Item>
                            <Grid size={{xs: 12, sm: 12}}>
                                <Item noshadow>
                                    <Typography variant="body1" sx={{
                                        fontSize: {xs: '1rem', sm: '1.5rem'},
                                        color: 'text.secondary',
                                        justifyContent: 'flex-start',
                                        textAlign: 'left',
                                    }}>
                                        {userData?.fullName}
                                    </Typography>
                                    <Typography variant="body1" sx={{
                                        fontSize: {xs: '0.75rem', sm: '0.8rem'},
                                        color: 'text.secondary',
                                        justifyContent: 'flex-start',
                                        textAlign: 'left',
                                    }}>
                                        Друзья и подписчики
                                    </Typography>
                                    <OthersFriendsPageMenu onItemMenu={setItemMenu}/>
                                </Item>
                            </Grid>
                            <Grid size={{xs: 12, sm: 12}}>
                                <Item noshadow>
                                    <OthersFriendsContent
                                        itemMenu={itemMenu}
                                        userData={userData}
                                    />
                                </Item>
                            </Grid>
                        </Item>
                    </Grid>
                </Grid>
            </Container>
        </React.Fragment>
    );
}