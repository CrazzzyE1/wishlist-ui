import {useState} from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import IconButton from "@mui/material/IconButton";
import PostAddIcon from "@mui/icons-material/PostAdd";
import ListCreateBox from "./ListCreateBox";
import {httpClient} from "../http/HttpClient";
import Grid from "@mui/material/Grid";

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: {
        xs: '90vw',
        sm: '80vw',
        md: 600,
        lg: 800
    },
    maxHeight: '85vh',
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 3,
    overflow: 'auto',
};

export default function ListCreator({onListCreated}) {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleCreateList = async (listData) => {
        try {
            const response = await httpClient.post('/wishlists', {
                name: listData.name,
                eventDate: listData.date ? listData.date.format('YYYY-MM-DD') : null,
                privacyLevel: listData.privacyLevel
            });
            handleClose();
            if (onListCreated) {
                onListCreated(response.data.id);
            }
        } catch (error) {
            console.error('Ошибка при создании списка:', error);
        }
    };

    return (
        <Grid size={{xs: 12, sm: 12}}>
            <IconButton
                onClick={handleOpen}
                disableRipple
                sx={{
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    width: {xs: '100%', sm: '100%'},
                    height: {xs: 48, sm: 48},
                    borderRadius: '50%',
                    '&:hover': {
                        '& .MuiSvgIcon-root': {
                            color: '#000000'
                        }
                    },
                }}>
                <PostAddIcon sx={{
                    fontSize: {xs: 42, sm: 48},
                    transition: 'color 0.5s ease'
                }}/>
                <Typography
                    sx={{
                        fontSize: {xs: '1rem', sm: '1.3rem'}
                    }}>
                    Создать новый список
                </Typography>
            </IconButton>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalStyle}>
                    <Typography id="modal-modal-title" variant="h6" component="h2" sx={{mb: 2}}>
                        Создать новый список
                    </Typography>
                    <ListCreateBox
                        onCreate={handleCreateList}
                        onCancel={handleClose}
                    />
                </Box>
            </Modal>
        </Grid>
    );
}