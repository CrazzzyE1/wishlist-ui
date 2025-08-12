import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Diversity3OutlinedIcon from '@mui/icons-material/Diversity3Outlined';
import OutputOutlinedIcon from '@mui/icons-material/OutputOutlined';
import InputOutlinedIcon from '@mui/icons-material/InputOutlined';

export default function FriendsPageMenu({onItemMenu}) {
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
            <Tab icon={<Diversity3OutlinedIcon sx={{fontSize: '24px'}}/>} iconPosition="start" label="Друзья"/>
            <Tab icon={<InputOutlinedIcon sx={{fontSize: '24px'}}/>} iconPosition="start" label="Входящие заявки"/>
            <Tab icon={<OutputOutlinedIcon sx={{fontSize: '24px'}}/>} iconPosition="start" label="Исходящие заявки"/>
        </Tabs>
    );
}
