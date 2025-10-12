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
import OthersFriends from "./component/OthersFriends";
function App() {
    const [authenticated, setAuthenticated] = useState(false);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const isRun = useRef(false);

    const checkAndRefreshToken = () => {
        keycloak.updateToken(65)
            .then(refreshed => {
                if (refreshed) {
                    console.log('Token was refreshed ' + new Date());
                    httpClient.defaults.headers.common['Authorization'] = `Bearer ${keycloak.token}`;
                }
            })
            .catch(() => {
                console.error('Failed to refresh token');
                keycloak.login();
            });
    };

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
        keycloak.onAuthSuccess = () => {setAuthenticated(true)};
        keycloak.onAuthLogout = () => setAuthenticated(false);
        keycloak.onTokenExpired = () => {
            checkAndRefreshToken();
        }
    }, []);

    useEffect(() => {
        if (!authenticated) return;

        const interval = setInterval(checkAndRefreshToken, 30000);
        return () => clearInterval(interval);
    }, [authenticated]);

    useEffect(() => {
        if (!authenticated) return;

        const authorizeUser = async () => {
            try {
                await httpClient.post(`/authorize`);
                setIsAuthorized(true);
            } catch (error) {
                if (error.response?.status === 500) {
                    console.log('User already exists in database');
                    setIsAuthorized(true);
                } else {
                    console.error('Authorization request failed:', error);
                }
            }
        };

        authorizeUser();
    }, [authenticated]);

    if (!authenticated || !isAuthorized) {
        return <LinearProgress color="success"/>;
    }

    // return (
    //     <NotificationsProvider>
    //         <Router>
    //             {/*<InfoBanner />*/}
    //             <Routes>
    //                 <Route path="/" element={<ProfilePage/>}/>
    //                 <Route path="/users" element={<FriendsPage/>}/>
    //                 <Route path="/users/:userId/friends" element={<OthersFriendsWithParams/>}/>
    //                 <Route path="/users/:userId" element={<ProfilePageWithParams/>}/>
    //                 <Route path="/users/:userId/wishlists/:wishlistId" element={<ProfilePageWithTwoParams/>}/>
    //                 <Route path="/notifications" element={<NotificationsPage/>}/>
    //             </Routes>
    //         </Router>
    //     </NotificationsProvider>
    // );

    return (
        <NotificationsProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<ProfilePage />} />
                    <Route path="/users" element={<FriendsPage />} />
                    <Route path="/users/:userId/friends" element={<OthersFriends />} />
                    <Route path="/users/:userId" element={<ProfilePage />} />
                    <Route path="/users/:userId/wishlists/:wishlistId" element={<ProfilePage />} />
                    <Route path="/notifications" element={<NotificationsPage />} />
                </Routes>
            </Router>
        </NotificationsProvider>
    );
}
//
// function ProfilePageWithParams() {
//     const {userId} = useParams();
//     return <ProfilePage userId={userId}/>;
// }
//
// function ProfilePageWithTwoParams() {
//     const {userId, wishlistId} = useParams();
//     return <ProfilePage
//         userId={userId}
//         wishlistId={wishlistId}
//     />;
// }
//
// function OthersFriendsWithParams() {
//     const {userId} = useParams();
//     return <OthersFriends userId={userId}/>;
// }

export default App;
