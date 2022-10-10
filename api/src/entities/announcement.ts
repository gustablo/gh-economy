import { Entity } from "./base";
import { Item } from "./item";
import { User } from "./user";

export interface AnnouncementProps {
    readonly id?: number;
    user: User;
    item: Item;
    status: 'OPEN' | 'CLOSE' | string;
    quantityAvailable: number;
    valuePerItem: number;
}

export class Announcement extends Entity<AnnouncementProps> {

}
