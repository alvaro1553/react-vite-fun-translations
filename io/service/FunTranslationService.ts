import type { Translation } from "domain/types/Translation";
import YodaTranslationRepo from "../repo/YodaTranslationRepo";

interface FunTranslationService {
  getTranslation(text: string): Promise<Translation>;
}

class DefaultFunTranslationService implements FunTranslationService {
  repo: YodaTranslationRepo;

  constructor(repo: YodaTranslationRepo) {
    this.repo = repo;
  }

  async getTranslation(text: string): Promise<Translation> {
    return await this.repo.getTranslation(text);
  }
}

const createDefaultFunTranslationService = () => {
  const yodaRepo = new YodaTranslationRepo();
  const service = new DefaultFunTranslationService(yodaRepo);

  return service;
};

export { DefaultFunTranslationService, createDefaultFunTranslationService };
