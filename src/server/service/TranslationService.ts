import { createTranslation, type Translation, type TranslationEngine, type TranslationKey, type TranslationText } from "../../shared/entities/Translation";
import type { CacheAdapter } from "../../shared/utils/InMemoryCache";
import { TranslationAPI } from "../adapter/TranslationAPI";
import { TranslationRepo } from "../repo/TranslationRepo";
import {isTranslationError, type TranslationError} from "../../shared/entities/TranslationError";

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
  async getTranslationOrCached(
    text: TranslationText,
    options: { invalidateCacheInMS?: number; engine: TranslationEngine }
  ): Promise<Translation | TranslationError> {
    const { invalidateCacheInMS = 1000 * 60 * 5, engine } = options;

    const key = this.getCacheKey(text, engine);
    const cached = this.cache.get(key);
    if (cached) {
      await this.repo.insertOrMoveToTop(cached);
      return cached;
    }

    let translation: Translation | TranslationError;
    if (engine === 'alvaro') {
      translation = this.alvarize(text);
    } else {
      translation = await this.api.getTranslation(text, engine);
    }

    if (isTranslationError(translation)) {
      return translation;
    }

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

  private getCacheKey(text: TranslationText, engine: TranslationEngine): string {
    return `${engine}|${text}`;
  }
  private alvarize(text: string): Translation {
    const normalized = text.trim().replace(/\s+/g, ' ');
    if (!normalized) {
      return createTranslation({
        engine: 'alvaro',
        originalText: text,
        translatedText: "🤷 Nothing to alvarize! — alvarized ✨🧠",
      });
    }

    let s = normalized
      .replace(/->/g, "→")
      .replace(/--/g, "—")
      .replace(/\bto\b/gi, "→")
      .replace(/\byou\b/gi, "u")
      .replace(/\band\b/gi, "&")
      .replace(/\bidea\b/gi, "💡 idea")
      .replace(/\blove\b/gi, "❤️ love")
      .replace(/\bbug\b/gi, "🐛 bug")
      .replace(/\bfix\b/gi, "🛠️ fix")
      .replace(/\bship(ping)?\b/gi, "🚢 ship$1")
      .replace(/\brocket\b/gi, "🚀 rocket")
      .replace(/\b(fire|hot)\b/gi, "🔥");

    const words = s.split(' ').map(w => {
      const plain = w.replace(/[^\p{L}\p{N}]/gu, '');
      if (plain.length >= 5) {
        const titled = w.charAt(0).toUpperCase() + w.slice(1);
        const score = Array.from(plain).reduce((acc, c) => acc + (c.codePointAt(0) || 0), 0);
        const mod = score % 3;
        const emoji = mod === 0 ? "✨" : mod === 1 ? "🧠" : "";
        return `${titled}${emoji}`;
      }
      return w;
    }).join(' ');

    const suffix = "— alvarized ✨🧠";
    const translated = /[.!?…]$/.test(words) ? `${words} ${suffix}` : `${words}. ${suffix}`;

    return createTranslation({
      engine: 'alvaro',
      originalText: text,
      translatedText: translated,
    });
  }
}