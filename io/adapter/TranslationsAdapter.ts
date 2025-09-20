import {isTranslation, type Translation} from "../../domain/types/Translation";
import {invariant} from "../../utils/invariant";

class TranslationsAdapter {
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
    const translation = json?.contents;
    invariant(isTranslation(translation), "Invalid response. Expected: Translation. Received:", json);

    return translation;
  }
}

export default TranslationsAdapter;
