import { CreateAnnouncementRequestDTO } from "../dtos/create-announcement";
import { AnnouncementPrismaRepository } from "../repositories/implementations/announcement-repository-prisma";
import { TransactionPrismaRepository } from "../repositories/implementations/transaction-repository-prisma";
import { UserItemPrismaRepository } from "../repositories/implementations/user-item-repository-prisma";
import { commonError, commonSuccess } from "../shared/utils/http-returns";
import { CancelAnnouncement } from "../usecases/cancel-announcement";
import { CreateAnnouncement } from "../usecases/create-announcement";

export class AnnouncementController {
    private announcementRepo = new AnnouncementPrismaRepository();
    private userItemRepo = new UserItemPrismaRepository();
    private transactionRepo = new TransactionPrismaRepository();

    private createUsecase = new CreateAnnouncement(
        this.announcementRepo,
        this.userItemRepo,
    );
    private cancelUsecase = new CancelAnnouncement(
        this.announcementRepo,
        this.transactionRepo,
        this.userItemRepo,
    )

    async create(body: CreateAnnouncementRequestDTO, token: string) {
        try {
            const response = await this.createUsecase.exec(body, token);

            return commonSuccess(response);
        } catch(err) {
            return commonError(err as Error);
        }
    }

    async cancel(announcementId: string, token: string) {
        try {
            const response = await this.cancelUsecase.exec(Number(announcementId), token);

            return commonSuccess(response);
        } catch(err) {
            return commonError(err as Error);
        }
    }
}