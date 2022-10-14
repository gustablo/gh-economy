import { BetProps } from "../../entities/bet";
import { User } from "../../entities/user";
import { BetRepository } from "../bet-repository";
import { prisma } from "./prisma";

export class BetRepositoryPrisma implements BetRepository {
    async create(bet: BetProps): Promise<BetProps> {
        const created = await prisma.bet.create({
            data: {
                amount: bet.amount,
                game: bet.game,
                challenged_id: Number(bet.challenged.props.id),
                challenger_id: Number(bet.challenger.props.id),
            },
        });

        return {
            id: created.id,
            amount: Number(created.amount),
            game: created.game,
            challenged: new User(),
            challenger: new User(),
        }
    }

    async findBy(conditions: any): Promise<BetProps | null> {
        const bet = await prisma.bet.findFirst({
            include: {
                challenged: true,
                challenger: true,
            },
            where: {
                id: conditions.id ? Number(conditions.id) : undefined,
            }
        });

        if (!bet) return null;

        return {
            id: bet.id,
            amount: Number(bet.amount),
            game: bet.game,
            challenged: new User({ id: bet.challenged.id.toString(), name: bet.challenged.name }),
            challenger: new User({ id: bet.challenger.id.toString(), name: bet.challenger.name }),
        }
    }

}