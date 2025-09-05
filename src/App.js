import React, {useEffect, useRef, useState} from 'react';
import {BrowserRouter as Router, Route, Routes, useParams} from 'react-router-dom';
import keycloak from './keycloak/Keycloak';
import ProfilePage from "./component/ProfilePage";
import FriendsPage from "./component/FriendsPage";
import {httpClient} from './http/HttpClient';
import NotificationsPage from "./component/NotificationsPage";
import {NotificationsProvider} from "./component/NotificationsContext";
import {LinearProgress} from "@mui/material";

function App() {
    const [authenticated, setAuthenticated] = useState(false);
    const isRun = useRef(false);

    useEffect(() => {
        if (isRun.current) return;
        isRun.current = true;
        keycloak.init({onLoad: 'login-required'})
            .then((auth) => {
                if (auth) {
                    setAuthenticated(true);
                }
            })
            .catch(err => console.error('Keycloak init error:', err));
    }, []);

    useEffect(() => {
        if (authenticated) {
            const interval = setInterval(() => {
                keycloak.updateToken(30)
                    .then(refreshed => {
                        if (refreshed) {
                            httpClient.defaults.headers.common['Authorization'] = `Bearer ${keycloak.token}`;
                        }
                    })
                    .catch(() => keycloak.login());
            }, 30000);
            return () => clearInterval(interval);
        }
    }, [authenticated]);

    if (!authenticated) {
        return <LinearProgress color="info"/>;
    }

    httpClient.defaults.headers.common['Authorization'] = `Bearer ${keycloak.token}`;

    try {
        httpClient.post(`/authorize`);
    } catch (error) {
        if (error.response?.status === 500) {
            console.log('User already exists in database');
            return;
        }
        throw error;
    }

    return (
        <NotificationsProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<ProfilePage/>}/>
                    <Route path="/users" element={<FriendsPage/>}/>
                    <Route path="/users/:userId" element={<ProfilePageWithParams/>}/>
                    <Route path="/notifications" element={<NotificationsPage/>}/>
                </Routes>
            </Router>
        </NotificationsProvider>
    );
}

function ProfilePageWithParams() {
    const {userId} = useParams();
    return <ProfilePage userId={userId}/>;
}

export default App;