import React from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';

function Logo() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

    const getLogoSize = () => {
        if (isMobile) return 32;
        if (isTablet) return 50;
        return 60;
    };

    const logoSize = getLogoSize();

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: logoSize,
                height: logoSize,
                overflow: 'hidden',
                backgroundColor: 'transparent',
                transition: 'all 0.3s ease'
            }}
        >
            <img
                src="/logo192.png"
                alt="Logo"
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain'
                }}
            />
        </Box>
    );
}

export default Logo;