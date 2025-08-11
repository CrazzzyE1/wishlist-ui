import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';

export default function ControlledDatePicker() {
    const [value, setValue] = React.useState(dayjs());

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
            <DatePicker
                label="Дата события"
                value={value}
                onChange={(newValue) => setValue(newValue)}
                format="DD MMMM YYYY"
            />
        </LocalizationProvider>
    );
}