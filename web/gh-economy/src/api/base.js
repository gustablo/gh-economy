import axios from 'axios';
import { store } from '../store';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_ENDPOINT,
    headers: {
        authorization: localStorage.getItem('token'),
        'Content-Type': 'application/json',
    }
});

api.interceptors.response.use(result => {
    return result;
}, error => {
    const message = error.response.data;
    store.commit('setSnackbar', { open: true, text: message, color: 'error' });
    throw error;
});

export { api };
