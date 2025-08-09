import {TextField} from "@mui/material";

function SearchLine() {
    return (
        <TextField
            id="standard-search"
            label="Поиск друзей ..."
            type="search"
            variant="standard"
            fullWidth
            size="small"  // Меньший размер
            sx={{
                // Цвета для разных состояний
                '& .MuiInput-underline:after': {
                    borderBottomColor: '#616161',  // Темно-серый при фокусе
                },
                '& .MuiInput-underline:before': {
                    borderBottomColor: '#E0E0E0',  // Светло-серый в обычном состоянии
                },
                '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                    borderBottomColor: '#9E9E9E',  // Серый при наведении
                },
                // Цвет текста
                '& .MuiInputBase-input': {
                    // fontSize: '14px',
                    // padding: '6px 0',
                    color: '#212121',  // Темный текст
                },
                // Цвет лейбла
                '& .MuiInputLabel-root': {
                    color: '#616161',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                    color: '#424242',  // Темнее при фокусе
                },
            }}
        />
    );
}

export default SearchLine;