import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Diversity3OutlinedIcon from '@mui/icons-material/Diversity3Outlined';
import {Box} from "@mui/material";

export default function OthersFriendsPageMenu({onItemMenu}) {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
        onItemMenu(newValue);
    };

    return (
        <Tabs
            value={value}
            onChange={handleChange}
            aria-label="friends page menu"
            sx={{
                padding: 0,
                minHeight: '48px',
                '& .MuiTabs-flexContainer': {
                    gap: '2px',
                },
                '& .MuiTab-root': {
                    minHeight: '48px',
                    padding: '6px 4px',
                    minWidth: 'auto',
                    margin: 0,
                    fontSize: {
                        xs: '0.75rem',
                        sm: '0.75rem',
                        md: '0.875rem'
                    }
                }
            }}
        >
            <Tab
                icon={<Diversity3OutlinedIcon sx={{fontSize: '24px'}}/>}
                iconPosition="start"
                label={value === 0 ? "Друзья" : <Box sx={{display: {xs: 'none', sm: 'inline'}}}>Друзья</Box>}
            />
            {/*<Tab*/}
            {/*    icon={<TurnedInNotOutlinedIcon sx={{fontSize: '24px'}}/>}*/}
            {/*    iconPosition="start"*/}
            {/*    label={value === 1 ? "Подписки" : <Box sx={{display: {xs: 'none', sm: 'inline'}}}>Подписки</Box>}*/}
            {/*/>*/}
        </Tabs>
    );
}
