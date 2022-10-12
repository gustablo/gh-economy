import { Announcement } from "../../entities/announcement";
import { Item } from "../../entities/item";
import { User } from "../../entities/user";
import { ItemRepository, ItemWithAnnouncements } from "../item-repository";
import { prisma } from "./prisma";

export class ItemPrismaRepository implements ItemRepository {
    async addItems(userId: string, itemId: number, quantityItemsAsked: number, buyedPer: number): Promise<void> {
        const userItem = await prisma.user_items.findFirst({
            where: {
                user_id: Number(userId),
                item_id: itemId,
            }
        });

        if (userItem) {
            await prisma.user_items.update({
                where: { id: userItem.id },
                data: {
                    quantity: userItem.quantity + quantityItemsAsked,
                    buyed_per: buyedPer,
                }
            });

            return;
        }

        await prisma.user_items.create({
            data: {
                item_id: itemId,
                user_id: Number(userId),
                quantity: quantityItemsAsked,
                buyed_per: buyedPer,
            }
        });
    }

    async listAnnouncedItems(excludedUser?: User): Promise<ItemWithAnnouncements[]> {
        const items = await prisma.item.findMany({
            include: {
                announcements: {
                    where: {
                        user_id: {
                            not: excludedUser?.props.id ? Number(excludedUser.props.id) : undefined,
                        },
                        status: 'OPEN',
                        quantity_available: {
                            gt: 0
                        }
                    }
                },
            },
            where: {
                announcements: {
                    some: {
                        status: 'OPEN',
                        quantity_available: {
                            gt: 0
                        }
                    }
                }
            }
        });

        return items.map(item => ({
            id: item.id,
            imageUrl: item.image_url,
            name: item.name,
            announcements: item.announcements.map(announcement => {
                const instance = new Announcement({
                    id: announcement.id,
                    quantityAvailable: announcement.quantity_available,
                    status: announcement.status,
                    valuePerItem: Number(announcement.value_per_item),
                    user: new User({ id: announcement.user_id.toString() })
                });

                return instance.props;
            })
        }));
    }

    async findBy(conditions: any): Promise<ItemWithAnnouncements | null> {
        const item = await prisma.item.findFirst({
            include: {
                announcements: {
                    include: {
                        user: true,
                    },
                    orderBy: {
                        value_per_item: 'asc',
                    },
                    where: {
                        status: 'OPEN',
                        quantity_available: {
                            gt: 0,
                        }
                    }
                },
            },
            where: conditions
        });

        if (!item) return null;

        return {
            id: item.id,
            name: item.name,
            imageUrl: item.image_url,
            announcements: item.announcements.map(announcement => ({
                id: announcement.id,
                status: announcement.status,
                quantityAvailable: announcement.quantity_available,
                valuePerItem: Number(announcement.value_per_item),
                item: new Item({ id: item.id }),
                user: new User({
                    id: announcement.user.id.toString(),
                    name: announcement.user.name,
                    role: announcement.user.role,
                }),
            }))
        }
    }
}