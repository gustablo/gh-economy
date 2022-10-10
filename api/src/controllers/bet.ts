import { MakeBetsRequestDTO } from "../dtos/make-bets";
import { UserPrismaRepository } from "../repositories/implementations/user-repository-prisma";
import { WalletPrismaRepository } from "../repositories/implementations/wallet-repository-prisma";
import { HttpResponse } from "../shared/contracts/http-response";
import { commonError, commonSuccess } from "../shared/utils/http-returns";
import { MakeBets } from "../usecases/make-bets";

export class BetController {
    private userRepo = new UserPrismaRepository();
    private walletRepo = new WalletPrismaRepository();

    private makeBetUsecase = new MakeBets(this.userRepo, this.walletRepo);

    async makeBet(body: MakeBetsRequestDTO, token: string): Promise<HttpResponse> {
        try {
            const response = await this.makeBetUsecase.exec(body, token);

            return commonSuccess(response);
        }catch(err) {
            return commonError(err as Error);
        }
    }
}
