import { Announcement } from "./announcement";
import { Entity } from "./base";
import { User } from "./user";
import { Wallet } from "./wallet";

export interface TransactionProps {
    readonly id?: string;
    status: 'PENDING' | 'CANCELED' | 'CONFIRMED' | string;
    amount: number;
    to: Wallet;
    from: Wallet;
    announcement: Announcement;
    quantityItemsAsked: number;
    fromUser?: User;
}

export class Transaction extends Entity<TransactionProps> {

    verifyAvailability() {
        if (this.props.quantityItemsAsked > this.props.announcement?.props?.quantityAvailable) {
            throw new Error('Quantity available not enough');
        }
    }

    fakeTrade() {
        this.verifyAvailability();

        const mockFrom = new Wallet(this.props.from.props);
        const mockTo = new Wallet(this.props.to.props);

        mockFrom.sub(this.props.amount);
        mockTo.add(this.props.amount);
    }

    trade() {
        if (this.props.status !== 'PENDING') {
            throw new Error("Can't trade a transaction that is not PENDING");
        }

        this.verifyAvailability();

        this.props.from.sub(this.props.amount);
        this.props.to.add(this.props.amount);
    }
}
