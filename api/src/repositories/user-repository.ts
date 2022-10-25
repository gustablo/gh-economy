import { User, UserProps } from "../entities/user";

export interface UserRepository {
    create(user: Omit<UserProps, 'wallet'>, walletId: string): Promise<UserProps>;
    findBy(conditions: any): Promise<UserProps | null>;
    update(user: Partial<UserProps>, userId: number): Promise<void>;
    updateBySocketId(user: Partial<UserProps>, socketId: string): Promise<void>;
    listOnline(userId: number): Promise<User[]>;
    listRiches(): Promise<User[]>;
}
