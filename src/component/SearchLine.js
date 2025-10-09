import {Fragment, useCallback, useEffect, useState} from 'react';
import {
    Avatar,
    Box,
    CircularProgress,
    Divider,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    TextField,
    Typography, useMediaQuery, useTheme
} from '@mui/material';
import {httpClient} from '../http/HttpClient';
import {useNavigate} from "react-router-dom";

function SearchLine() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openResults, setOpenResults] = useState(false);
    const navigate = useNavigate();
    const debouncedSearch = useCallback(debounce(async (term) => {
        if (term.length >= 3) {
            try {
                setLoading(true);
                const response = await httpClient.get(`/profiles/search?query=${term}`);
                setResults(response.data);
                setOpenResults(true);
            } catch (error) {
                console.error('Search error:', error);
                setResults([]);
            } finally {
                setLoading(false);
            }
        } else {
            setResults([]);
            setOpenResults(false);
        }
    }, 500), []);

    useEffect(() => {
        debouncedSearch(searchTerm);
    }, [searchTerm, debouncedSearch]);

    const handleCardClick = (userId) => {
        navigate(`/users/${userId}`);
        setOpenResults(false);
    };

    return (
        <Box sx={{position: 'relative', width: '100%'}}>
            <TextField
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                id="standard-search"
                label= {isMobile ? "Поиск ..." : "Поиск друзей ..."}
                type="search"
                variant="standard"
                fullWidth
                size="small"
                sx={{
                    '& .MuiInput-underline:after': {borderBottomColor: '#616161'},
                    '& .MuiInput-underline:before': {borderBottomColor: '#E0E0E0'},
                    '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                        borderBottomColor: '#9E9E9E',
                    },
                    '& .MuiInputBase-input': {color: '#212121'},
                    '& .MuiInputLabel-root': {color: '#616161'},
                    '& .MuiInputLabel-root.Mui-focused': {color: '#424242'},
                }}
            />

            {openResults && (
                <Box sx={{
                    position: 'absolute',
                    width: {xs: '175%', sm: '100%'},
                    maxHeight: 500,
                    overflow: 'auto',
                    backgroundColor: 'background.paper',
                    boxShadow: 3,
                    zIndex: 1,
                    mt: 1,
                    borderRadius: 1
                }}>
                    {loading ? (
                        <Box sx={{display: 'flex', justifyContent: 'center', p: 2}}>
                            <CircularProgress size={24}/>
                        </Box>
                    ) : results.length > 0 ? (
                        <List dense>
                            {results.map((user) => (
                                <Fragment key={user.id}>
                                    <ListItem
                                        onClick={() => handleCardClick(user.id)}
                                        sx={{
                                            cursor: 'pointer',
                                            '&:hover': {
                                                backgroundColor: 'action.hover'
                                            }
                                        }}
                                    >
                                        <ListItemAvatar>
                                            <Avatar>
                                                {user.fullName.charAt(0)}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={
                                                <Typography
                                                    sx={{
                                                        fontSize: {xs: '0.75rem', sm: '1rem'}
                                                    }}
                                                >
                                                    {user.fullName}
                                                </Typography>
                                            }
                                            secondary={
                                                <Typography
                                                    sx={{
                                                        fontSize: {xs: '0.65rem', sm: '0.875rem'}
                                                    }}
                                                >
                                                    {user.privacyLevel === 'PRIVATE' ? 'Приватный' :
                                                        user.privacyLevel === 'PUBLIC' ? 'Публичный' : 'Только друзья'}
                                                </Typography>
                                            }
                                        />
                                    </ListItem>
                                    <Divider component="li"/>
                                </Fragment>
                            ))}
                        </List>
                    ) : (
                        <Box sx={{p: 2, textAlign: 'center'}}>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    fontSize: {xs: '0.65rem', sm: '0.875rem'}
                                }}
                            >
                                Ничего не найдено
                            </Typography>
                        </Box>
                    )}
                </Box>
            )}
        </Box>
    );
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

export default SearchLine;