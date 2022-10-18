import { AnnouncementRepository } from "../repositories/announcement-repository";
import { TransactionRepository } from "../repositories/transaction-repository";
import { UserItemRepository } from "../repositories/user-item-repository";
import { decodeToken } from "../shared/utils/decode-token";

export class CancelAnnouncement {
    constructor(
        private announcementRepo: AnnouncementRepository,
        private transactionRepo: TransactionRepository,
        private userItemRepo: UserItemRepository,
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

        await this.announcementRepo.update(Number(announcement.id!), { status: 'CLOSE', quantityAvailable: 0 });

        await this.userItemRepo.updateQuantity(Number(announcement.user.props.id!), announcement.item.props.id!, 1);

        const otherTransactionsThatNeedToBeCanceled = { status: 'PENDING', announcement_id: Number(announcement.id) };
        const othersTransactionsUpdated = { status: 'CANCELED' };
        await this.transactionRepo.updateMany(otherTransactionsThatNeedToBeCanceled, othersTransactionsUpdated);

        return;
    }
}