import { api } from './base';

export const getItems = async () => {

    const items = await api.get('/items/announcements');

    return items.data;
};

export const getItemAnnouncements = async (id) => {
    const item = await api.get(`/items/${id}/announcements`);

    return item.data;
};

export const myItems = async (id) => {
    const items = await api.get('/items/me');

    return items.data;
};
