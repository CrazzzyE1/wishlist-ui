import {useState} from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import {Box, Checkbox, styled, TextField} from "@mui/material";
import BasicDatePicker from "./BasicDatePicker";
import Button from "@mui/material/Button";
import dayjs from 'dayjs';
import 'dayjs/locale/ru';

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

export default function ListCreateBox({onCreate, onCancel}) {
    const [value, setValue] = useState('PUBLIC');
    const [listName, setListName] = useState('');
    const [date, setDate] = useState(dayjs());
    const [noDate, setNoDate] = useState(false);
    const [error, setError] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleDateChange = (newDate) => {
        setDate(newDate);
    };

    const handleNoDateChange = (event) => {
        setNoDate(event.target.checked);
        if (event.target.checked) {
            setDate(null);
        } else {
            setDate(dayjs());
        }
    };

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    const handleListNameChange = (event) => {
        const value = event.target.value;
        setListName(value);
        setError(value.length > 0 && value.length < 3);
    };

    const handleSubmit = async () => {
        if (listName.length < 3) {
            setError(true);
            return;
        }

        setIsSubmitting(true);

        try {
            if (onCreate) {
                await onCreate({
                    name: listName,
                    date: noDate ? null : date,
                    privacyLevel: value
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <FormControl sx={{gap: 2}}>
            <Box sx={{mt: 0}}>
                <TextField
                    id="list-name"
                    label="Название списка"
                    variant="standard"
                    value={listName}
                    onChange={handleListNameChange}
                    error={error}
                    helperText={error ? "Название должно быть не короче 3 букв" : ""}
                    inputProps={{minLength: 3}}
                    fullWidth
                />
            </Box>

            <Box sx={{mt: 1}}>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={noDate}
                            onChange={handleNoDateChange}
                            color="primary"
                        />
                    }
                    label="Без даты"
                />
                <BasicDatePicker
                    label="Дата события"
                    value={noDate ? null : date}
                    onChange={handleDateChange}
                    disabled={noDate}
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
                        disabled={isSubmitting || listName.length < 3}
                    >
                        {isSubmitting ? 'Сохранение...' : 'Создать список'}
                    </Button>
                </Box>
            </Box>
        </FormControl>
    );
}