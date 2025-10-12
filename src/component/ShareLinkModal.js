import React, {useState} from 'react';
import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Snackbar,
    TextField
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

export default function ShareLinkModal({id, sublink, open, onClose}) {
    const [showNotification, setShowNotification] = useState(false);

    const shareLink = `${window.location.origin}/${sublink}/${id}`;
    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareLink);
            setShowNotification(true);
            if (onClose){
                onClose();
            }
        } catch (error) {
            console.error('Ошибка при копировании:', error);
            const textArea = document.createElement('textarea');
            textArea.value = shareLink;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setShowNotification(true);
        }
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        textAlign: 'center',
                        pb: 2,
                        minWidth: 300
                    }
                }}
            >
                <DialogTitle
                    sx={{
                        textAlign: 'center',
                        fontSize: {xs: '0.875rem', sm: '1.25rem'},
                        fontWeight: 600
                    }}
                >
                    Поделиться ссылкой
                </DialogTitle>
                <DialogContent sx={{textAlign: 'center'}}>
                    <Box
                        sx={{
                            mt: 2,
                            // mb: 2
                    }}
                    >
                        <TextField
                            label="Ссылка"
                            value={shareLink}
                            fullWidth
                            InputProps={{
                                readOnly: true,
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                },
                                '& .MuiInputLabel-root': {
                                    fontSize: {xs: '0.75rem', sm: '0.875rem'}
                                },
                                '& .MuiInputBase-input': {
                                    fontSize: {xs: '0.75rem', sm: '0.875rem'}
                                }
                            }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{
                    justifyContent: 'center',
                    gap: 2
                }}>
                    <Button
                        onClick={onClose}
                        variant="outlined"
                        sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 500,
                            fontSize: {xs: '0.75rem', sm: '0.875rem'}
                        }}
                    >
                        Закрыть
                    </Button>
                    <Button
                        onClick={handleCopyLink}
                        startIcon={<ContentCopyIcon sx={{fontSize: {xs: 18, sm: 20}}} />}
                        variant="contained"
                        sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 500,
                            fontSize: {xs: '0.75rem', sm: '0.875rem'},
                            backgroundColor: 'primary.main',
                            '&:hover': {
                                backgroundColor: 'primary.dark'
                            }
                        }}
                    >
                        Копировать
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={showNotification}
                autoHideDuration={3000}
                onClose={() => setShowNotification(false)}
                anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
            >
                <Alert
                    severity="success"
                    sx={{
                        borderRadius: 2,
                        fontWeight: 500,
                        fontSize: {xs: '0.75rem', sm: '0.875rem'}
                    }}
                >
                    Ссылка скопирована в буфер обмена!
                </Alert>
            </Snackbar>
        </>
    );
}