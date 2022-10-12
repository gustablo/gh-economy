import { Entity } from "./base";
import { UserItem } from "./user-item";
import { Wallet } from "./wallet";

export interface UserProps {
    readonly id?: string;
    name: string;
    password: string;
    role: 'CITIZEN' | 'GOVERNMENT' | string;
    wallet: Wallet | undefined;
    userItems?: UserItem[];
    patrimony?: number;
    status?: 'OFFLINE' | 'ONLINE' | string;
    socketId?: string;
    avatarUrl?: string;
}

export class User extends Entity<UserProps> {
}
