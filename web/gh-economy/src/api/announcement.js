import { api } from './base';

export const createAnnouncement = async (itemId, quantity, valuePerItem) => {
    const result = await api.post('/announcements', {
        itemId,
        quantity,
        valuePerItem
    });

    return result.data;
};

export const cancelAnnouncement = async (announcementId) => {
    const result = await api.delete(`/announcements/${announcementId}`);

    return result.data;
};
