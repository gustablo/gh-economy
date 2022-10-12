import axios from 'axios';

const api = axios.create({
    baseURL: 'https://gh-economy-api.vercel.app',
    headers: {
        authorization: localStorage.getItem('token'),
        'Content-Type': 'application/json',
    }
});

api.interceptors.response.use(result => {
    return result;
}, error => {
    const message = error.response.data;
    alert(message);
    throw error;
});

export { api };
