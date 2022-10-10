import { AnnouncementProps } from "../entities/announcement"

export interface AnnouncementRepository {
    update(id: number, announcement: Partial<AnnouncementProps>): Promise<void>;
    findBy(conditions: any): Promise<AnnouncementProps | null>;
    create(announcement: AnnouncementProps): Promise<AnnouncementProps>;
}
