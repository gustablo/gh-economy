export abstract class BaseMapper<Entity> {
    abstract toModel(database: any | null): Entity;
    
    toModelCollection(database: any[]): Entity[] {
        if (!database?.length) return [];

        return database.map(this.toModel);
    }
}
