import { BetResponse, IBetStrategy } from "./bet-strategy";

export type RouletteOptions = {
    color: 'GREEN' | 'RED' | 'BLACK';
};

export class RouletteCase implements IBetStrategy {

    run(options: RouletteOptions): BetResponse {
        const allowedColors = ['BLACK', 'GREEN', 'RED'];

        if (!allowedColors.includes(options.color)) {
            throw new Error('Invalid color');
        }

        const randomNumber = Math.floor(Math.random() * 100);

        let color = '';

        if (randomNumber <= 1) {
            color = 'GREEN';
        } else if(randomNumber <= 50) {
            color = 'RED';
        } else if (randomNumber <= 100) {
            color = 'BLACK';
        }

        return {
            won: (options.color == color),
            options: { color },
            multipler: color == 'GREEN' ? 36 : 1,
        }
    }

}
