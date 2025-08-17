import {useEffect, useState} from 'react';
import FormControl from '@mui/material/FormControl';
import { Box, TextField } from "@mui/material";
import Button from "@mui/material/Button";
import SelectTextFields from "./CurrencySelect";
import ListSelector from "./ListSelector";
import ImageUploadAndCrop from "./ImageUploadAndCrop";

export default function GiftEditBox({ gift, onEdit, onCancel, lists }) {
    const [giftName, setGiftName] = useState('');
    const [errorName, setErrorName] = useState(false);
    const [description, setDescription] = useState('');
    const [errorDescription, setErrorDescription] = useState(false);
    const [price, setPrice] = useState('');
    const [link, setLink] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [image, setImage] = useState(null);
    const [selectedListId, setSelectedListId] = useState(null);
    const [currency, setCurrency] = useState(null);

    useEffect(() => {
        setGiftName(gift.name)
        setPrice(gift.price.amount)
        setCurrency(gift.price.currency)
        setLink(gift.link)
        setDescription(gift.description)
        setSelectedListId(gift.wishListId)
    }, [gift.id]);

    const handleSelectedListId = (id) => {
        setSelectedListId(id);
    };

    const handleCurrency = (currency) => {
        setCurrency(currency)
    };

    const handleDescriptionChange = (event) => {
        const value = event.target.value;
        setDescription(value);
        setErrorDescription(value.length > 500);
    };

    const handleListNameChange = (event) => {
        const value = event.target.value;
        setGiftName(value);

        const isValid = value.trim().length >= 3;
        setErrorName(!isValid);
    };

    const handleLinkNameChange = (event) => {
        const value = event.target.value.trim();
        setLink(value);
    };

    const handlePriceChange = (event) => {
        const value = event.target.value.replace(/[^\d]/g, '');
        event.target.value = value;
        setPrice(value);
    };

    const handleSubmit = async () => {
        const trimmedName = giftName.trim();

        if (trimmedName.length < 3) {
            setErrorName(true);
            return;
        }

        setIsSubmitting(true);

        try {
            console.log("selected: " + selectedListId)
            if (onEdit) {
                await onEdit({
                    id: gift.id,
                    name: trimmedName,
                    image: image,
                    listId: selectedListId,
                    description: description,
                    price: price,
                    link: link,
                    currency: currency
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const isSubmitDisabled = isSubmitting ||
        giftName.trim().length < 3 ||
        errorDescription;

    return (
        <FormControl sx={{ gap: 2, width: '100%' }}>
            <ImageUploadAndCrop
                onImageCropped={setImage}
                aspectRatio={400 / 400}
            />

            <Box sx={{ mt: 0 }}>
                <TextField
                    id="gift-name"
                    label="Название подарка"
                    variant="standard"
                    value={giftName}
                    onChange={handleListNameChange}
                    error={errorName}
                    helperText={errorName ? "Название должно быть не короче 3 символов" : ""}
                    fullWidth
                />
            </Box>

            <Box sx={{ mt: 0 }}>
                <ListSelector
                    label="Выберите список для подарка"
                    data={lists}
                    selectedListId={selectedListId}
                    onSelect={handleSelectedListId}
                />
            </Box>

            <Box sx={{
                mt: 1,
                display: 'flex',
                alignItems: 'flex-end',
                gap: 1
            }}>
                <TextField
                    id="gift-price"
                    label="Цена"
                    variant="standard"
                    value={price}
                    onChange={handlePriceChange}
                    sx={{ flex: 1 }}
                />
                <SelectTextFields onCurrency={handleCurrency} currency={gift.price.currency}/>
            </Box>

            <Box sx={{ mt: 0 }}>
                <TextField
                    id="gift-link"
                    label="Ссылка"
                    variant="standard"
                    value={link}
                    onChange={handleLinkNameChange}
                    fullWidth
                    multiline
                    maxRows={2}
                />
            </Box>

            <Box sx={{ mt: 0 }}>
                <TextField
                    id="gift-description"
                    label="Описание"
                    variant="standard"
                    value={description}
                    onChange={handleDescriptionChange}
                    error={errorDescription}
                    helperText={errorDescription ? "Описание должно быть не более 500 символов" : ""}
                    fullWidth
                    multiline
                    maxRows={5}
                />
            </Box>

            <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Button
                        variant="outlined"
                        color="black"
                        onClick={onCancel}
                        disabled={isSubmitting}
                    >
                        Отмена
                    </Button>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={handleSubmit}
                        disabled={isSubmitDisabled}
                    >
                        {isSubmitting ? 'Сохранение...' : 'Сохранить изменения'}
                    </Button>
                </Box>
            </Box>
        </FormControl>
    );
}