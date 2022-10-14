import { Entity } from "./base";
import { User } from "./user";

export interface BetProps {
    readonly id?: number; 

    challenger: User;
    challenged: User;
    winner?: User;
    game: string;
    amount: number;
}

export class Bet extends Entity<BetProps> {

}
