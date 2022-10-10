import { Announcement } from "../../entities/announcement";
import { Item } from "../../entities/item";
import { TransactionProps } from "../../entities/transaction";
import { User, UserProps } from "../../entities/user";
import { Wallet } from "../../entities/wallet";
import { TransactionRepository } from "../transaction-repository";
import { prisma } from "./prisma";

export class TransactionPrismaRepository implements TransactionRepository {
    async create(transaction: TransactionProps): Promise<Partial<TransactionProps>> {
        const created = await prisma.transaction.create({
            data: {
                amount: transaction.amount,
                status: transaction.status,
                to_id: Number(transaction.to.props.id),
                from_id: Number(transaction.from.props.id),
                announcement_id: transaction.announcement.props.id!,
                quantity_items_asked: transaction.quantityItemsAsked,
            }
        });

        return {
            id: created.id?.toString(),
            status: created.status,
            amount: Number(created.amount.toString()),
        }
    }

    async findBy(conditions: Partial<TransactionProps>): Promise<TransactionProps | null> {
        const transaction = await prisma.transaction.findFirst({
            include: {
                from: true,
                to: true,
                announcement: true,
            },
            where: { id: Number(conditions.id) }
        });

        if (!transaction) return null;

        const { to, from, announcement } = transaction;

        return {
            id: transaction.id.toString(),
            amount: Number(transaction.amount.toString()),
            status: transaction.status,
            quantityItemsAsked: transaction.quantity_items_asked,
            to: new Wallet({ id: to.id.toString(), balance: parseFloat(to.balance.toString()) }),
            from: new Wallet({ id: from.id.toString(), balance: parseFloat(from.balance.toString()) }),
            announcement: new Announcement({
                id: announcement.id,
                quantityAvailable: announcement.quantity_available,
                status: announcement.status,
                valuePerItem: Number(announcement.value_per_item.toString),
                item: new Item({ id: announcement.item_id }),
                user: new User({ id: announcement.user_id.toString() }),
            }),
        }
    }

    async update(transactionId: string, transaction: Partial<TransactionProps>): Promise<TransactionProps> {
        const updated = await prisma.transaction.update({
            include: {
                to: true,
                from: true,
                announcement: true,
            },
            data: {
                status: transaction.status,
            },
            where: { id: Number(transactionId) }
        });

        const { to, from, announcement } = updated;

        return {
            status: updated.status,
            amount: Number(updated.amount.toString()),
            id: updated.id.toString(),
            quantityItemsAsked: updated.quantity_items_asked,
            to: new Wallet({ id: to.id.toString(), balance: parseFloat(to.balance.toString()) }),
            from: new Wallet({ id: from.id.toString(), balance: parseFloat(from.balance.toString()) }),
            announcement: new Announcement({
                id: announcement.id,
                quantityAvailable: announcement.quantity_available,
                status: announcement.status,
                valuePerItem: Number(announcement.value_per_item.toString),
                item: new Item({ id: announcement.item_id }),
                user: new User({ id: announcement.user_id.toString() }),
            }),
        }
    }

    async list(conditions: any): Promise<Omit<TransactionProps, 'to' | 'from'>[]> {
        const transactions = await prisma.transaction.findMany({
            include: {
                announcement: {
                    include: {
                        item: true,
                    }
                },
                from: {
                    include: {
                        user: true
                    }
                },
            },
            where: {
                ...conditions,
                to_id: conditions.to_id ? Number(conditions.to_id) : undefined
            },
        });

        return transactions.map(transaction => {
            const [user] = transaction.from.user;
            const { announcement: { item } } = transaction;

            return {
                id: transaction.id.toString(),
                amount: Number(transaction.amount),
                quantityItemsAsked: transaction.quantity_items_asked,
                status: transaction.status,
                announcement: new Announcement({
                    id: transaction.announcement_id,
                    item: new Item({ id: item.id, imageUrl: item.image_url, name: item.name })
                }),
                fromUser: new User({
                    name: user.name,
                }),
            }
        });
    }

}
