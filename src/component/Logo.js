import React from 'react';
import {useNavigate} from "react-router-dom";
import IconButton from "@mui/material/IconButton";

function Logo() {

    const navigate = useNavigate();

    return (
        <IconButton
            onClick={() => navigate('/')}
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: {xs: 60, sm: 70, md: 70},
                height: {xs: 60, sm: 70, md: 70},
                overflow: 'hidden',
                backgroundColor: 'transparent',
                transition: 'all 0.3s ease',
                '&:hover': {
                    '& .MuiSvgIcon-hand': {
                        color: '#000000'
                    }
                },
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
        </IconButton>
    );
}

export default Logo;