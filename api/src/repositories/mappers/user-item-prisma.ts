import { item, user, user_items, wallet } from "@prisma/client";
import { UserItem } from "../../entities/user-item";
import { BaseMapper } from "./base";
import { ItemPrismaMapper } from "./item-prisma";
import { UserPrismaMapper } from "./user-prisma";

type Database = user_items & { item?: item, user?: user & { wallet?: wallet, user_items: (user_items & { item: item})[] } | null };

export class UserItemPrismaMapper extends BaseMapper<UserItem> {
    toModel(database: Database): UserItem {
        if (!database) return new UserItem();

        return new UserItem({
            id: database.id,
            buyedPer: Number(database.buyed_per),
            itemId: Number(database.item_id),
            userId: Number(database.user_id),
            quantity: database.quantity,
            item: new ItemPrismaMapper().toModel(database.item!),
            user: new UserPrismaMapper().toModel(database.user!),
        });
    }

}
