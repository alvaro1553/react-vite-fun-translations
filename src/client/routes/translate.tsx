import type { Route } from "./+types/translate";
import { useFetcher, useLoaderData, Link } from "react-router";
import { useState } from "react";
import { InputForm } from "../components/molecules/InputForm";
import { Content } from "../components/atoms/Content";
import { SidePane } from "../components/atoms/Sidepane";
import { List } from "../components/atoms/List";
import { ListItem } from "../components/atoms/ListItem";
import { ShortLeftArrow } from "../components/atoms/ShortLeftArrow";
import { ButtonForm } from "../components/molecules/ButtonForm";
import { Env } from "../../shared/utils/Env";
import { waitMS } from "../../shared/utils/functions";
import {getTranslationServiceSingleton} from "../../server/service";
import {Engines, type Translation, type TranslationEngine} from "../../shared/entities/Translation";
import {isTranslationError} from "../../shared/entities/TranslationError";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Fun Translations by Alvaro" },
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
      return { error: null };
    }
    return { error: "Invalid id" };
  }

  if (intent === "clear_history") {
    await translationService.clearHistory();
    return { error: null };
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
    // Mock delay in development to show 'loading...'.
    await waitMS(600);
  }
  const translation = await translationService.getTranslationOrCached(text, { engine });
  if (isTranslationError(translation)) {
    let errorMessage = translation.message;
    if (translation.message.includes('Too Many Requests')) {
      errorMessage += ' You can input cached translations or switch to Alvaro\'s engine in the meantime, which is unlimited :)'
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
    alvaro: "Alvaro",
  };
  const menuItems = Engines.map((e) => ({ key: e, label: ENGINE_LABELS[e] }));

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 to-white text-zinc-800">
      <section className="container mx-auto px-4 py-12">
        <div className="mb-6">
          <Link to="/" aria-label="Home" className="group inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700">
            <ShortLeftArrow className="h-5 w-5 flex-shrink-0 self-center" />
            <span className="hidden sm:inline text-sm">Home</span>
          </Link>
        </div>
        <div role="note" className="mb-6 rounded-md border border-indigo-200 bg-indigo-50 text-indigo-800 p-4">
          <p className="text-sm">
            Heads up: The external FunTranslations API limits Yoda and Pirate engines to 10 requests per hour. Feel free to surpass this limit ! the app will show a friendly message, plus you can keep going using cached results or switching to Alvaro's unlimited engine.
          </p>
        </div>
        <div className="flex items-start gap-6">
          <SidePane>
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="font-semibold text-zinc-700">Recent translations</h2>
              {loaderData.history.length > 1 && (
                <ButtonForm
                  component={fetcher.Form}
                  method="POST"
                  action="/translate"
                  fields={{ _intent: "clear_history" }}
                  label="Clear"
                />
              )}
            </div>
            <List>
              {loaderData.history.map((item) => (
                <ListItem
                  key={item.key}
                  title={item.originalText}
                  subtitle={`${item.engine}: ${item.translatedText}`}
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
      </section>
    </main>
  );
}
