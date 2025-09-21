import type { ElementType, ComponentPropsWithoutRef } from "react";
import { Button } from "../atoms/Button";
import { Input } from "../atoms/Input";
import { SuccessMessage } from "../atoms/SuccessMessage";
import { ErrorMessage } from "../atoms/ErrorMessage";
import { LoadingSpinner } from "../atoms/LoadingSpinner";

export type InputFormProps<C extends ElementType> = Omit<ComponentPropsWithoutRef<C>, "children"> & {
  component?: C;
  submit: string;
  loading?: boolean;
  success?: string | null;
  error?: string | null;
};

export function InputForm<T extends ElementType>(props: InputFormProps<T>) {
  const {
    component: Component = 'form',
    submit,
    loading = false,
    success = null,
    error = null,
    ...rest
  } = props;

  return (
    <Component {...rest}>
      <fieldset className="flex flex-col items-start gap-6" aria-busy={loading}>
        {/* implement translation engine here */}
        <Input name="text" placeholder="Enter the text to translate here" required/>
        <Button type="submit" disabled={loading} className="inline-flex items-center gap-2">
          {loading && <LoadingSpinner size="sm" />}
          <span>{submit}</span>
        </Button>
        {success && <SuccessMessage>{success}</SuccessMessage>}
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </fieldset>
    </Component>
  );
}