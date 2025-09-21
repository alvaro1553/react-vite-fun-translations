import type {DatabaseDriver} from "../../shared/utils/InMemoryDB";

export type DatabaseAdapterOptions = { 
  driver: DatabaseDriver
};

export class DatabaseAdapter {
  driver: DatabaseDriver;

  constructor(options: DatabaseAdapterOptions) {
    this.driver = options.driver;
  }

  getAll<T>(collection: string) {
    return this.driver.getAll<T>(collection);
  }
  insert<T>(collection: string, record: T) {
    return this.driver.insert<T>(collection, record);
  }
  remove<T>(collection: string, match: (record: T) => boolean) {
    return this.driver.remove<T>(collection, match);
  }
  clear(collection: string) {
    return this.driver.clear(collection);
  }
}

