import type { Route } from "./+types/translate";
import { useFetcher, useLoaderData } from "react-router";
import { useState } from "react";
import { InputForm } from "../components/molecules/InputForm";
import { Content } from "../components/atoms/Content";
import { SidePane } from "../components/atoms/Sidepane";
import { List } from "../components/atoms/List";
import { ListItem } from "../components/atoms/ListItem";
import { ButtonForm } from "../components/molecules/ButtonForm";
import { Env } from "../../shared/utils/Env";
import { waitMS } from "../../shared/utils/functions";
import {getTranslationServiceSingleton} from "../../server/service";
import {Engines, type Translation, type TranslationEngine} from "../../shared/entities/Translation";
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
  const engine = formData.get("engine") as TranslationEngine;
  if (!Engines.includes(engine as any)) {
    return { error: "Invalid engine. Please select a valid engine: `" + Engines.join("`, `") + "`" };
  }

  if (Env.NO_PROD) {
    await waitMS(600);
  }
  const translation = await translationService.getTranslationOrCached(text, { engine });
  if (isTranslationError(translation)) {
    let errorMessage = translation.message;
    if (translation.message.includes('Too Many Requests')) {
      errorMessage += ' You can choose Alvaro\'s engine in the meantime, which is free for now :)'
    }
    return { error: errorMessage };
  }

  return { error: null, translated: translation.translatedText };
}

export default function Translate(props: Route.ComponentProps) {
  const fetcher = useFetcher();
  const loading = fetcher.state === "submitting";
  const loaderData = useLoaderData() as { history: Translation[] };

  const [engine, setEngine] = useState<TranslationEngine>('yoda');
  const ENGINE_LABELS: Record<TranslationEngine, string> = {
    yoda: 'Yoda',
    pirate: 'Pirate',
    alvaro: "Alvaro's",
  };
  const menuItems = Engines.map((e) => ({ key: e, label: ENGINE_LABELS[e] }));

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
          submitLabel={loading ? 'Translating...' : 'Translate'}
          submitLoading={loading}
          submitSuccess={fetcher.data?.translated}
          submitError={fetcher.data?.error}
          inputPlaceholder="Enter the text to translate here"
          menuLabel="Engine:"
          menuButtonAriaLabel="Choose translation engine"
          menuOptions={menuItems}
          menuActiveKey={engine}
          onMenuSelect={(key) => setEngine(key as TranslationEngine)}
        />
      </Content>
    </div>
  );
}
