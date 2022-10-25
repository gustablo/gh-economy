import { item } from "@prisma/client";
import { Item } from "../../entities/item";
import { BaseMapper } from "./base";

export class ItemPrismaMapper extends BaseMapper<Item> {
    toModel(database: item): Item {
        if (!database) return new Item();

        return new Item({
            id: database.id,
            imageUrl: database.image_url,
            name: database.name,
            rarity: database.rarity,
            yield: Number(database.yield)
        });
    }

}
