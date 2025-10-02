import React, {useEffect, useRef, useState} from 'react';
import {BrowserRouter as Router, Route, Routes, useParams} from 'react-router-dom';
import keycloak from './keycloak/Keycloak';
import ProfilePage from "./component/ProfilePage";
import FriendsPage from "./component/FriendsPage";
import {httpClient} from './http/HttpClient';
import NotificationsPage from "./component/NotificationsPage";
import {NotificationsProvider} from "./component/NotificationsContext";
import {LinearProgress} from "@mui/material";
import './GlobalStyles.css';
import InfoBanner from "./component/InfoBanner";
    function App() {
        const [authenticated, setAuthenticated] = useState(false);
        const isRun = useRef(false);

        // Keycloak Initialization
        useEffect(() => {
            if (isRun.current) return;
            isRun.current = true;

            const initializeKeycloak = async () => {
                try {
                    let auth = await keycloak.init({
                        onLoad: 'check-sso',
                        checkLoginIframe: false,
                        pkceMethod: 'S256',
                        redirectUri: window.location.origin,
                    });

                    setAuthenticated(auth); // Set auth state based on init result

                    if (!auth) {
                        keycloak.login(); // Trigger login if not authenticated
                    }

                } catch (err) {
                    console.error('Keycloak init error:', err);
                    keycloak.login();
                }
            };

            initializeKeycloak();
        }, []);

        // Keycloak Event Listeners
        useEffect(() => {
            keycloak.onAuthSuccess = () => setAuthenticated(true);
            keycloak.onAuthLogout = () => setAuthenticated(false);
        }, []); // Set stable event handlers

        // Token Refresh Logic
        useEffect(() => {
            if (!authenticated) return;

            const checkAndRefreshToken = () => {
                // Refresh if token expires within 30 seconds
                keycloak.updateToken(30)
                    .then(refreshed => {
                        if (refreshed) {
                            console.log('Token was refreshed');
                            httpClient.defaults.headers.common['Authorization'] = `Bearer ${keycloak.token}`;
                        }
                    })
                    .catch(() => {
                        console.error('Failed to refresh token');
                        keycloak.login();
                    });
            };

            // Set up interval for token check
            const interval = setInterval(checkAndRefreshToken, 30000);
            return () => clearInterval(interval); // Cleanup on unmount or auth change
        }, [authenticated]); // Re-run effect when authentication status changes

        // API Authorization Call
        useEffect(() => {
            if (!authenticated) return;

            const authorizeUser = async () => {
                try {
                    await httpClient.post(`/authorize`);
                } catch (error) {
                    if (error.response?.status === 500) {
                        console.log('User already exists in database');
                    } else {
                        console.error('Authorization request failed:', error);
                    }
                }
            };

            authorizeUser();
        }, [authenticated]); // Run only when user becomes authenticated

        if (!authenticated) {
            return <LinearProgress color="success" />;
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
                {/*<InfoBanner />*/}
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