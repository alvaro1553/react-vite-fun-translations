import {
  createTranslation,
  type Translation, type TranslationEngine,
} from "../../shared/entities/Translation";
import { invariant } from "../../shared/utils/functions";
import {Obj} from "../../shared/utils/Obj";
import {
  createTranslationError,
  type TranslationError
} from "../../shared/entities/TranslationError";

const FunTranslationsEngines = ['yoda', 'pirate'] as const;

type FunTranslationsDTO = {
  "success": {
    "total": number
  },
  "contents": {
    "translation": FunTranslationsDTOEngine,
    "text": string,
    "translated": string,
  }
};
type FunTranslationsDTOEngine = typeof FunTranslationsEngines[number];

const isDTO = (value: unknown): value is FunTranslationsDTO => {
  const v = value as FunTranslationsDTO;
  return (
    Obj.isPlainObject(v) &&
    Obj.isPlainObject(v.success) &&
    typeof v.success.total === 'number' &&
    Obj.isPlainObject(v.contents) &&
    FunTranslationsEngines.includes(v.contents.translation) &&
    typeof v.contents.text === 'string' &&
    typeof v.contents.translated === 'string'
  )
}
const fromDTO = (funTranslationsDTO: unknown): Translation => {
  invariant(isDTO(funTranslationsDTO), "Invalid parameter. Expected: FunTranslationsDTO. Received:", funTranslationsDTO);
  const { translation, text, translated } = funTranslationsDTO.contents;
  return createTranslation({
    engine: translation,
    originalText: text,
    translatedText: translated,
  });
}

export class TranslationAPI {
  async getTranslation(text: string, engine: TranslationEngine): Promise<Translation | TranslationError> {
    try {
      const response = await fetch(
        `https://api.funtranslations.com/translate/${engine}.json`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({ text })
        }
      );

      const json = await response.json();
      if (json.error !== undefined) {
        const message = json.error.message;
        if (json.error.code === 429) {
          return createTranslationError(message);
        }
        return createTranslationError(message);
      }

      if (!response.ok) {
        return createTranslationError(`Failed to translate. Server responded with status ${response.status}`);
      }

      return fromDTO(json);

    } catch (e) {
      return createTranslationError(e instanceof Error ? e.message : 'Unknown error');
    }
  }
}
