import { Socket } from "socket.io";
import { Transaction } from "../entities/transaction";
import { User, UserProps } from "../entities/user";
import { AnnouncementRepository } from "../repositories/announcement-repository";
import { ItemRepository } from "../repositories/item-repository";
import { TransactionRepository } from "../repositories/transaction-repository";
import { UserItemRepository } from "../repositories/user-item-repository";
import { UserRepository } from "../repositories/user-repository";
import { WalletRepository } from "../repositories/wallet-repository";
import { decodeToken } from "../shared/utils/decode-token";

export class ConfirmTrade {

    constructor(
        private transactionRepository: TransactionRepository,
        private walletRepository: WalletRepository,
        private userRepository: UserRepository,
        private announcementRepository: AnnouncementRepository,
        private itemRepository: ItemRepository,
        private userItemRepo: UserItemRepository,
    ) {} 

    async exec(transactionId: string, decision: 'ACCEPT' | 'DECLINE', token: string, io: Socket) {
        if (decision !== 'ACCEPT' && decision !== 'DECLINE') {
            throw new Error('Invalid decision');
        }

        const transaction = await this.transactionRepository.findBy({ id: transactionId });

        if (!transaction?.id) throw new Error('Transaction not found');

        if (decision == 'DECLINE') {
            const updated = await this.transactionRepository.update(transactionId, { status: 'CANCELED' });

            return updated;
        }

        const loggedUser = await decodeToken(token);

        const userFrom = await this.userRepository.findBy({ wallet_id: transaction.to.props.id })

        if (userFrom!.id != loggedUser.id) {
            throw new Error('You do not have permission to confirm this trade');
        }

        const newTransaction = new Transaction(transaction);

        newTransaction.trade();

        const { announcement: { props: announcement } } = transaction;

        const newAnnouncementAvailable = announcement.quantityAvailable - transaction.quantityItemsAsked;

        if (newAnnouncementAvailable < 0) throw new Error('Quantity not enough');

        await this.announcementRepository.update(announcement.id!, {
            quantityAvailable: newAnnouncementAvailable,
            status: newAnnouncementAvailable == 0 ? 'CANCELED' : 'OPEN'
        });

        const { from: { props: from }, to: { props: to } } = newTransaction.props;

        const userToReceiveItems = await this.userRepository.findBy({ wallet_id: transaction.from.props.id });

        await this.itemRepository.addItems(
            userToReceiveItems!.id!,
            announcement.item.props.id!,
            transaction.quantityItemsAsked,
            transaction.amount,
        );

        await this.userItemRepo.deleteItem(Number(userFrom?.id), announcement.item.props.id!);

        await this.walletRepository.update(from.id!, from.balance);
        await this.walletRepository.update(to.id!, to.balance);

        this.updateUserWalletRealTime(userToReceiveItems!, from.balance, io);
        this.updateUserWalletRealTime(userFrom!, to.balance, io);

        const updatedTransaction = await this.transactionRepository.update(newTransaction.props.id!, { status: 'CONFIRMED' });
        
        const otherTransactionsThatNeedToBeUpdated = { status: 'PENDING', announcement_id: Number(announcement.id) };
        const othersTransactionsUpdated = { status: 'CANCELED' };
        await this.transactionRepository.updateMany(otherTransactionsThatNeedToBeUpdated, othersTransactionsUpdated);

        return updatedTransaction;
    }
    
    updateUserWalletRealTime(user: UserProps, balance: number, io: Socket) {
        if (user.status == 'ONLINE') {
            io.to(user.socketId!).emit('update_wallet', balance);
        }
    }
}
