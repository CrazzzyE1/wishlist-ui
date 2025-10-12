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
                        p: 2,
                        minWidth: 400
                    }
                }}
            >
                <DialogTitle
                    sx={{
                        textAlign: 'center',
                        fontSize: '1.25rem',
                        pb: 2
                    }}
                >
                    Поделиться ссылкой
                </DialogTitle>
                <DialogContent>
                    <Box sx={{mt: 2, mb: 2}}>
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
                                }
                            }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{
                    justifyContent: 'center',
                    gap: 2,
                    pt: 1
                }}>
                    <Button
                        onClick={onClose}
                        variant="outlined"
                        sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 500,
                            minWidth: 120
                        }}
                    >
                        Закрыть
                    </Button>
                    <Button
                        onClick={handleCopyLink}
                        startIcon={<ContentCopyIcon/>}
                        variant="contained"
                        sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 500,
                            minWidth: 160,
                            backgroundColor: 'primary.main',
                            '&:hover': {
                                backgroundColor: 'primary.dark'
                            }
                        }}
                    >
                        Копировать ссылку
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
                        fontWeight: 500
                    }}
                >
                    Ссылка скопирована в буфер обмена!
                </Alert>
            </Snackbar>
        </>
    );
}