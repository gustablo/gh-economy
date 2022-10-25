import { api } from './base';

export const fetchOnlineUsers = async () => {
    const result = await api.get('/users/online');

    return result.data;
}

export const riches = async () => {
    const result = await api.get('/users/riches');

    return result.data;
}
