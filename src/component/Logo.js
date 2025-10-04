import React from 'react';
import {Box} from '@mui/material';

function Logo() {
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: {xs: 30, sm: 40, md: 50},
                height: {xs: 30, sm: 40, md: 50},
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