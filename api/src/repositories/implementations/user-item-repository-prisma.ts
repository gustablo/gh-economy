import { Item } from "../../entities/item";
import { UserItem, UserItemProps } from "../../entities/user-item";
import { MyItems, UserItemRepository } from "../user-item-repository";
import { prisma } from "./prisma";

export class UserItemPrismaRepository implements UserItemRepository {
    async findBy(conditions: any): Promise<UserItemProps | null> {
        const userItem = await prisma.user_items.findFirst({ where: conditions });

        if (!userItem) return null;

        return {
            id: userItem.id,
            itemId: userItem.item_id,
            userId: userItem.user_id,
            quantity: userItem.quantity,
            buyedPer: Number(userItem.buyed_per),
        }
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
                            }
                        }
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

            return { ...userItem.props, announcementId: item.announcements?.length ? item.announcements[0].id : undefined };
        })
    }

}