import { Announcement, AnnouncementProps } from "../entities/announcement";
import { ItemProps } from "../entities/item";
import { User } from "../entities/user";

export type ItemWithAnnouncements = ItemProps & { announcements: AnnouncementProps[] }

export interface ItemRepository {
    addItems(userId: string, itemId: number, quantityItemsAsked: number): Promise<void>;
    listAnnouncedItems(excludedUser?: User): Promise<ItemWithAnnouncements[]>;
    findBy(conditions: any): Promise<ItemWithAnnouncements | null>;
}
