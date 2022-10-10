import { TransactionProps } from "../../entities/transaction";
import { WalletProps } from "../../entities/wallet";
import { WalletRepository } from "../wallet-repository";
import { prisma } from "./prisma";

export class WalletPrismaRepository implements WalletRepository {

    async create(wallet: WalletProps): Promise<WalletProps> {
        const created = await prisma.wallet.create({
            data: {
                balance: wallet.balance,
            },
        });

        return {
            id: created.id.toString(),
            balance: parseFloat(created.balance.toString()),
        }
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

        return {
            id: updated.id.toString(),
            balance: parseFloat(updated.balance.toString()),
        }
    }

}
