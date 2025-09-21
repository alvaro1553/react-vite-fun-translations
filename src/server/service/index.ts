import {TranslationAPI} from "../adapter/TranslationAPI";
import {TranslationRepo} from "../repo/TranslationRepo";
import {InMemoryCache} from "../../shared/utils/InMemoryCache";
import {TranslationService } from "./TranslationService";
import {DatabaseAdapter } from "../adapter/DatabaseAdapter";
import { InMemoryDB} from "../../shared/utils/InMemoryDB";
import type {Translation} from "../../shared/entities/Translation";

let translationServiceSingleton: TranslationService;

export function getTranslationServiceSingleton(): TranslationService {
  if (translationServiceSingleton) {
    return translationServiceSingleton;

  } else {
    const driver = new InMemoryDB();
    const db = new DatabaseAdapter({ driver });
    const api = new TranslationAPI();
    const repo = new TranslationRepo({ db });
    const cache = new InMemoryCache<string, Translation>();

    return translationServiceSingleton ??= new TranslationService({ api, repo, cache });
  }
}