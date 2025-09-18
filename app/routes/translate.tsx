import type { Route } from "./+types/translate";
import { TranslateForm } from "../translate/form";
import Content from "view/components/Content";
import Sidepane from "view/components/Sidepane";
import { createDefaultFunTranslationService } from "io/service/FunTranslationService";
import { useActionData } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export const action = async ({ request }) => {
  const translationService = createDefaultFunTranslationService();
  const translation = await translationService.getTranslation("placeholder");
  // should I do something with that request?

  return translation;
};

export default function Translate() {
  const translation = useActionData();

  return (
    <div className="flex h-full py-3">
      <Sidepane>It would be nice to see past translations here.</Sidepane>
      <Content>
        <TranslateForm />
        {JSON.stringify(translation)}
      </Content>
    </div>
  );
}
