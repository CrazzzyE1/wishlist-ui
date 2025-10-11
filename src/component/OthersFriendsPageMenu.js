import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Diversity3OutlinedIcon from '@mui/icons-material/Diversity3Outlined';
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";

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
                    padding: '6px 8px',
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
                label="Друзья"
            />
            <Tab
                icon={<AutoAwesomeOutlinedIcon sx={{fontSize: '24px'}}/>}
                iconPosition="start"
                label="Подписчики"
            />
        </Tabs>
    );
}
