import { createContext, useContext, useState, useEffect } from 'react';
import { httpClient } from '../http/HttpClient';

const NotificationsContext = createContext();

export const NotificationsProvider = ({ children }) => {
    const [unreadCount, setUnreadCount] = useState(0);
    const [incomingFriendsRequestCount, setIncomingFriendsRequestCount] = useState(0);

    const fetchUnreadCount = async () => {
        try {
            const response = await httpClient.get('/notifications/count', {
                params: { unread: true }
            });
            setUnreadCount(response.data || 0);
        } catch (err) {
            console.error('Ошибка загрузки счетчика уведомлений:', err);
            setUnreadCount(0);
        }
    };

    const decrementCount = () => {
        setUnreadCount(prev => Math.max(0, prev - 1));
    };

    const incrementCount = () => {
        setUnreadCount(prev => prev + 1);
    };

    const resetCount = () => {
        setUnreadCount(0);
    };

    const fetchIncomingFriendsRequestCount = async () => {
        try {
            const response = await httpClient.get('/friends/requests/count');
            console.log(response.data)
            setIncomingFriendsRequestCount(response.data || 0);
        } catch (err) {
            console.error('Ошибка загрузки счетчика входящих заявок:', err);
            setIncomingFriendsRequestCount(0);
        }
    };

    const decrementIncomingFriendsRequestCount = () => {
        setIncomingFriendsRequestCount(prev => Math.max(0, prev - 1));
    };

    const incrementIncomingFriendsRequestCount = () => {
        setIncomingFriendsRequestCount(prev => prev + 1);
    };

    const resetIncomingFriendsRequestCount = () => {
        setIncomingFriendsRequestCount(0);
    };

    useEffect(() => {
        fetchUnreadCount();
        fetchIncomingFriendsRequestCount();
    }, []);

    return (
        <NotificationsContext.Provider value={{
            unreadCount,
            fetchUnreadCount,
            decrementCount,
            incrementCount,
            resetCount,
            incomingFriendsRequestCount,
            fetchIncomingFriendsRequestCount,
            decrementIncomingFriendsRequestCount,
            incrementIncomingFriendsRequestCount,
            resetIncomingFriendsRequestCount
        }}>
            {children}
        </NotificationsContext.Provider>
    );
};

export function useNotifications() {
    const context = useContext(NotificationsContext);
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationsProvider');
    }
    return context;
}