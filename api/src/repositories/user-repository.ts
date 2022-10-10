import { UserProps } from "../entities/user";

export interface UserRepository {
    create(user: Omit<UserProps, 'wallet'>, walletId: string): Promise<UserProps>;
    findBy(conditions: any): Promise<UserProps | null>;
}
