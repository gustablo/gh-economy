import { WalletProps } from "../../entities/wallet";
import { WalletPrismaMapper } from "../mappers/wallet-prisma";
import { WalletRepository } from "../wallet-repository";
import { prisma } from "./prisma";

export class WalletPrismaRepository implements WalletRepository {

    private mapper = new WalletPrismaMapper();


    async create(wallet: WalletProps): Promise<WalletProps> {
        const created = await prisma.wallet.create({
            data: {
                balance: wallet.balance,
            },
        });

        const { props } = this.mapper.toModel(created);

        return props;
    }

    async update(walletId: string, amount: number): Promise<WalletProps | null> {
        const updated = await prisma.wallet.update({
            data: {
                balance: amount,
            },
            where: {
                id: Number(walletId)
            }
        });

        if (!updated) return null;

        const { props } = this.mapper.toModel(updated);

        return props;
    }
}
