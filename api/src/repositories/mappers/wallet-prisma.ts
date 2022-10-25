import { wallet } from "@prisma/client";
import { Wallet } from "../../entities/wallet";
import { BaseMapper } from "./base";

export class WalletPrismaMapper extends BaseMapper<Wallet> {
    
    toModel(wallet: wallet): Wallet {
        if (!wallet) return new Wallet();

        return new Wallet({
            id: wallet.id.toString(),
            balance: Number(wallet.balance),
        });
    }

}
