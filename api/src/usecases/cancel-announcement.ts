import { AnnouncementRepository } from "../repositories/announcement-repository";
import { TransactionRepository } from "../repositories/transaction-repository";
import { decodeToken } from "../shared/utils/decode-token";

export class CancelAnnouncement {
    constructor(
        private announcementRepo: AnnouncementRepository,
        private transactionRepo: TransactionRepository,
    ) {}

    async exec(announcementId: number, token: string) {
        const user = await decodeToken(token);

        const announcement = await this.announcementRepo.findBy({ id: Number(announcementId) });

        if (!announcement) {
            throw new Error('Announcement not found');
        }

        if (announcement.user.props.id != user.id) {
            throw new Error('You cannot cancel this announcement');
        }

        await this.announcementRepo.update(Number(announcement.id!), { status: 'CLOSE' });

        const otherTransactionsThatNeedToBeCanceled = { status: 'PENDING', announcement_id: Number(announcement.id) };
        const othersTransactionsUpdated = { status: 'CANCELED' };
        await this.transactionRepo.updateMany(otherTransactionsThatNeedToBeCanceled, othersTransactionsUpdated);

        return;
    }
}