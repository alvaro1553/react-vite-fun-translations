import type { ElementType, ComponentPropsWithoutRef } from "react";
import { Button } from "../atoms/Button";
import { Input } from "../atoms/Input";
import { SuccessMessage } from "../atoms/SuccessMessage";
import { ErrorMessage } from "../atoms/ErrorMessage";
import { LoadingSpinner } from "../atoms/LoadingSpinner";
import { MenuButton } from "../atoms/MenuButton";
import { MenuItem } from "../atoms/MenuItem";

export type InputFormProps<C extends ElementType> = Omit<ComponentPropsWithoutRef<C>, "children"> & {
  component?: C;
  inputName?: string;
  inputPlaceholder?: string;
  submitLabel: string;
  submitLoading?: boolean;
  submitSuccess?: string | null;
  submitError?: string | null;
  menuLabel: string;
  menuOptions: { key: string; label: string }[];
  menuButtonAriaLabel?: string;
  menuOptionName?: string;
  menuActiveKey: string;
  onMenuSelect: (key: string) => void;
};

export function InputForm<T extends ElementType>(props: InputFormProps<T>) {
  const {
    component: Component = 'form',
    inputName = "text",
    inputPlaceholder = "Enter the text to translate here",
    submitLabel,
    submitLoading = false,
    submitSuccess = null,
    submitError = null,
    menuLabel,
    menuOptions,
    menuButtonAriaLabel = "Choose menu option",
    menuOptionName = "engine",
    menuActiveKey,
    onMenuSelect,
    ...rest
  } = props;

  const activeItem = menuOptions.find(mi => mi.key === menuActiveKey);
  const currentLabel = activeItem?.label ?? menuActiveKey;

  return (
    <Component {...rest}>
      <fieldset className="flex flex-col items-start gap-6" aria-busy={submitLoading}>
        <Input name={inputName} placeholder={inputPlaceholder} required/>
        <input type="hidden" name={menuOptionName} value={menuActiveKey} />
        <div className="inline-flex items-stretch gap-2">
          <Button type="submit" disabled={submitLoading} className="inline-flex items-center gap-2">
            {submitLoading && <LoadingSpinner size="sm" />}
            <span>{submitLabel}</span>
          </Button>
          <div className="inline-flex items-center gap-2">
            <span className="text-sm text-zinc-600">{menuLabel}</span>
            <MenuButton
              buttonAriaLabel={menuButtonAriaLabel}
              buttonChildren={
                <span className="inline-flex items-center gap-1">
                  <span>{currentLabel}</span>
                  <span aria-hidden>▼</span>
                </span>
              }
            >
              {menuOptions.map((mi) => (
                <MenuItem key={mi.key} onClick={() => onMenuSelect(mi.key)}>
                  {mi.label}
                </MenuItem>
              ))}
            </MenuButton>
          </div>
        </div>
        {submitSuccess && <SuccessMessage>{submitSuccess}</SuccessMessage>}
        {submitError && <ErrorMessage>{submitError}</ErrorMessage>}
      </fieldset>
    </Component>
  );
}