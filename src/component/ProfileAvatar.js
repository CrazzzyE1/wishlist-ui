import { Avatar } from "@mui/material";
import * as React from "react";
import { useEffect, useState } from "react";
import { httpClient } from "../http/HttpClient";

function ProfileAvatar() {
    const [avatarSrc, setAvatarSrc] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAvatar = async () => {
            try {
                const response = await httpClient.get('http://localhost:9000/api/v1/avatars/me', {
                    responseType: 'arraybuffer' // Важно для получения бинарных данных
                });
                const blob = new Blob([response.data], { type: response.headers['content-type'] });
                const imageUrl = URL.createObjectURL(blob);
                setAvatarSrc(imageUrl);
            } catch (err) {
                console.error('Ошибка загрузки аватара:', err);
                setError('Не удалось загрузить аватар');
            } finally {
                setLoading(false);
            }
        };

        fetchAvatar();

        return () => {
            if (avatarSrc) {
                URL.revokeObjectURL(avatarSrc);
            }
        };
    }, []);

    if (loading) {
        return <Avatar sx={{ width: 250, height: 250 }} />;
    }

    if (error) {
        return (
            <Avatar sx={{ width: 250, height: 250 }}>
                Error
            </Avatar>
        );
    }

    return (
        <Avatar
            alt="User avatar"
            src={avatarSrc}
            sx={{ width: 250, height: 250 }}
        />
    );
}

export default ProfileAvatar;