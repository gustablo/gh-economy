import { Entity } from "./base";

export interface ItemProps {
    readonly id?: number;
    name: string;
    imageUrl: string;
}

export class Item extends Entity<ItemProps> {

}
