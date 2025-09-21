type Entry<V> = { value: V; expiresAt?: number }

export type CacheDriver<K, V> = {
  get: (key: K) => V | undefined;
  set: (key: K, value: V, ttlMs?: number) => void;
  has: (key: K) => boolean;
  delete: (key: K) => void;
  clear: () => void;
}

export type InMemoryCacheOptions = {
  /**
   * The default time-to-live (TTL) in milliseconds for every set value.
   *
   * In other words, if a value is set using {@link InMemoryCache.set} without
   * passing the parameter `TTL`, it will be set using this TTL.
   *
   * default: undefined.
   */
  defaultTtlMs?: number;
  /**
   * A function that returns the current time in milliseconds.
   *
   * default: `() => Date.now()`.
   */
  getNow?: () => number
}

/**
 * Class representing an in-memory cache with optional time-to-live (TTL) for
 * each entry. Provides methods to store, retrieve, and manage cached data.
 */
export class InMemoryCache<K, V> implements CacheDriver<K, V> {
  readonly #map = new Map<K, Entry<V>>();
  readonly #defaultTTLms?: number;
  readonly #getNow: () => number;

  constructor(options?: InMemoryCacheOptions) {
    this.#defaultTTLms = options?.defaultTtlMs;
    this.#getNow = options?.getNow ?? (() => Date.now());
  }

  /**
   * Get the value associated with the given key.
   *
   * If the value is expired, i.e. It was set using `TTL` or a default `TTL` was
   * defined for every set value (check {@link InMemoryCacheOptions.defaultTtlMs}),
   * it will be removed from the cache, returning undefined.
   */
  get(key: K): V | undefined {
    const entry = this.#map.get(key);
    if (entry === undefined) {
      return undefined;
    }
    if (this.isExpired(entry)) {
      this.#map.delete(key);
      return undefined;
    }
    return entry.value;
  }

  /**
   * Sets a key-value pair in the map with an optional time-to-live (TTL).
   *
   * - If a TTL is provided, the key will expire after the specified duration.
   * - If no TTL is provided, the default TTL will be used. Check {@link InMemoryCacheOptions.defaultTtlMs}.
   * - If no TTL is provided, and no default TTL was explicitly set when instantiating
   *   the class, the value will never expire.
   */
  set(key: K, value: V, ttlMs?: number): void {
    const ttl = ttlMs ?? this.#defaultTTLms;
    const expiresAt = typeof ttl === "number" ? this.#getNow() + ttl : undefined;
    this.#map.set(key, { value, expiresAt });
  }

  /**
   * Checks whether the given key exists in the map and is not expired.
   *
   * If the value is expired, it will be removed from the cache, returning false.
   */
  has(key: K): boolean {
    const entry = this.#map.get(key);
    if (!entry) {
      return false;
    }
    if (this.isExpired(entry)) {
      this.#map.delete(key);
      return false;
    }
    return true;
  }

  delete(key: K): void {
    this.#map.delete(key);
  }

  clear(): void {
    this.#map.clear();
  }

  private isExpired(entry: Entry<V>): boolean {
    return typeof entry.expiresAt === "number" && this.#getNow() >= entry.expiresAt;
  }
}