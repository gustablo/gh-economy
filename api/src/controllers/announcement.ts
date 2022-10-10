import { CreateAnnouncementRequestDTO } from "../dtos/create-announcement";
import { AnnouncementPrismaRepository } from "../repositories/implementations/announcement-repository-prisma";
import { UserItemPrismaRepository } from "../repositories/implementations/user-item-repository-prisma";
import { commonError, commonSuccess } from "../shared/utils/http-returns";
import { CreateAnnouncement } from "../usecases/create-announcement";

export class AnnouncementController {
    private announcementRepo = new AnnouncementPrismaRepository();
    private userItemRepo = new UserItemPrismaRepository();

    private announcementUseCase = new CreateAnnouncement(
        this.announcementRepo,
        this.userItemRepo,
    );

    async create(body: CreateAnnouncementRequestDTO, token: string) {
        try {
            const response = await this.announcementUseCase.exec(body, token);

            return commonSuccess(response);
        } catch(err) {
            return commonError(err as Error);
        }
    }
}