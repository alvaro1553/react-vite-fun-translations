import type { Translation, TranslationKey, TranslationText } from "../../shared/entities/Translation";
import type { CacheAdapter } from "../../shared/utils/InMemoryCache";
import { TranslationAPI } from "../adapter/TranslationAPI";
import { TranslationRepo } from "../repo/TranslationRepo";

export interface TranslationServiceOptions {
  api: TranslationAPI;
  repo: TranslationRepo;
  cache: CacheAdapter<TranslationText, Translation>;
}

export class TranslationService {
  api: TranslationAPI;
  repo: TranslationRepo;
  cache: CacheAdapter<TranslationText, Translation>;

  constructor(options: TranslationServiceOptions) {
    this.api = options.api
    this.repo = options.repo
    this.cache = options.cache;
  }

  /**
   * Fetch the translation of the given text.
   *
   * The result is cached. The next call to `getTranslation` with the same `text`
   * within `options.invalidateCacheInMS` milliseconds will return the cached
   * translation instead of fetching it. After `options.invalidateCacheInMS` milliseconds,
   * the cached translation will be invalidated and a new translation will be fetched
   * if `getTranslation` is called with that `text`. The default invalidation
   * time is 5 minutes.
   */
  async getTranslationOrCached(text: TranslationText, options?: { invalidateCacheInMS?: number }): Promise<Translation> {
    const { invalidateCacheInMS = 1000 * 60 * 5 } = options ?? {};

    const key = this.getCacheKey(text);
    const cached = this.cache.get(key);
    if (cached) {
      await this.repo.insertOrMoveToTop(cached);
      return cached;
    }

    const translation = await this.api.getTranslation(text);
    this.cache.set(key, translation, invalidateCacheInMS);
    await this.repo.insertOrMoveToTop(translation);
    return translation;
  }

  async getHistory(): Promise<Translation[]> {
    return this.repo.getAll();
  }

  async removeHistoryEntry(key: TranslationKey): Promise<void> {
    await this.repo.removeByKey(key);
  }

  private getCacheKey(text: TranslationText): string {
    return text;
  }
}