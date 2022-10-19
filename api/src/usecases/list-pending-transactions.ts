import { TransactionRepository } from "../repositories/transaction-repository";
import { decodeToken } from "../shared/utils/decode-token";

export class ListPendingTransactions {
    constructor(
        private transactionRepository: TransactionRepository,
    ) {}

    async exec(token: string, query: { announcementId: string }) {
        const user = await decodeToken(token);

        return this.transactionRepository.list({ status: 'PENDING', to_id: user.id, announcement_id: Number(query.announcementId) });
    }
}
