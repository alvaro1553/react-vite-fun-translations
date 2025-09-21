let translationKey = 0;

export const Engines = ['yoda', 'pirate', 'alvaro'] as const;

export type Translation = {
  key: TranslationKey;
  engine: TranslationEngine;
  originalText: TranslationText;
  translatedText: string;
};
export type TranslationKey = string;
export type TranslationText = string;
export type TranslationEngine = typeof Engines[number];

export const createTranslation = (options: Omit<Translation, 'key'>) => {
  return {
    key: `${translationKey++}`,
    engine: options.engine,
    originalText: options.originalText,
    translatedText: options.translatedText,
  }
}