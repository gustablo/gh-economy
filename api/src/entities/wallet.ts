import { Entity } from "./base";

export interface WalletProps {
    readonly id?: string;
    balance: number;
}

export class Wallet extends Entity<WalletProps> {
    constructor(wallet?: WalletProps) {
        super(wallet);
    }

    sub(amount: number) {
        if (!this.props.balance || typeof this.props.balance !== 'number') {
            this.props.balance = 0;
        }

        if (this.props.balance - amount < 0) {
            throw new Error('Amount not enough');
        }

        this.props.balance -= amount;
    }

    add(amount: number) {
        if (!this.props.balance || typeof this.props.balance !== 'number') {
            this.props.balance = 0;
        }
    
        this.props.balance = this.props.balance + amount;
    }
}
