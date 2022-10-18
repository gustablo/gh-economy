import { UserItemProps } from "../entities/user-item";

export type MyItems = UserItemProps & { announcementId?: number };

export interface UserItemRepository {
    findBy(conditions: any): Promise<UserItemProps | null>;
    removeItems(userId: number, itemId: number, quantityToRemove: number): Promise<void>;
    listMyItems(userId: number): Promise<MyItems[]>;
}
