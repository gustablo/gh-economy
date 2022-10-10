import { ItemRepository } from "../repositories/item-repository";

export class GetItemAnnouncements {
    constructor(
        private itemRepository: ItemRepository,
    ) {}

    async exec(id: number) {
        const item = await this.itemRepository.findBy({ id });

        if (!item) {
            throw new Error('Item not found');
        }

        return item;
    }
};
