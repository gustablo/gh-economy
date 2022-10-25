import { Item } from "../../entities/item";
import { UserItem, UserItemProps } from "../../entities/user-item";
import { UserItemPrismaMapper } from "../mappers/user-item-prisma";
import { MyItems, UserItemRepository } from "../user-item-repository";
import { prisma } from "./prisma";

export class UserItemPrismaRepository implements UserItemRepository {

    private mapper = new UserItemPrismaMapper();

    async findBy(conditions: any): Promise<UserItemProps | null> {
        const userItem = await prisma.user_items.findFirst({ where: conditions });

        if (!userItem) return null;

        return this.mapper.toModel(userItem).props;
    }

    async removeItems(userId: number, itemId: number, quantityToRemove: number): Promise<void> {
        const userItem = await this.findBy({ user_id: userId, item_id: itemId });

        if (userItem) {
            await prisma.user_items.update({
                where: {
                    id: userItem.id,
                },
                data: {
                    quantity: userItem.quantity - quantityToRemove,
                }
            });
        }
    }

    async deleteItem(userId: number, itemId: number): Promise<void> {
        await prisma.user_items.deleteMany({
            where: {
                user_id: userId,
                item_id: itemId
            }
        })
    }

    async updateQuantity(userId: number, itemId: number, newQuantity: number): Promise<void> {
        await prisma.user_items.updateMany({
            where: {
                user_id: userId,
                item_id: itemId,
            },
            data: {
                quantity: newQuantity,
            }
        })
    }

    async listMyItems(userId: number): Promise<MyItems[]> {
        const items = await prisma.user_items.findMany({
            include: {
                item: {
                    include: {
                        announcements: {
                            where: {
                                user_id: userId,
                                status: 'OPEN',
                            },
                            include: {
                                transactions: {
                                    where: {
                                        status: 'PENDING',
                                    }
                                }
                            }
                        },
                    }
                },
            },
            where: {
                user_id: userId,
            },
            orderBy: {
                id: 'desc'
            }
        });

        return items.map(({ quantity, item, buyed_per }) => {
            const userItem = new UserItem({
                quantity,
                item: new Item({
                    id: item.id,
                    imageUrl: item.image_url,
                    name: item.name,
                    yield: Number(item.yield),
                    rarity: item.rarity,
                }),
                buyedPer: Number(buyed_per),
            });

            const announcement = item.announcements[0];
            const pendingTradesCount = announcement ? announcement.transactions?.length : 0;

            return { ...userItem.props, announcementId: announcement?.id, announcementPrice: Number(announcement?.value_per_item), pendingTradesCount };
        })
    }

}