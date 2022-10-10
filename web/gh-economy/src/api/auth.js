import { api } from './base';

export const sigin = async (name, password) => {
    const result = await api.post('/sign-in', { name, password });

    return result.data;
};

export const current = async () => {
    const result = await api.get('/current');

    return result.data;
};
