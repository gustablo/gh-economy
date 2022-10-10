import { AskTradeRequestDTO } from "../dtos/ask-trade";
import { ConfirmTradeRequestDTO } from "../dtos/confirm-trade";
import { AnnouncementPrismaRepository } from "../repositories/implementations/announcement-repository-prisma";
import { ItemPrismaRepository } from "../repositories/implementations/item-repository-prisma";
import { TransactionPrismaRepository } from "../repositories/implementations/transaction-repository-prisma";
import { UserPrismaRepository } from "../repositories/implementations/user-repository-prisma"
import { WalletPrismaRepository } from "../repositories/implementations/wallet-repository-prisma";
import { HttpResponse } from "../shared/contracts/http-response";
import { commonError, commonSuccess } from "../shared/utils/http-returns";
import { AskTrade } from "../usecases/ask-trade";
import { ConfirmTrade } from "../usecases/confirm-trade";
import { ListPendingTransactions } from "../usecases/list-pending-transactions";

export class TradeController {

    private userRepo = new UserPrismaRepository();
    private transactionRepo = new TransactionPrismaRepository();
    private walletRepo = new WalletPrismaRepository();
    private itemRepo = new ItemPrismaRepository();
    private announcementRepo = new AnnouncementPrismaRepository();

    private askUseCase = new AskTrade(this.userRepo, this.transactionRepo, this.announcementRepo);
    private pendingUseCase = new ListPendingTransactions(this.transactionRepo);
    private confirmUseCase = new ConfirmTrade(
        this.transactionRepo,
        this.walletRepo,
        this.userRepo,
        this.announcementRepo,
        this.itemRepo
    );

    async askTrade(body: AskTradeRequestDTO, token: string): Promise<HttpResponse> {
        try {
            const response = await this.askUseCase.exec(body, token);

            return commonSuccess(response);
        } catch(error) {
            return commonError(error as Error);
        }
    }

    async confirmTrade(body: ConfirmTradeRequestDTO, token: string): Promise<HttpResponse> {
        try {
            const response = await this.confirmUseCase.exec(body.transactionId, body.decision, token);

            return commonSuccess(response);
        } catch(error) {
            return commonError(error as Error);
        }
    }

    async pendingTrades(token: string): Promise<HttpResponse> {
        try {
            const response = await this.pendingUseCase.exec(token);

            return commonSuccess(response);
        } catch(err) {
            return commonError(err as Error);
        }
    }
}
