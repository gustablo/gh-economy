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
    patrimony: number;
}

export class User extends Entity<UserProps> {
}
