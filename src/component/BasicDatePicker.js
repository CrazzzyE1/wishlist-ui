import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import 'dayjs/locale/ru';

export default function ControlledDatePicker({ value, onChange, disabled }) {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
            <DatePicker
                label="Дата события"
                value={value}
                onChange={onChange}
                format="DD MMMM YYYY"
                disabled={disabled}
            />
        </LocalizationProvider>
    );
}