import {useEffect, useState} from 'react';
import FormControl from '@mui/material/FormControl';
import {Box, styled, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import SelectTextFields from "./CurrencySelect";
import ListSelector from "./ListSelector";
import ImageUploadAndCrop from "./ImageUploadAndCrop";
import BasicDatePicker from "./BasicDatePicker";
import dayjs from "dayjs";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";

const PublicRadio = styled(Radio)(({theme}) => ({
    color: theme.palette.success.main,
    '&.Mui-checked': {
        color: theme.palette.success.main,
    },
}));

const FriendsRadio = styled(Radio)(({theme}) => ({
    color: '#ff9800',
    '&.Mui-checked': {
        color: '#ff9800',
    },
}));

const PrivateRadio = styled(Radio)(({theme}) => ({
    color: theme.palette.error.main,
    '&.Mui-checked': {
        color: theme.palette.error.main,
    },
}));


export default function ProfileEditBox({gift, onEdit, onCancel, lists}) {
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
    const [date, setDate] = useState(dayjs());
    const [value, setValue] = useState('PUBLIC');

    // useEffect(() => {
    //     setGiftName(gift.name)
    //     setPrice(gift.price.amount)
    //     setCurrency(gift.price.currency)
    //     setLink(gift.link)
    //     setDescription(gift.description)
    //     setSelectedListId(gift.wishListId)
    // }, [gift.id]);

    const handleSelectedListId = (id) => {
        setSelectedListId(id);
    };

    const handleCurrency = (currency) => {
        setCurrency(currency)
    };

    const handleDateChange = (newDate) => {
        setDate(newDate);
    };

    const handleDescriptionChange = (event) => {
        const value = event.target.value;
        setDescription(value);
        setErrorDescription(value.length > 500);
    };

    const handleChange = (event) => {
        setValue(event.target.value);
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
                    // id: gift.id,
                    // name: trimmedName,
                    // image: image,
                    // listId: selectedListId,
                    // description: description,
                    // price: price,
                    // link: link,
                    // currency: currency
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
        <FormControl sx={{gap: 2, width: '100%'}}>
            <ImageUploadAndCrop
                onImageCropped={setImage}
                aspectRatio={400 / 400}
            />

            <Box sx={{mt: 0}}>
                <TextField
                    id="gift-name"
                    label="Фамилия"
                    variant="standard"
                    value={giftName}
                    onChange={handleListNameChange}
                    error={errorName}
                    helperText={errorName ? "Название должно быть не короче 3 символов" : ""}
                    fullWidth
                />
            </Box>
            <Box sx={{mt: 0}}>
                <TextField
                    id="gift-name"
                    label="Имя"
                    variant="standard"
                    value={giftName}
                    onChange={handleListNameChange}
                    error={errorName}
                    helperText={errorName ? "Название должно быть не короче 3 символов" : ""}
                    fullWidth
                />
            </Box>
            <Box sx={{mt: 2}}>
                <BasicDatePicker
                    label="Дата Рождения"
                    value={date}
                    onChange={handleDateChange}
                />
            </Box>
            <Box sx={{mt: 2}}>
                <ListSelector
                    label="Выберите Ваш статус"
                    data={lists}
                    selectedListId={selectedListId}
                    onSelect={handleSelectedListId}
                />
            </Box>

            <Box sx={{mt: 2}}>
                <FormLabel id="PrivacyLabelRadioBox">Приватность</FormLabel>
                <RadioGroup
                    aria-labelledby="PrivacyLabelRadioBox"
                    name="PrivacyLabelRadioBox"
                    value={value}
                    onChange={handleChange}
                    sx={{mt: 1}}
                >
                    <FormControlLabel
                        value="PUBLIC"
                        control={<PublicRadio/>}
                        label="Публичный"
                    />
                    <FormControlLabel
                        value="FRIENDS_ONLY"
                        control={<FriendsRadio/>}
                        label="Только для друзей"
                    />
                    <FormControlLabel
                        value="PRIVATE"
                        control={<PrivateRadio/>}
                        label="Приватный"
                    />
                </RadioGroup>
            </Box>

            <Box sx={{mt: 2}}>
                <Box sx={{display: 'flex', justifyContent: 'space-between', mt: 2}}>
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