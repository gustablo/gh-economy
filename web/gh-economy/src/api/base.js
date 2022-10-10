import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000',
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
