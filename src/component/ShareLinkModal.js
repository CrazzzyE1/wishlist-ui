import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    TextField,
    Snackbar,
    Alert
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

export default function ShareLinkModal({ wishlistId, open, onClose }) {
    const [showNotification, setShowNotification] = useState(false);

    const shareLink = `${window.location.origin}/wishlist/${wishlistId}`;
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
            <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
                <DialogTitle>Поделиться списком</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2, mb: 2 }}>
                        <TextField
                            label="Ссылка на список"
                            value={shareLink}
                            fullWidth
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Закрыть</Button>
                    <Button
                        onClick={handleCopyLink}
                        startIcon={<ContentCopyIcon />}
                        variant="contained"
                    >
                        Копировать ссылку
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={showNotification}
                autoHideDuration={3000}
                onClose={() => setShowNotification(false)}
            >
                <Alert severity="success">
                    Ссылка скопирована в буфер обмена!
                </Alert>
            </Snackbar>
        </>
    );
}