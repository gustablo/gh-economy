import { User } from "../../entities/user";
import { ItemRepository, ItemWithAnnouncements } from "../item-repository";
import { AnnouncementPrismaMapper } from "../mappers/announcement-prisma";
import { ItemPrismaMapper } from "../mappers/item-prisma";
import { prisma } from "./prisma";

export class ItemPrismaRepository implements ItemRepository {

    private mapper = new ItemPrismaMapper();
    private announcementMapper = new AnnouncementPrismaMapper();

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

        const mapped = this.mapper.toModelCollection(items);

        return mapped.map((item, i) => {
            const announcements = items[i].announcements;

            return {
                ...item.props,
                announcements: this.announcementMapper.toModelCollection(announcements).map(an => an.props)
            }
        });
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

        const { props } = this.mapper.toModel(item);

        return {
            ...props,
            announcements: this.announcementMapper.toModelCollection(item.announcements).map(an => an.props),
        }
    }
}
