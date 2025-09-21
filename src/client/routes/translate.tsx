import type { Route } from "./+types/translate";
import { useFetcher, useLoaderData } from "react-router";
import { InputForm } from "../components/molecules/InputForm";
import { Content } from "../components/atoms/Content";
import { SidePane } from "../components/atoms/Sidepane";
import { Env } from "../../shared/utils/Env";
import { waitMS } from "../../shared/utils/functions";
import {getTranslationServiceSingleton} from "../../server/service";
import type {Translation} from "../../shared/entities/Translation";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader({}: Route.LoaderArgs) {
  const translationService = getTranslationServiceSingleton();
  const history = await translationService.getHistory();
  return { history };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = formData.get("_intent");
  const translationService = getTranslationServiceSingleton();

  if (intent === "delete_history") {
    const id = formData.get("id");
    if (typeof id === "string") {
      await translationService.removeHistoryEntry(id);
      return { ok: true };
    }
    return { ok: false, error: "Invalid id" };
  }

  const text = formData.get("text");
  if (typeof text !== "string") {
    return { error: "Invalid text. Please insert a valid string" };
  }
  if (Env.NO_PROD) {
    await waitMS(600);
  }
  const { translatedText } = await translationService.getTranslationOrCached(text);
  return { error: null, translated: translatedText };
}

export default function Translate(props: Route.ComponentProps) {
  const fetcher = useFetcher();
  const loading = fetcher.state === "submitting";
  const loaderData = useLoaderData() as { history: Translation[] };

  return (
    <div className="flex h-full py-3 gap-4">
      <SidePane>
        <h2 className="font-semibold mb-2">Recent translations</h2>
        <ul className="space-y-2">
          {loaderData.history.map(item => (
            <li key={item.key} className="flex items-start justify-between gap-2">
              <div className="text-sm">
                <div className="font-medium truncate max-w-[14rem]" title={item.originalText}>{item.originalText}</div>
                <div className="text-zinc-500 truncate max-w-[14rem]" title={item.translatedText}>{item.translatedText}</div>
              </div>
              <fetcher.Form method="POST" action="/translate">
                <input type="hidden" name="_intent" value="delete_history" />
                <input type="hidden" name="id" value={item.key} />
                <button type="submit" className="text-xs text-red-600 hover:underline">Delete</button>
              </fetcher.Form>
            </li>
          ))}
          {loaderData.history.length === 0 && (
            <li className="text-sm text-zinc-500">No translations yet</li>
          )}
        </ul>
      </SidePane>
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
