import * as React from 'react';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import {deepOrange, green, pink} from '@mui/material/colors';

export default function ListSelector({ data = [], onSelect }) {
    const [selectedItem, setSelectedItem] = React.useState(null);

    const getPrivacyColor = (privacyLevel) => {
        switch (privacyLevel) {
            case 'PUBLIC': return green[500];
            case 'PRIVATE': return pink[500];
            case 'FRIENDS_ONLY': return deepOrange[300];
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
                        sx={{ color: getPrivacyColor(option.privacyLevel) }}
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