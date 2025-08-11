import * as React from 'react';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

const currencies = [
    {
        value: 'RUB',
        label: '₽',
    },
    {
        value: 'USD',
        label: '$',
    },
    {
        value: 'EUR',
        label: '€',
    }
];

export default function SelectTextFields({ onCurrency }) {
    const [selectedCurrency, setSelectedCurrency] = React.useState('RUB');

    const handleCurrencyChange = (event) => {
        const value = event.target.value;
        setSelectedCurrency(value);
        if (onCurrency) {
            onCurrency(value);
        }
    };

    return (
        <TextField
            id="outlined-select-currency"
            select
            label="Валюта"
            value={selectedCurrency}
            onChange={handleCurrencyChange}
            variant="standard"
            sx={{ width: '60px' }}
        >
            {currencies.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                    {option.label}
                </MenuItem>
            ))}
        </TextField>
    );
}