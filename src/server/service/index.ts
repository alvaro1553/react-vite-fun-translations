import {TranslationAPI} from "../adapter/TranslationAPI";
import {TranslationRepo} from "../repo/TranslationRepo";
import {InMemoryCache} from "../../shared/utils/InMemoryCache";
import {TranslationService } from "./TranslationService";
import {DatabaseAdapter } from "../adapter/DatabaseAdapter";
import { InMemoryDB} from "../../shared/utils/InMemoryDB";
import { CacheAdapter } from "../adapter/CacheAdapter";
import type {Translation} from "../../shared/entities/Translation";

let translationServiceSingleton: TranslationService;

export function getTranslationServiceSingleton(): TranslationService {
  if (translationServiceSingleton) {
    return translationServiceSingleton;

  } else {
    const dbDriver = new InMemoryDB();
    const cacheDriver = new InMemoryCache<string, Translation>();

    const db = new DatabaseAdapter({ driver: dbDriver });
    const cache = new CacheAdapter<string, Translation>({ driver: cacheDriver });

    const api = new TranslationAPI();
    const repo = new TranslationRepo({ db });

    return translationServiceSingleton ??= new TranslationService({ api, repo, cache });
  }
}