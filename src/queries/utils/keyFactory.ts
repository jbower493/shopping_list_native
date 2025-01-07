export class QueryKeySet {
    entityName: string

    constructor(entityName: string) {
        this.entityName = entityName

        this.many = this.many.bind(this)
        this.one = this.one.bind(this)
    }

    many(): string[] {
        return [this.entityName]
    }

    one(entityId: string): string[] {
        return [...this.many(), entityId]
    }
}
