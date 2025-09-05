import {Avatar, Skeleton} from "@mui/material";
import * as React from "react";
import {useEffect, useState} from "react";
import {httpClient} from "../http/HttpClient";

function ProfileAvatar({userId}) {
    const [loading, setLoading] = useState(true);
    const [avatarSrc, setAvatarSrc] = useState(null);

    useEffect(() => {
        const fetchAvatar = async () => {
            try {
                setLoading(true);
                const url = userId
                    ? `/avatars/user/${userId}`
                    : '/avatars/me';
                const response = await httpClient.get(url, {
                    responseType: 'arraybuffer'
                });

                const blob = new Blob([response.data], {type: response.headers['content-type']});
                const imageUrl = URL.createObjectURL(blob);
                setAvatarSrc(imageUrl);
            } catch (err) {
                console.error('Ошибка загрузки аватара:', err);
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
    }, [userId]);

    return (
        loading ? (
            <Skeleton variant="circular" width={250} height={250}>
                <Avatar sx={{width: 250, height: 250}}/>
            </Skeleton>
        ) : (
            <Avatar
                alt="User avatar"
                src={avatarSrc}
                sx={{width: 250, height: 250}}
            />
        )
    );
}

export default ProfileAvatar;