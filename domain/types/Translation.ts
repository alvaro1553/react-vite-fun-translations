import {type Engine, isEngine} from "./Engine";
import {Obj} from "../../utils/Obj";

export type TranslationText = string;

export type Translation = {
  translation: Engine;
  text: TranslationText;
  translated: string;
};

export const isTranslation = (value: unknown): value is Translation => {
  const v = value as Translation;
  return (
    Obj.isPlainObject(v) &&
    isEngine(v.translation) &&
    typeof v.text === 'string' &&
    typeof v.translated === 'string'
  )
}
