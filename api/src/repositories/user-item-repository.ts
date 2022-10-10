import { UserItem, UserItemProps } from "../entities/user-item";

export interface UserItemRepository {
    findBy(conditions: any): Promise<UserItemProps | null>;
    removeItems(userId: number, itemId: number, quantityToRemove: number): Promise<void>;
    listMyItems(userId: number): Promise<UserItem[]>;
}
