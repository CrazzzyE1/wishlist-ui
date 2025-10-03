import axios from 'axios';

const httpClient = axios.create({
    // baseURL: 'http://192.168.1.141:9000/api/v1/',
    baseURL: 'https://api.wishlisty.ru/api/v1/',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

export { httpClient };