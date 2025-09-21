import type {Translation, TranslationKey} from "../../shared/entities/Translation";
import { DatabaseAdapter } from "../adapter/DatabaseAdapter";

const COLLECTION = "translations";

export type TranslationRepoOptions = {
  db: DatabaseAdapter
};

export class TranslationRepo {
  #db: DatabaseAdapter;

  constructor(options: TranslationRepoOptions) {
    this.#db = options.db;
  }

  async getAll(): Promise<Translation[]> {
    return this.#db.getAll(COLLECTION);
  }

  async insertOrMoveToTop(translation: Translation): Promise<void> {
    await this.#db.remove<Translation>(COLLECTION, t => (t.originalText === translation.originalText && t.engine === translation.engine));
    await this.#db.insert(COLLECTION, translation);
  }

  async removeByKey(key: TranslationKey): Promise<void> {
    await this.#db.remove<Translation>(COLLECTION, t => t.key === key);
  }
}

