import type { Route } from "./+types/translate";
import { TranslateForm } from "../translate/form";
import Content from "view/components/Content";
import SidePane from "view/components/Sidepane";
import { createDefaultFunTranslationService } from "io/service/FunTranslationService";

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
  const translationService = createDefaultFunTranslationService();
  const { translated } = await translationService.getTranslation(text);
  // should I do something with that request?

  return { error: null, translated };
}

export default function Translate(props: Route.ComponentProps) {
  const { actionData } = props;

  return (
    <div className="flex h-full py-3">
      <SidePane>It would be nice to see past translations here.</SidePane>
      <Content>
        <TranslateForm />
        {actionData?.error && <p className="text-red-500">{actionData.error}</p>}
        {actionData?.translated && <p className="text-green-500">{actionData.translated}</p>}
      </Content>
    </div>
  );
}
