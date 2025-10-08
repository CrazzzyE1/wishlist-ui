import React, {useEffect, useRef, useState} from 'react';
import {BrowserRouter as Router, Route, Routes, useParams} from 'react-router-dom';
import keycloak from './keycloak/Keycloak';
import ProfilePage from "./component/ProfilePage";
import FriendsPage from "./component/FriendsPage";
import NotificationsPage from "./component/NotificationsPage";
import {NotificationsProvider} from "./component/NotificationsContext";
import {LinearProgress} from "@mui/material";
import {httpClient} from './http/HttpClient';
import './GlobalStyles.css';

function App() {
    const [authenticated, setAuthenticated] = useState(false);
    const isRun = useRef(false);

    useEffect(() => {
        if (isRun.current) return;
        isRun.current = true;

        const initKeycloak = async () => {
            try {
                const auth = await keycloak.init({
                    onLoad: 'check-sso',
                    checkLoginIframe: true,
                    pkceMethod: 'S256',
                    silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html'
                });

                if (!auth) {
                    await keycloak.login();
                    return;
                }

                setAuthenticated(true);
                httpClient.defaults.headers.common['Authorization'] = `Bearer ${keycloak.token}`;
            } catch (err) {
                console.error('Keycloak init error:', err);
                keycloak.login();
            }
        };

        initKeycloak();
    }, []);

    useEffect(() => {
        keycloak.onAuthSuccess = () => {
            setAuthenticated(true);
            httpClient.defaults.headers.common['Authorization'] = `Bearer ${keycloak.token}`;
        };

        keycloak.onAuthLogout = () => setAuthenticated(false);
    }, []);

    useEffect(() => {
        if (!authenticated) return;

        keycloak.onTokenExpired = async () => {
            console.log('Token expired — refreshing...');
            try {
                await keycloak.updateToken(70);
                console.log('Token refreshed!');
                httpClient.defaults.headers.common['Authorization'] = `Bearer ${keycloak.token}`;
            } catch (err) {
                console.error('Token refresh failed, re-login');
                keycloak.login();
            }
        };
    }, [authenticated]);

    useEffect(() => {
        const interceptor = httpClient.interceptors.request.use(async (config) => {
            try {
                await keycloak.updateToken(30);
                config.headers.Authorization = `Bearer ${keycloak.token}`;
            } catch (err) {
                console.error('Token refresh in interceptor failed');
                keycloak.login();
            }
            return config;
        });

        return () => httpClient.interceptors.request.eject(interceptor);
    }, [authenticated]);

    useEffect(() => {
        if (!authenticated) return;
        (async () => {
            try {
                await httpClient.post(`/authorize`);
            } catch (error) {
                if (error.response?.status === 500) {
                    console.log('User already exists in database');
                } else {
                    console.error('Authorization request failed:', error);
                }
            }
        })();
    }, [authenticated]);

    if (!authenticated) {
        return <LinearProgress color="success"/>;
    }

    return (
        <NotificationsProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<ProfilePage/>}/>
                    <Route path="/friends" element={<FriendsPage/>}/>
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
