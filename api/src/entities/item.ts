import { Entity } from "./base";

export interface ItemProps {
    readonly id?: number;
    name: string;
    imageUrl: string;
    yield: number;
    rarity: 'LOW' | 'MEDIUM' | 'HIGH' | 'LEGENDARY' | string;
}

export class Item extends Entity<ItemProps> {

}
