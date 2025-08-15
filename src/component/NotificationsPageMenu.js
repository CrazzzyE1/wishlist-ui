import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import MarkunreadOutlinedIcon from '@mui/icons-material/MarkunreadOutlined';
import MarkAsUnreadOutlinedIcon from '@mui/icons-material/MarkAsUnreadOutlined';

export default function NotificationsPageMenu({onItemMenu}) {
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
        >
            <Tab icon={<MarkunreadOutlinedIcon sx={{fontSize: '24px'}}/>} iconPosition="start" label="Не прочитанные"/>
            <Tab icon={<MarkAsUnreadOutlinedIcon sx={{fontSize: '24px'}}/>} iconPosition="start" label="Все сообщения"/>
        </Tabs>
    );
}
