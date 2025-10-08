import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Badge from '@mui/material/Badge';
import MarkunreadOutlinedIcon from '@mui/icons-material/MarkunreadOutlined';
import MarkAsUnreadOutlinedIcon from '@mui/icons-material/MarkAsUnreadOutlined';
import {Box} from "@mui/material";
import {useNotifications} from "./NotificationsContext";
import InputOutlinedIcon from "@mui/icons-material/InputOutlined";

export default function NotificationsPageMenu({onItemMenu}) {
    const [value, setValue] = React.useState(0);
    const {unreadCount} = useNotifications();

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
                icon={
                    <Badge badgeContent={unreadCount} color="error">
                        <MarkunreadOutlinedIcon sx={{fontSize: '24px'}}/>
                    </Badge>
                }
                iconPosition="start"
                label={value === 0 ? "Не прочитанные" :
                    <Box sx={{display: {xs: 'none', sm: 'inline'}}}>Не прочитанные</Box>}
            />
            <Tab
                icon={<MarkAsUnreadOutlinedIcon sx={{fontSize: '24px'}}/>}
                iconPosition="start"
                label={value === 1 ? "Все сообщения" :
                    <Box sx={{display: {xs: 'none', sm: 'inline'}}}>Все сообщения</Box>}
            />
        </Tabs>
    );
}
