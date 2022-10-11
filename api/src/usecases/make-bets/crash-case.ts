import { BetResponse, IBetStrategy } from "./bet-strategy";

export class CrashCase implements IBetStrategy {

    run(options: any): BetResponse {
        const LIMIT = 100;
        const random = Math.random() * LIMIT;

        const multipler = ((LIMIT*100 - random)/(LIMIT-random))/100;
        
        return {
            multipler,
            won: false,
            options: { multipler },
        }
    }

}
