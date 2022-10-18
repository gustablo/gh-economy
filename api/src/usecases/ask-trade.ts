import { AskTradeRequestDTO } from "../dtos/ask-trade";
import { Announcement } from "../entities/announcement";
import { Transaction } from "../entities/transaction";
import { AnnouncementRepository } from "../repositories/announcement-repository";
import { TransactionRepository } from "../repositories/transaction-repository";
import { UserRepository } from "../repositories/user-repository";
import { decodeToken } from "../shared/utils/decode-token";

export class AskTrade {

    constructor(
        private userRepository: UserRepository,
        private transactionRepository: TransactionRepository,
        private announcementRepository: AnnouncementRepository
    ) { }

    async exec(request: AskTradeRequestDTO, token: string) {
        if (request.quantityItemsAsked <= 0) {
            throw new Error('Quantity asked must be greather than 0');
        }

        if (!request.proposal || request.proposal < 0) {
            throw new Error('Proposal must be greather than 0');
        }

        const loggedUser = await decodeToken(token);

        const fromUser = await this.userRepository.findBy({ id: loggedUser.id });

        if (!fromUser) throw new Error('User not found');


        const announcement = await this.announcementRepository.findBy({ id: request.announcementId });
        if (!announcement) throw new Error('Announcement not found');

        const tradeAlreadyAsked = await this.transactionRepository.findBy({
            status: 'PENDING',
            from: fromUser.wallet,
            to: announcement?.user.props.wallet,
            announcement: new Announcement(announcement)
        });

        if (tradeAlreadyAsked) {
            throw new Error('You already made proposal for this item');
        }

        if (announcement.user.props.id == fromUser.id) {
            throw new Error('Cannot trade with yourself');
        }

        const amount = request.proposal;

        const transaction = new Transaction({
            from: fromUser.wallet,
            to: announcement.user.props.wallet,
            status: 'PENDING',
            quantityItemsAsked: request.quantityItemsAsked,
            amount,
            announcement: new Announcement(announcement),
        });

        transaction.fakeTrade();

        return await this.transactionRepository.create(transaction.props);
    }
}
