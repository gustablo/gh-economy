import { Entity } from "./base";
import { Item } from "./item";
import { User } from "./user";

export interface UserItemProps {
    readonly id?: number;
    userId: number;
    itemId: number;
    quantity: number;
    buyedPer: number;

    item?: Item;
    user?: User;
}

export class UserItem extends Entity<UserItemProps> {
}
