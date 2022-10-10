export class Entity<T> {
    props: T;

    constructor(props?: Partial<T>) {
        if (props) {
            // @ts-ignore
            this.props = props;
        } else {
            // @ts-ignore
            this.props = {};
        }
    }
}
