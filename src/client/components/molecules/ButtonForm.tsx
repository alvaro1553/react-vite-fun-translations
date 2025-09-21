import type { ElementType, ComponentPropsWithoutRef } from "react";
import { LoadingSpinner } from "../atoms/LoadingSpinner";
import { Button } from "../atoms/Button";

export type ButtonFormProps<C extends ElementType> = Omit<ComponentPropsWithoutRef<C>, "children"> & {
  component?: C;
  label: string;
  loading?: boolean;
  // key/value pairs rendered as hidden inputs
  fields?: Record<string, string>;
};

export function ButtonForm<T extends ElementType>(props: ButtonFormProps<T>) {
  const {
    component: Component = 'form',
    label,
    loading = false,
    fields = {},
    ...rest
  } = props;

  return (
    <Component {...rest}>
      {/* keep layout minimal; caller controls placement */}
      {Object.entries(fields).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      <Button type="submit" disabled={loading} className="text-xs">
        {loading && <LoadingSpinner size="sm" />}
        <span>{label}</span>
      </Button>
    </Component>
  );
}
