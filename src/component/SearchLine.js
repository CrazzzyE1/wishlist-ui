import {TextField} from "@mui/material";

function SearchLine() {
    return (
        <TextField
            id="standard-search"
            label="Поиск друзей ..."
            type="search"
            variant="standard"
            fullWidth
            size="small"
            sx={{

                '& .MuiInput-underline:after': {
                    borderBottomColor: '#616161',
                },
                '& .MuiInput-underline:before': {
                    borderBottomColor: '#E0E0E0',
                },
                '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                    borderBottomColor: '#9E9E9E',
                },

                '& .MuiInputBase-input': {

                    color: '#212121',
                },

                '& .MuiInputLabel-root': {
                    color: '#616161',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                    color: '#424242',
                },
            }}
        />
    );
}

export default SearchLine;