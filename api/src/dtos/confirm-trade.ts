export type ConfirmTradeRequestDTO = {
    transactionId: string;
    decision: 'DECLINE' | 'ACCEPT';
};
