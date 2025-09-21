import { type Translation } from "../../shared/types/Translation";
import { invariant } from "../../shared/utils/invariant";
import {Obj} from "../../shared/utils/Obj";

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
  return {
    engine: translation,
    originalText: text,
    translatedText: translated,
  };
}

class TranslationsAPI {
  async getTranslation(text: string): Promise<Translation> {
    const response = await fetch(
      "https://api.funtranslations.com/translate/yoda.json",
      {
        method: "POST",
        headers: {
          contentType: "x-www-form-urlencoded",
        },
        body: new URLSearchParams({ text })
      }
    );
    const json = await response.json();
    return fromDTO(json);
  }
}

export default TranslationsAPI;
