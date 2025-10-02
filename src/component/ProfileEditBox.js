import React, {useEffect, useState} from 'react';
import FormControl from '@mui/material/FormControl';
import {Box, LinearProgress, styled, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import ListSelector from "./ListSelector";
import ImageUploadAndCrop from "./ImageUploadAndCrop";
import BasicDatePicker from "./BasicDatePicker";
import dayjs from "dayjs";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import {httpClient} from "../http/HttpClient";
import {pink} from "@mui/material/colors";

const statuses = [
    {
        id: 'WAITING',
        name: 'WAITING'
    },
    {
        id: 'NO_WAITING',
        name: 'NO_WAITING'
    }
];

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

const GenderMaleRadio = styled(Radio)(({theme}) => ({
    color: theme.palette.primary.main,
    '&.Mui-checked': {
        color: theme.palette.primary.main,
    },
}));

const GenderFemaleRadio = styled(Radio)(({theme}) => ({
    color: pink[500],
    '&.Mui-checked': {
        color: pink[500],
    },
}));


export default function ProfileEditBox({onCancel, onEdit}) {
    const [familyName, setFamilyName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [status, setStatus] = useState('');
    const [privacyLevel, setPrivacyLevel] = useState('PUBLIC');
    const [gender, setGender] = useState();
    const [email, setEmailLevel] = useState();

    const [errorFamilyName, setErrorFamilyName] = useState(false);
    const [errorFirstName, setErrorFirstName] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [image, setImage] = useState(null);
    const [birthDate, setBirthDate] = useState(dayjs());
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);

                const response = await httpClient.get('/profiles/me');
                setFamilyName(response.data.familyName);
                setFirstName(response.data.firstName);
                setBirthDate(dayjs(response.data.birthDate));
                setStatus(response.data.status);
                setPrivacyLevel(response.data.privacyLevel);
                setGender(response.data.gender);
                setEmailLevel(response.data.email);
                setStatus(response.data.status);

            } catch (err) {
                setError(err.message);
                console.error('Ошибка загрузки данных:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleSelectedListId = (id) => {
        setStatus(id);
    };

    const handleDateChange = (newDate) => {
        setBirthDate(newDate);
    };

    const handleChange = (event) => {
        setPrivacyLevel(event.target.value);
    };

    const handleGenderChange = (event) => {
        setGender(event.target.value);
    };

    const handleFamilyNameChange = (event) => {
        const value = event.target.value;
        setFamilyName(value);

        const isValid = value.trim().length >= 1;
        setErrorFamilyName(!isValid);
    };

    const handleFirstNameChange = (event) => {
        const value = event.target.value;
        setFirstName(value);

        const isValid = value.trim().length >= 1;
        setErrorFirstName(!isValid);
    };

    const handleSubmit = async () => {
        const trimmedName = familyName.trim();

        if (trimmedName.length < 1) {
            setErrorFirstName(true);
            return;
        }

        setIsSubmitting(true);

        try {
            if (onEdit) {
                await onEdit({
                    image: image,
                    firstName: firstName,
                    familyName: familyName,
                    gender: gender,
                    birthDate: birthDate,
                    status: status,
                    privacyLevel: privacyLevel
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const isSubmitDisabled = isSubmitting ||
        familyName.trim().length < 1 ||
        firstName.trim().length < 1

    if (loading) {
        return <LinearProgress color="success"/>;
    }

    if (error) {
        return <div>Ошибка: {error}</div>;
    }

    return (
        <FormControl sx={{gap: 2, width: '100%'}}>
            <ImageUploadAndCrop
                onImageCropped={setImage}
                aspectRatio={400 / 400}
            />

            <Box sx={{mt: 0}}>
                <TextField
                    id="family-name"
                    label="Фамилия"
                    variant="standard"
                    value={familyName}
                    onChange={handleFamilyNameChange}
                    error={errorFamilyName}
                    helperText={errorFamilyName ? "Фамилия не должна быть пустой" : ""}
                    fullWidth
                />
            </Box>
            <Box sx={{mt: 0}}>
                <TextField
                    id="first-name"
                    label="Имя"
                    variant="standard"
                    value={firstName}
                    onChange={handleFirstNameChange}
                    error={errorFirstName}
                    helperText={errorFirstName ? "Имя не должно быть пустым" : ""}
                    fullWidth
                />
            </Box>

            <Box sx={{mt: 0}}>
                <TextField
                    id="first-name"
                    label="Email"
                    variant="standard"
                    value={email}
                    disabled={true}
                    fullWidth
                />
            </Box>

            <Box sx={{mt: 3}}>
                <BasicDatePicker
                    label="Дата Рождения"
                    value={birthDate}
                    onChange={handleDateChange}
                />
            </Box>
            <Box sx={{mt: 2}}>
                <ListSelector
                    label="Выберите Ваш статус"
                    data={statuses}
                    selectedListId={status}
                    onSelect={handleSelectedListId}
                />
            </Box>

            <Box sx={{mt: 2}}>
                <FormLabel id="PrivacyLabelRadioBox">Пол</FormLabel>
                <RadioGroup
                    aria-labelledby="PrivacyLabelRadioBox"
                    name="PrivacyLabelRadioBox"
                    value={gender}
                    onChange={handleGenderChange}
                    sx={{mt: 1}}
                >
                    <FormControlLabel
                        value="MALE"
                        control={<GenderMaleRadio/>}
                        label="Мужской"
                    />
                    <FormControlLabel
                        value="FEMALE"
                        control={<GenderFemaleRadio/>}
                        label="Женский"
                    />
                </RadioGroup>
            </Box>

            <Box sx={{mt: 2}}>
                <FormLabel id="PrivacyLabelRadioBox">Приватность</FormLabel>
                <RadioGroup
                    aria-labelledby="PrivacyLabelRadioBox"
                    name="PrivacyLabelRadioBox"
                    value={privacyLevel}
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
                        {isSubmitting ? 'Сохранение...' : 'Сохранить'}
                    </Button>
                </Box>
            </Box>
        </FormControl>
    );
}