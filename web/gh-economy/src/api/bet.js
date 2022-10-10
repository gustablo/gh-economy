import { api } from './base';

export const bet = async (type, amount, options) => {
    const result = await api.post('/bets', { type, amount, options });

    return result.data;
};
