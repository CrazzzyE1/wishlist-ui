import { createContext, useContext, useState, useEffect } from 'react';
import { httpClient } from '../http/HttpClient';

const NotificationsContext = createContext();

export const NotificationsProvider = ({ children }) => {
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchUnreadCount = async () => {
        try {
            const response = await httpClient.get('http://localhost:9000/api/v1/notifications/count', {
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

    useEffect(() => {
        fetchUnreadCount();
    }, []);

    return (
        <NotificationsContext.Provider value={{
            unreadCount,
            fetchUnreadCount,
            decrementCount,
            incrementCount,
            resetCount
        }}>
            {children}
        </NotificationsContext.Provider>
    );
};

// 3. Создаем и экспортируем кастомный хук
export function useNotifications() {
    const context = useContext(NotificationsContext);
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationsProvider');
    }
    return context;
}