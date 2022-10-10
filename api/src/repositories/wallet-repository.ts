import { WalletProps } from "../entities/wallet";

export interface WalletRepository {
    create(wallet: WalletProps): Promise<WalletProps>;
    update(walletId: string, amount: number): Promise<WalletProps | null>;
}
