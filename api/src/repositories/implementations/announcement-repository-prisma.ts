import { AnnouncementProps } from "../../entities/announcement";
import { Item } from "../../entities/item";
import { User } from "../../entities/user";
import { Wallet } from "../../entities/wallet";
import { AnnouncementRepository } from "../announcement-repository";
import { prisma } from "./prisma";

export class AnnouncementPrismaRepository implements AnnouncementRepository {
    async create(announcement: AnnouncementProps): Promise<AnnouncementProps> {
        const created = await prisma.announcement.create({
            data: {
                quantity_available: announcement.quantityAvailable,
                status: announcement.status,
                value_per_item: announcement.valuePerItem,
                user_id: Number(announcement.user.props.id!),
                item_id: announcement.item.props.id!,
            }
        });

        return {
            id: created.id,
            quantityAvailable: created.quantity_available,
            status: created.status,
            valuePerItem: Number(created.value_per_item),
            item: new Item({ id: created.item_id }),
            user: new User({ id: created.user_id.toString() }),
        }
    }

    async update(id: number, data: Partial<AnnouncementProps>): Promise<void> {
        await prisma.announcement.update({
            where: {
                id
            },
            data: {
                quantity_available: data.quantityAvailable,
                status: data.status,
            }
        });
    }

    async findBy(conditions: any): Promise<AnnouncementProps | null> {
        const announcement = await prisma.announcement.findFirst({
            include: {
                item: true,
                user: {
                    include: {
                        wallet: true,
                    }
                },
            },
            where: conditions,
        });

        if (!announcement) return null;

        const { user, item } = announcement;
        const { wallet } = user;

        return {
            id: announcement.id,
            status: announcement.status,
            quantityAvailable: announcement.quantity_available,
            valuePerItem: Number(announcement.value_per_item),
            item: new Item({ id: item.id, imageUrl: item.image_url, name: item.name }),
            user: new User({
                id: user.id.toString(),
                name: user.name,
                role: user.role,
                wallet: new Wallet({ id: wallet.id.toString(), balance: Number(wallet.balance) })
            }),
        }
    }

}