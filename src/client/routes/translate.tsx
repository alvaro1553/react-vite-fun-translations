import type { Route } from "./+types/translate";
import { useFetcher} from "react-router";
import { InputForm } from "../components/molecules/InputForm";
import { Content } from "../components/atoms/Content";
import { SidePane } from "../components/atoms/Sidepane";
import { getTranslationServiceSingleton } from "../../server/service/TranslationService";
import {Env} from "../../shared/utils/Env";
import {waitMS} from "../../shared/utils/functions";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const text = formData.get("text");
  if (typeof text !== "string") {
    return { error: "Invalid text. Please insert a valid string" }
  }
  const translationService = getTranslationServiceSingleton();
  if (Env.NO_PROD) {
    await waitMS(600);
  }
  const { translatedText } = await translationService.getTranslation(text);
  // should I do something with that request?

  return { error: null, translated: translatedText };
}

export default function Translate(props: Route.ComponentProps) {
  const fetcher = useFetcher();
  const loading = fetcher.state === "submitting";

  return (
    <div className="flex h-full py-3">
      <SidePane>It would be nice to see past translations here.</SidePane>
      <Content>
        <InputForm
          component={fetcher.Form}
          method='POST'
          action='/translate'
          submit={loading ? 'Translating...' : 'Translate'}
          loading={loading}
          success={fetcher.data?.translated}
          error={fetcher.data?.error}
        />
      </Content>
    </div>
  );
}
