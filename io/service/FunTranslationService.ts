import type { Translation } from "domain/types/Translation";
import TranslationsAdapter from "../adapter/TranslationsAdapter";

interface FunTranslationService {
  getTranslation(text: string): Promise<Translation>;
}

class DefaultFunTranslationService implements FunTranslationService {
  adapter: TranslationsAdapter;

  constructor(adapter: TranslationsAdapter) {
    this.adapter = adapter;
  }

  async getTranslation(text: string): Promise<Translation> {
    return await this.adapter.getTranslation(text);
  }
}

const createDefaultFunTranslationService = () => {
  const yodaRepo = new TranslationsAdapter();
  const service = new DefaultFunTranslationService(yodaRepo);

  return service;
};

export { DefaultFunTranslationService, createDefaultFunTranslationService };
