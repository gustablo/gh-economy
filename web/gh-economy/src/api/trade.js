import { api } from './base';

export const ask = async (announcementId, quantityItemsAsked, proposal) => {
    const response = await api.post('/trades/ask', { announcementId, quantityItemsAsked, proposal });

    return response.data;
};

export const confirm = async (transactionId, decision) => {
    const response = await api.post('/trades/confirm', { transactionId, decision });

    return response.data;
};

export const pendingTrades = async (announcementId) => {
    const response = await api.get('/trades/pending', {
        params: {
            announcementId,
        }
    });

    return response.data;
};
