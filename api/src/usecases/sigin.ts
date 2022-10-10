import { UserRepository } from "../repositories/user-repository";
import { encodeToken } from "../shared/utils/encode-token";

export class Signin {
    constructor(
        private userRepository: UserRepository,
    ) {}

    async exec(name: string, password: string) {
        const user = await this.userRepository.findBy({ name, password });

        if (!user?.id) {
            throw new Error('Incorrect credentials');
        }

        const token = await encodeToken(user.name, user.id);

        return { id: user.id, name: user.name, token };
    }
}
