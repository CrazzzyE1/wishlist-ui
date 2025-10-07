import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Badge from '@mui/material/Badge';
import Diversity3OutlinedIcon from '@mui/icons-material/Diversity3Outlined';
import OutputOutlinedIcon from '@mui/icons-material/OutputOutlined';
import InputOutlinedIcon from '@mui/icons-material/InputOutlined';
import TurnedInNotOutlinedIcon from '@mui/icons-material/TurnedInNotOutlined';
import {Box} from "@mui/material";
import {useNotifications} from "./NotificationsContext";
import {useEffect} from "react";

export default function FriendsPageMenu({onItemMenu}) {
    const [value, setValue] = React.useState(0);
    const {incomingFriendsRequestCount} = useNotifications();

    useEffect(() => {
        if (incomingFriendsRequestCount > 0) {
            setValue(2);
            onItemMenu(2);
        }
    }, []);

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
                    gap: '8px',
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
                label={value === 0 ? "Друзья" : <Box sx={{display: {xs: 'none', sm: 'inline'}}}>Друзья</Box>}
            />
            <Tab
                icon={<TurnedInNotOutlinedIcon sx={{fontSize: '24px'}}/>}
                iconPosition="start"
                label={value === 1 ? "Подписки" : <Box sx={{display: {xs: 'none', sm: 'inline'}}}>Подписки</Box>}
            />
            <Tab
                icon={
                    <Badge badgeContent={incomingFriendsRequestCount} color="success">
                        <InputOutlinedIcon sx={{fontSize: '24px'}} />
                    </Badge>
                }
                iconPosition="start"
                label={value === 2 ? "Входящие" : <Box sx={{display: {xs: 'none', sm: 'inline'}}}>Входящие заявки</Box>}
            />
            <Tab
                icon={<OutputOutlinedIcon sx={{fontSize: '24px'}}/>}
                iconPosition="start"
                label={value === 3 ? "Исходящие" :
                    <Box sx={{display: {xs: 'none', sm: 'inline'}}}>Исходящие заявки</Box>}
            />
        </Tabs>
    );
}
