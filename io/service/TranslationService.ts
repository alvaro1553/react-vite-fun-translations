import type {Translation, TranslationText} from "domain/types/Translation";
import TranslationsAdapter from "../adapter/TranslationsAdapter";
import { InMemoryCache } from "../../utils/InMemoryCache";

let translationServiceSingleton: TranslationService;

export interface TranslationServiceOptions {
  adapter?: TranslationsAdapter;
  cache?: InMemoryCache<TranslationText, Translation>;
}

export class TranslationService {
  adapter: TranslationsAdapter;
  cache: InMemoryCache<TranslationText, Translation>;

  constructor(options?: TranslationServiceOptions) {
    this.adapter = options?.adapter ?? new TranslationsAdapter();
    this.cache = options?.cache ?? new InMemoryCache<TranslationText, Translation>();
  }

  /**
   * Fetch the translation of the given text and cache the result.
   *
   * The next call to `getTranslation` in `options.invalidateCacheInMS` milliseconds
   * will return the cached translation instead of fetching a new translation again.
   */
  async getTranslation(text: TranslationText, options?: { invalidateCacheInMS?: number }): Promise<Translation> {
    const { invalidateCacheInMS = 1000 * 60 * 5 } = options ?? {};

    const key = this.getCacheKey(text);
    const cached = this.cache.get(key);
    if (cached) {
      return cached;
    }

    const translation = await this.adapter.getTranslation(text);
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