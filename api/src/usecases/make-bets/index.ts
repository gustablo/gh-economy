import { MakeBetsRequestDTO } from "../../dtos/make-bets";
import { Transaction } from "../../entities/transaction";
import { Wallet } from "../../entities/wallet";
import { UserRepository } from "../../repositories/user-repository";
import { WalletRepository } from "../../repositories/wallet-repository";
import { decodeToken } from "../../shared/utils/decode-token";
import { BetStrategy } from "./bet-strategy";
import { RouletteCase } from "./roulette-case";

export class MakeBets {
    constructor(
        private userRepository: UserRepository,
        private walletRepository: WalletRepository,
    ) {}

    async exec(bet: MakeBetsRequestDTO, token: string) {
        const user = await decodeToken(token);

        if (bet.amount <= 0 ) {
            throw new Error('Amount must be greather than 0');
        }

        const government = await this.userRepository.findBy({ role: 'GOVERNMENT' });
        const gambler = await this.userRepository.findBy({ id: user.id });

        if (!gambler?.wallet || !government?.wallet) {
            throw new Error('Error while betting');
        }

        if (bet.amount > gambler.wallet?.props.balance) {
            throw new Error('Insuficient Coins');
        }

        const allBetsTypes = {
            'ROULETTE': RouletteCase,
        };

        const newBet = new BetStrategy();
        newBet.setStrategy(new allBetsTypes[bet.type]);

        const { won, options, multipler } = newBet.execute(bet.options);

        const governmentWallet = new Wallet(government.wallet?.props);
        const gamblerWallet = new Wallet(gambler.wallet?.props);

        const amount = bet.amount;
        let lostValue = 0;
        let wonValue = 0;

        if (won) {
            governmentWallet.sub(amount * multipler);
            gamblerWallet.add(amount * multipler);

            wonValue = amount * multipler + bet.amount;
        } else {
            gamblerWallet.sub(amount);
            governmentWallet.add(amount);
            lostValue = amount;
        }

        await this.walletRepository.update(gamblerWallet.props.id!, gamblerWallet.props.balance);
        await this.walletRepository.update(governmentWallet.props.id!, governmentWallet.props.balance);

        return {
            won,
            options,
            lostValue,
            wonValue,
        }
    }
}
