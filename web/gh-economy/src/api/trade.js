import { api } from './base';

export const ask = async (announcementId, quantityItemsAsked) => {
    const response = await api.post('/trades/ask', { announcementId, quantityItemsAsked });

    return response.data;
};

export const confirm = async (transactionId, decision) => {
    const response = await api.post('/trades/confirm', { transactionId, decision });

    return response.data;
};

export const pendingTrades = async () => {
    const response = await api.get('/trades/pending');

    return response.data;
};
