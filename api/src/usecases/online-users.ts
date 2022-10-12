import { UserRepository } from "../repositories/user-repository";
import { decodeToken } from "../shared/utils/decode-token";

export class OnlineUsers {
    constructor(
        private userRepo: UserRepository,
    ) {}

    async exec(token: string) {
        const user = await decodeToken(token);

        return this.userRepo.listOnline(Number(user.id));
    }
}
