import type {Translation} from "../../domain/types/Translation";

class YodaTranslationRepo {
  async getTranslation(text: string): Promise<Translation> {
    // const response = await fetch(
    //   "https://api.funtranslations.com/translate/yoda.json",
    //   { method: "POST", body: JSON.stringify({ text }) }
    // );
    //
    // return response;

    const json = await import(
      "../mocks/api.funtranslations.com_translate_yoda.json.json"
    );

    return Promise.resolve(json.contents as Translation);
  }
}

export default YodaTranslationRepo;
