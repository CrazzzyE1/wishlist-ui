import { Avatar } from "@mui/material";
import * as React from "react";
import { useEffect, useState } from "react";
import { httpClient } from "../http/HttpClient";

function ProfileAvatar({ onAvatarLoaded }) {
    const [avatarSrc, setAvatarSrc] = useState(null);

    useEffect(() => {
        const fetchAvatar = async () => {
            try {
                const response = await httpClient.get('http://localhost:9000/api/v1/avatars/me', {
                    responseType: 'arraybuffer'
                });

                const blob = new Blob([response.data], { type: response.headers['content-type'] });
                const imageUrl = URL.createObjectURL(blob);
                setAvatarSrc(imageUrl);
                onAvatarLoaded(imageUrl);
            } catch (err) {
                console.error('Ошибка загрузки аватара:', err);
            }
        };

        fetchAvatar();

        return () => {
            if (avatarSrc) {
                URL.revokeObjectURL(avatarSrc);
            }
        };
    }, [onAvatarLoaded]);

    return (
        <Avatar
            alt="User avatar"
            src={avatarSrc}
            sx={{ width: 250, height: 250 }}
        />
    );
}

export default ProfileAvatar;