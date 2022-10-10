import { CreateAnnouncementRequestDTO } from "../dtos/create-announcement";
import { Announcement } from "../entities/announcement";
import { Item } from "../entities/item";
import { User } from "../entities/user";
import { AnnouncementRepository } from "../repositories/announcement-repository";
import { UserItemRepository } from "../repositories/user-item-repository";
import { decodeToken } from "../shared/utils/decode-token";

export class CreateAnnouncement {

    constructor(
        private announcementRepository: AnnouncementRepository,
        private userItemRepository: UserItemRepository
    ) {}

    async exec(request: CreateAnnouncementRequestDTO, token: string) {
        if (request.valuePerItem < 0) {
            throw new Error('Amount must be greather or equal 0');
        }

        const userDecoded = await decodeToken(token);

        const userItem = await this.userItemRepository.findBy({ user_id: Number(userDecoded.id), item_id: request.itemId });
        if (!userItem) {
            throw new Error('User does not have this item');
        }
        
        if (request.quantity > userItem.quantity) {
            throw new Error('Quantity insuficcient');
        }

        await this.userItemRepository.removeItems(
            userItem.userId,
            userItem.itemId,
            request.quantity,
        );

        const announcement = new Announcement({
            item: new Item({ id: userItem.itemId }),
            user: new User({ id: userItem.userId.toString() }),
            status: 'OPEN',
            quantityAvailable: request.quantity,
            valuePerItem: request.valuePerItem,
        });

        const created = await this.announcementRepository.create(announcement.props);

        return created;
    }
}
