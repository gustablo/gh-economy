import { UserRepository } from "../repositories/user-repository";

export class MoreRiches {
    constructor(
        private userRepo: UserRepository,
    ) {}

    async exec() {
        return this.userRepo.listRiches();        
    }
}
