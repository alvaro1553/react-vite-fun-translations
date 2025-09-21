import type { Route } from "./+types/translate";
import { useFetcher, useLoaderData } from "react-router";
import { InputForm } from "../components/molecules/InputForm";
import { Content } from "../components/atoms/Content";
import { SidePane } from "../components/atoms/Sidepane";
import { List } from "../components/atoms/List";
import { ListItem } from "../components/atoms/ListItem";
import { ButtonForm } from "../components/molecules/ButtonForm";
import { Env } from "../../shared/utils/Env";
import { waitMS } from "../../shared/utils/functions";
import {getTranslationServiceSingleton} from "../../server/service";
import type {Translation} from "../../shared/entities/Translation";
import {isTranslationError} from "../../shared/entities/TranslationError";

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
  const translation = await translationService.getTranslationOrCached(text);
  if (isTranslationError(translation)) {
    return { error: translation.message };
  }

  return { error: null, translated: translation.translatedText };
}

export default function Translate(props: Route.ComponentProps) {
  const fetcher = useFetcher();
  const loading = fetcher.state === "submitting";
  const loaderData = useLoaderData() as { history: Translation[] };

  return (
    <div className="flex h-full py-3 gap-4">
      <SidePane>
        <h2 className="font-semibold mb-2">Recent translations</h2>
        <List>
          {loaderData.history.map(item => (
            <ListItem
              key={item.key}
              title={item.originalText}
              subtitle={item.translatedText}
              right={
                <ButtonForm
                  component={fetcher.Form}
                  method="POST"
                  action="/translate"
                  fields={{ _intent: "delete_history", id: item.key }}
                  label="Delete"
                />
              }
            />
          ))}
          {loaderData.history.length === 0 && (
            <ListItem className="text-sm text-zinc-500">No translations yet</ListItem>
          )}
        </List>
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
