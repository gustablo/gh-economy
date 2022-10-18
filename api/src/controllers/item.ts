import { ItemPrismaRepository } from "../repositories/implementations/item-repository-prisma";
import { UserItemPrismaRepository } from "../repositories/implementations/user-item-repository-prisma";
import { HttpResponse } from "../shared/contracts/http-response";
import { commonError, commonSuccess } from "../shared/utils/http-returns";
import { GetItemAnnouncements } from "../usecases/get-item-announcements";
import { ListItems } from "../usecases/list-items";
import { MyItems } from "../usecases/my-items";

export class ItemController {
    private listItems = new ListItems(
        new ItemPrismaRepository(),
    );

    private getItemAnnouncements = new GetItemAnnouncements(
        new ItemPrismaRepository(),
    );

    private myItems = new MyItems(
        new UserItemPrismaRepository(),
    );

    async listAnnouncedItems(token?: string): Promise<HttpResponse> {
        try {
            const response = await this.listItems.exec(token);

            return commonSuccess(response);
        } catch(err) {
            return commonError(err as Error);
        }
    }

    async getItem(id: string): Promise<HttpResponse> {
        try {
            const response = await this.getItemAnnouncements.exec(Number(id));

            return commonSuccess(response);
        } catch(err) {
            return commonError(err as Error);
        }
    }

    async listMyItems(token: string): Promise<HttpResponse> {
        try {
            const response = await this.myItems.exec(token);

            return commonSuccess(response);
        } catch(err) {
            return commonError(err as Error);
        }
    }
}
