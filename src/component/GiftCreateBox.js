import * as React from 'react';
import FormControl from '@mui/material/FormControl';
import {Box, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import SelectTextFields from "./SelectTextFields";
import FreeSolo from "./FreeSolo";
import ImageUploadAndCrop from "./ImageUploadAndCrop";

export default function ListCreateBox({onCreate, onCancel}) {
    const [listName, setListName] = React.useState('');
    const [errorName, setErrorName] = React.useState(false);

    const [descriptionName, setDescriptionName] = React.useState('');
    const [errorDescription, setErrorDescription] = React.useState(false);

    const [price, setPrice] = React.useState('');
    const [link, setLinkName] = React.useState('');
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [image, setImage] = React.useState(null);

    const handleDescriptionChange = (event) => {
        const value = event.target.value;
        setDescriptionName(value);
        setErrorDescription(value.length > 900);
    };

    const handleListNameChange = (event) => {
        const value = event.target.value;
        setListName(value);

        const trimmedValue = value.trim();
        const isValid = trimmedValue.length >= 3;

        setErrorName(!isValid);
    };

    const handleLinkNameChange = (event) => {
        const value = event.target.value.trim();
        setLinkName(value);
    };

    const handlePriceChange = (event) => {
        const value = event.target.value.replace(/[^\d]/g, '');
        event.target.value = value;
        setPrice(value);
    };

    const handleSubmit = async () => {
        const trimmedName = listName.trim();

        if (trimmedName.length < 3) {
            setErrorName(true);
            return;
        }

        setIsSubmitting(true);

        try {
            if (onCreate) {
                await onCreate({
                    name: trimmedName,
                    image: image,
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <FormControl sx={{gap: 2}}>
            <ImageUploadAndCrop
                onImageCropped={setImage}
                aspectRatio={400 / 400}
            />

            <Box sx={{mt: 0}}>
                <TextField
                    id="list-name"
                    label="Название подарка"
                    variant="standard"
                    value={listName}
                    onChange={handleListNameChange}
                    error={errorName}
                    helperText={errorName ? "Название должно быть не короче 3 символов и не состоять только из пробелов" : ""}
                    inputProps={{minLength: 3}}
                    fullWidth
                />
            </Box>
            <Box sx={{mt: 0}}>
                <FreeSolo/>
            </Box>

            <Box sx={{
                mt: 1,
                display: 'flex',
                alignItems: 'flex-end',
                gap: 1
            }}>
                <TextField
                    id="list-name"
                    label="Цена"
                    variant="standard"
                    value={price}
                    onChange={handlePriceChange}
                    inputProps={{minLength: 3}}
                    sx={{flex: 1}}
                />
                <SelectTextFields/>
            </Box>

            <Box sx={{mt: 0}}>
                <TextField
                    id="list-name"
                    label="Ссылка"
                    variant="standard"
                    value={link}
                    onChange={handleLinkNameChange}
                    fullWidth
                    multiline
                    maxRows={5}
                />
            </Box>

            <Box sx={{mt: 0}}>
                <TextField
                    id="list-name"
                    label="Описание"
                    variant="standard"
                    value={descriptionName}
                    onChange={handleDescriptionChange}
                    error={errorDescription}
                    helperText={errorDescription ? "Название должно быть более 900 символов" : ""}
                    fullWidth
                    multiline
                    maxRows={20}
                />
            </Box>

            <Box sx={{mt: 2}}>
                <Box sx={{display: 'flex', justifyContent: 'space-between', mt: 2}}>
                    <Button
                        variant="outlined"
                        color="black"
                        onClick={onCancel}
                    >
                        Отмена
                    </Button>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={handleSubmit}
                        disabled={isSubmitting || errorName}
                    >
                        {isSubmitting ? 'Сохранение...' : 'Создать подарок'}
                    </Button>
                </Box>
            </Box>
        </FormControl>
    );
}