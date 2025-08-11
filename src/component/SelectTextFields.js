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

export default function SelectTextFields() {
    return (
        <TextField
            id="outlined-select-currency"
            select
            label="Валюта"
            defaultValue="RUB"
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