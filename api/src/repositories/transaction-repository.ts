import { TransactionProps } from "../entities/transaction";

export interface TransactionRepository {
    create(transaction: TransactionProps): Promise<Partial<TransactionProps>>;
    findBy(conditions: Partial<TransactionProps>): Promise<TransactionProps | null>;
    update(transactionId: string, transaction: Partial<TransactionProps>): Promise<TransactionProps>;
    list(conditions: any): Promise<Omit<TransactionProps, 'to' | 'from'>[]>;
    updateMany(conditions: any, transaction: Partial<TransactionProps>): Promise<void>;
}
