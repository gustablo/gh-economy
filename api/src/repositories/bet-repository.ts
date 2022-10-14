import { BetProps } from "../entities/bet";

export interface BetRepository {
    create(bet: BetProps): Promise<BetProps>;
    findBy(conditions: any): Promise<BetProps | null>;
}
