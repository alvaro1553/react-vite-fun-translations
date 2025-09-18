import Button from "view/components/Button";
import Input from "view/components/Input";

export function TranslateForm() {
  return (
    <form className="contents" method="POST" action="/translate">
      <fieldset className="flex flex-col items-start gap-6">
        {/* implement translation engine here */}
        <Input placeholder="Enter the text to translate here" />
        <Button type="submit">Translate</Button>
      </fieldset>
    </form>
  );
}
