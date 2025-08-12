import * as React from 'react';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import {green, pink, yellow} from '@mui/material/colors';

export default function ListSelector({ data = [], onSelect }) {
    const [selectedItem, setSelectedItem] = React.useState(null);

    const getPrivacyColor = (privacyLevel) => {
        switch (privacyLevel) {
            case 'PUBLIC': return green[100];
            case 'PRIVATE': return pink[100];
            case 'FRIENDS_ONLY': return yellow[100];
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
                    typeof option === 'string' ? option : `${option.name} (${option.eventDate})`
                }
                onChange={handleChange}
                value={selectedItem}
                getOptionKey={(option) => option.id}
                renderOption={(props, option) => (
                    <Box
                        component="li"
                        key={option.id}
                        {...props}
                        sx={{
                            backgroundColor: getPrivacyColor(option.privacyLevel),
                            padding: '8px 16px',
                            margin: '4px 0',
                            borderRadius: '4px',
                            '&:hover': {
                                backgroundColor: getPrivacyColor(option.privacyLevel),
                                opacity: 0.8
                            }
                        }}
                    >
                        {option.name} ({option.eventDate})
                    </Box>
                )}
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