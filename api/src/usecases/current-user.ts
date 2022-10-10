import { UserRepository } from "../repositories/user-repository";
import { decodeToken } from "../shared/utils/decode-token";

export class CurrentUser {
    constructor(
        private userRepo: UserRepository
    ) {}

    async exec(token: string) {
        const decoded = await decodeToken(token);

        const user = await this.userRepo.findBy({ id: decoded.id });

        if (!user?.id) {
            throw new Error('User not found');
        }

        return user;
    }
}

