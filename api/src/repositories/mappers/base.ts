export abstract class BaseMapper<Entity> {
    abstract toModel(database: any | null): Entity;
    
    toModelCollection(database: any[]): Entity[] {
        return database.map(this.toModel);
    }
}
