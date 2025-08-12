import * as React from 'react';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import {green, pink, yellow} from '@mui/material/colors';

export default function ListSelector({ data = [], onSelect }) {
    const [selectedItem, setSelectedItem] = React.useState(null);

    const getPrivacyColor = (privacyLevel, shade = 100) => {
        switch (privacyLevel) {
            case 'PUBLIC': return green[shade];
            case 'PRIVATE': return pink[shade];
            case 'FRIENDS_ONLY': return yellow[shade];
            default: return 'inherit';
        }
    };

    const handleChange = (event, newValue) => {
        setSelectedItem(newValue);
        if (onSelect && newValue) {
            onSelect(newValue.id);
        }
    };

    return (
        <Stack spacing={2} sx={{ width: '100%' }}>
            <Autocomplete
                id="list-selector"
                freeSolo
                disabled={data.length === 0}
                options={data}
                getOptionLabel={(option) =>
                    typeof option === 'string'
                        ? option
                        : option.eventDate
                            ? `${option.name} (${option.eventDate})`
                            : option.name
                }
                onChange={handleChange}
                value={selectedItem}
                getOptionKey={(option) => option.id}
                renderOption={(props, option) => {
                    const bgColor = getPrivacyColor(option.privacyLevel);
                    const hoverColor = getPrivacyColor(option.privacyLevel, 200);

                    return (
                        <Box
                            component="li"
                            key={option.id}
                            {...props}
                            sx={{
                                backgroundColor: bgColor,
                                padding: '8px 16px',
                                margin: '4px 0',
                                borderRadius: '4px',
                                color: 'text.primary',
                                '&.MuiAutocomplete-option[aria-selected="true"]': {
                                    backgroundColor: hoverColor,
                                    fontWeight: 'bold'
                                },
                                '&.MuiAutocomplete-option:hover:not(.Mui-focused)': {
                                    backgroundColor: hoverColor,
                                },
                                '&.MuiAutocomplete-option.Mui-focused': {
                                    backgroundColor: hoverColor,
                                }
                            }}
                        >
                            {option.eventDate ? `${option.name} (${option.eventDate})` : option.name}
                        </Box>
                    );
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Выберите список для подарка"
                    />
                )}
            />
        </Stack>
    );
}