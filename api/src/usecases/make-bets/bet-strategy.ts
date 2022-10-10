export type BetResponse = {
    won: boolean;
    options: any;
    multipler: number;
}

export interface IBetStrategy {
    run(options: any): BetResponse;
}

export class BetStrategy {
    private _strategy: IBetStrategy;

    setStrategy(strategy: IBetStrategy) {
        this._strategy = strategy;
    }

    execute(options: any): BetResponse {
        return this._strategy.run(options);
    }
}
