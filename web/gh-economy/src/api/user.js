import { api } from './base';

export const fetchOnlineUsers = async () => {
    const result = await api.get('/users/online');

    return result.data;
}
