import type {Translation, TranslationText} from "domain/types/Translation";
import TranslationsAPI from "../adapter/TranslationsAPI";
import { InMemoryCache } from "../../utils/InMemoryCache";

let translationServiceSingleton: TranslationService;

export interface TranslationServiceOptions {
  adapter?: TranslationsAPI;
  cache?: InMemoryCache<TranslationText, Translation>;
}

export class TranslationService {
  translationAPI: TranslationsAPI;
  cache: InMemoryCache<TranslationText, Translation>;

  constructor(options?: TranslationServiceOptions) {
    this.translationAPI = options?.adapter ?? new TranslationsAPI();
    this.cache = options?.cache ?? new InMemoryCache<TranslationText, Translation>();
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
  async getTranslation(text: TranslationText, options?: { invalidateCacheInMS?: number }): Promise<Translation> {
    const { invalidateCacheInMS = 1000 * 60 * 5 } = options ?? {};

    const key = this.getCacheKey(text);
    const cached = this.cache.get(key);
    if (cached) {
      return cached;
    }

    const translation = await this.translationAPI.getTranslation(text);
    this.cache.set(key, translation, invalidateCacheInMS);
    return translation;
  }

  private getCacheKey(text: TranslationText): string {
    return text;
  }
}

export function getTranslationServiceSingleton(): TranslationService {
  return translationServiceSingleton ??= new TranslationService();
}