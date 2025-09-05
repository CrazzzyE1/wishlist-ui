import { Box, Typography, useTheme } from '@mui/material';

export const Logo = () => {
    const theme = useTheme();

    return (
        <Box
            component="figure"
            aria-label="WISH LIST Logo"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative',
                height: { xs: '50px', md: '60px' },
                width: { xs: '180px', md: '240px' },
                margin: '0 auto',
                cursor: 'default'
            }}
        >
            {/* Верхняя строка (W и H) */}
            <Box sx={{
                position: 'absolute',
                top: { xs: '-7%', md: '-7%' },
                left: '48%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: { xs: '70px', md: '40px' },
                alignItems: 'baseline'
            }}>
                <Typography
                    variant="h4"
                    component="span"
                    sx={{
                        color: theme.palette.mode === 'dark' ? 'grey.300' : 'grey.700',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            color: 'primary.main',
                            transform: 'translateY(-2px)',
                            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }
                    }}
                >
                    W
                </Typography>
                <Typography
                    variant="h4"
                    component="span"
                    sx={{
                        color: theme.palette.mode === 'dark' ? 'grey.300' : 'grey.700',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            color: 'brown',
                            transform: 'translateY(-2px)',
                            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }
                    }}
                >
                    I
                </Typography>
                <Typography
                    variant="h4"
                    component="span"
                    sx={{
                        color: theme.palette.mode === 'dark' ? 'grey.300' : 'grey.700',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            color: 'green',
                            transform: 'translateY(-2px)',
                            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }
                    }}
                >
                    S
                </Typography>
                <Typography
                    variant="h4"
                    component="span"
                    sx={{
                        color: theme.palette.mode === 'dark' ? 'grey.300' : 'grey.700',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            color: 'red',
                            transform: 'translateY(-2px)',
                            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }
                    }}
                >
                    H
                </Typography>
            </Box>

            {/* Нижняя строка (L и T) */}
            <Box sx={{
                position: 'absolute',
                bottom: { xs: '-7%', md: '-7%' },
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: { xs: '50px', md: '20px' },
                alignItems: 'baseline'
            }}>
                <Typography
                    variant="h4"
                    component="span"
                    sx={{
                        color: theme.palette.mode === 'dark' ? 'grey.300' : 'grey.700',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            color: 'black',
                            transform: 'translateY(2px)',
                            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }
                    }}
                >
                    L
                </Typography>
                <Typography
                    variant="h4"
                    component="span"
                    sx={{
                        color: theme.palette.mode === 'dark' ? 'grey.300' : 'grey.700',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            color: 'orange',
                            transform: 'translateY(2px)',
                            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }
                    }}
                >
                    I
                </Typography>
                <Typography
                    variant="h4"
                    component="span"
                    sx={{
                        color: theme.palette.mode === 'dark' ? 'grey.300' : 'grey.700',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            color: 'pink',
                            transform: 'translateY(2px)',
                            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }
                    }}
                >
                    S
                </Typography>
                <Typography
                    variant="h4"
                    component="span"
                    sx={{
                        color: theme.palette.mode === 'dark' ? 'grey.300' : 'grey.700',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            color: 'secondary.main',
                            transform: 'translateY(2px)',
                            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }
                    }}
                >
                    T
                </Typography>
                <Typography
                    variant="h4"
                    component="span"
                    sx={{
                        color: theme.palette.mode === 'dark' ? 'grey.300' : 'grey.700',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            color: 'secondary.main',
                            transform: 'translateY(2px)',
                            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }
                    }}
                >
                    Y
                </Typography>
            </Box>
        </Box>
    );
};