import type { Engine } from "./Engine";

export type TranslationText = string;

export type Translation = {
  engine: Engine;
  originalText: TranslationText;
  translatedText: string;
};