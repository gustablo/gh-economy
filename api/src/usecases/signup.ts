import { INITIAL_AMOUNT } from "../shared/constants/initial-amount";
import { User, UserProps } from "../entities/user";
import { Wallet } from "../entities/wallet";
import { UserRepository } from "../repositories/user-repository";
import { WalletRepository } from "../repositories/wallet-repository";
import { SignupRequestDTO } from "../dtos/signup";

export class Signup {

    constructor(
        private userRepository: UserRepository,
        private walletRepository: WalletRepository,
    ) { }


    async exec(userRequest: SignupRequestDTO) {
        const user = new User(userRequest);
        const userAlreadyExists = await this.isNameAlreadyExists(user.props.name);

        if (userAlreadyExists) {
            throw new Error('Name already been used');
        }

        const wallet = new Wallet();
        wallet.add(INITIAL_AMOUNT);

        const createdWallet = await this.walletRepository.create(wallet.props);

        if (!createdWallet?.id) {
            throw new Error('Error while creating wallet');
        }

        const createdUser = await this.userRepository.create(user.props, createdWallet.id);

        if (!createdUser?.id) {
            throw new Error('Error while creating user');
        }
        
        return {
            user: this.removePassword(createdUser),
            wallet: createdWallet
        };
    }

    private async isNameAlreadyExists(name: string) {
        const user = await this.userRepository.findBy({ name });
        
        return !!user;
    }

    private removePassword(user: UserProps) {
        if (!user) return;

        const { password, ...userProps } = user;

        return userProps;
    }
}
