import { Form } from "react-router";
import Button from "../atoms/Button";
import Input from "../atoms/Input";

export function TranslateForm() {
  return (
    <Form method="post" action="/translate">
      <fieldset className="flex flex-col items-start gap-6">
        {/* implement translation engine here */}
        <Input name="text" placeholder="Enter the text to translate here" required/>
        <Button type="submit">Translate</Button>
      </fieldset>
    </Form>
  );
}