import { User } from "../entities/user";
import { ItemRepository, ItemWithAnnouncements } from "../repositories/item-repository";
import { decodeToken } from "../shared/utils/decode-token";

export class ListItems {
    constructor(
        private itemRepository: ItemRepository,
    ) {}

    async exec(token?: string) {
        let excludeUser = new User();

        if (token) {
            const user = await decodeToken(token);
            excludeUser = new User({ id: user.id, name: user.name })
        }

        const items = await this.itemRepository.listAnnouncedItems(excludeUser);

        return items.filter(item => item?.announcements?.length);
    }
}
