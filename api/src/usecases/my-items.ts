import { UserItemRepository } from "../repositories/user-item-repository";
import { decodeToken } from "../shared/utils/decode-token";

export class MyItems {
    constructor(
        private userItemRepo: UserItemRepository,
    ) {}
    
    async exec(token: string) {
        const user = await decodeToken(token);

        return await this.userItemRepo.listMyItems(Number(user.id));
    }
}
