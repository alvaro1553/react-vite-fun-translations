import {Obj} from "../utils/Obj";

export type TranslationError = {
  error: true,
  message: string,
}

export const createTranslationError = (message: string): TranslationError => {
  return {
    error: true,
    message,
  }
}
export const isTranslationError = (value: unknown): value is TranslationError => {
  return Obj.isPlainObject(value) && typeof value.error === 'boolean' && typeof value.message === 'string';
}
