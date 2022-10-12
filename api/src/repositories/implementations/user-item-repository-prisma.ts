import { Item } from "../../entities/item";
import { UserItem, UserItemProps } from "../../entities/user-item";
import { UserItemRepository } from "../user-item-repository";
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

    async listMyItems(userId: number): Promise<UserItem[]> {
        const items = await prisma.user_items.findMany({
            include: {
                item: true,
            },
            where: {
                user_id: userId,
                quantity: {
                    gt: 0,
                }
            }
        });

        return items.map(({ quantity, item, buyed_per }) => (new UserItem({
            quantity,
            item: new Item({
                id: item.id,
                imageUrl: item.image_url,
                name: item.name,
                yield: Number(item.yield),
                rarity: item.rarity,
            }),
            buyedPer: Number(buyed_per)
        })))
    }

}