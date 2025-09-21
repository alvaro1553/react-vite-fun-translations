import type { CacheDriver } from "../../shared/utils/InMemoryCache";

export type CacheAdapterOptions<K, V> = {
  driver: CacheDriver<K, V>;
};

export class CacheAdapter<K, V> {
  driver: CacheDriver<K, V>;

  constructor(options: CacheAdapterOptions<K, V>) {
    this.driver = options.driver;
  }

  get(key: K) {
    return this.driver.get(key);
  }
  set(key: K, value: V, ttlMs?: number) {
    return this.driver.set(key, value, ttlMs);
  }
  has(key: K) {
    return this.driver.has(key);
  }
  delete(key: K) {
    return this.driver.delete(key);
  }
  clear() {
    return this.driver.clear();
  }
}
