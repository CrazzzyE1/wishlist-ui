import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { useState, useEffect } from "react";

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

export default function CurrencySelect({ onCurrency, currency }) {
    const [selectedCurrency, setSelectedCurrency] = useState(currency || 'RUB');

    useEffect(() => {
        if (currency) {
            setSelectedCurrency(currency);
        }
    }, [currency]);

    const handleCurrencyChange = (event) => {
        const value = event.target.value;
        setSelectedCurrency(value);
        onCurrency?.(value);
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