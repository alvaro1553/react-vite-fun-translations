export type Collection = string;
export type DBRecord<T> = T;

export interface DatabaseDriver {
  getAll<T>(collection: Collection): Promise<DBRecord<T>[]>;
  insert<T>(collection: Collection, record: T): Promise<DBRecord<T>>;
  remove<T>(collection: Collection, match: (r: T) => boolean): Promise<void>;
  clear(collection: Collection): Promise<void>;
}

export class InMemoryDB implements DatabaseDriver {
  #store = new Map<Collection, DBRecord<any>[]>();

  async getAll<T>(collection: Collection): Promise<DBRecord<T>[]> {
    return [...(this.#store.get(collection) ?? [])];
  }

  async insert<T>(collection: Collection, record: T): Promise<DBRecord<T>> {
    const col = this.getOrCreateCollection(collection);
    col.unshift(record);
    return record;
  }

  async remove<T>(collection: Collection, match: (r: T) => boolean): Promise<void> {
    const col = this.getOrCreateCollection(collection);
    const idx = col.findIndex(match);
    if (idx >= 0) col.splice(idx, 1);
  }

  async clear(collection: Collection): Promise<void> {
    const col = this.getOrCreateCollection(collection);
    col.length = 0;
    this.#store.delete(collection);
  }

  private getOrCreateCollection(collection: Collection): DBRecord<any>[] {
    let col = this.#store.get(collection);
    if (!col) {
      col = [];
      this.#store.set(collection, col);
    }
    return col;
  }
}