import { announcement, item, user, user_items, wallet } from "@prisma/client";
import { Announcement } from "../../entities/announcement";
import { BaseMapper } from "./base";
import { ItemPrismaMapper } from "./item-prisma";
import { UserPrismaMapper } from "./user-prisma";

type Database = announcement & { user?: user & { wallet?: wallet, user_items?: (user_items & { item?: item})[] }}  & { item?: item }

export class AnnouncementPrismaMapper extends BaseMapper<Announcement> {
    
    toModel(database: Database): Announcement {
        if (!database) return new Announcement();

        return new Announcement({
            id: database.id,
            quantityAvailable: database.quantity_available,
            status: database.status,
            valuePerItem: Number(database.value_per_item),
            item: new ItemPrismaMapper().toModel(database.item!),
            user: new UserPrismaMapper().toModel(database.user!),
        });
    }
}
