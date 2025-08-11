import React, {useEffect, useRef, useState} from 'react';
import keycloak from './keycloak/Keycloak';
import ProfilePage from "./component/ProfilePage";
import {httpClient} from './http/HttpClient';

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
                            console.log('Token refreshed: ' + new Date().toLocaleString());
                            httpClient.defaults.headers.common['Authorization'] = `Bearer ${keycloak.token}`;
                        }
                    })
                    .catch(() => keycloak.login());
            }, 30000);
            return () => clearInterval(interval);
        }
    }, [authenticated]);

    if (!authenticated) {
        return <div>Initializing Keycloak...</div>;
    }

    httpClient.defaults.headers.common['Authorization'] = `Bearer ${keycloak.token}`;

    return (
        <ProfilePage/>
    );
}

export default App;
