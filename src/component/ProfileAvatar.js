import {Avatar, Skeleton, useMediaQuery} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import * as React from "react";
import {useEffect, useState} from "react";
import {httpClient} from "../http/HttpClient";

function ProfileAvatar({userId}) {
    const [loading, setLoading] = useState(true);
    const [avatarSrc, setAvatarSrc] = useState(null);
    const theme = useTheme();

    const isXs = useMediaQuery(theme.breakpoints.down('sm'));
    const isSm = useMediaQuery(theme.breakpoints.between('sm', 'md'));

    const getAvatarSize = () => {
        if (isXs) return 100;
        if (isSm) return 150;
        return 200;
    };

    const avatarSize = getAvatarSize();

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
            <Skeleton
                variant="circular"
                width={avatarSize}
                height={avatarSize}
                sx={{
                    minWidth: avatarSize,
                    minHeight: avatarSize
                }}
            >
                <Avatar sx={{
                    width: avatarSize,
                    height: avatarSize,
                    minWidth: avatarSize,
                    minHeight: avatarSize
                }}/>
            </Skeleton>
        ) : (
            <Avatar
                alt="User avatar"
                src={avatarSrc}
                sx={{
                    width: avatarSize,
                    height: avatarSize,
                    minWidth: avatarSize,
                    minHeight: avatarSize,
                    fontSize: `${avatarSize / 5}px`
                }}
            />
        )
    );
}

export default ProfileAvatar;