import type { ElementType, ComponentPropsWithoutRef } from "react";
import { LoadingSpinner } from "../atoms/LoadingSpinner";

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
      <button
        type="submit"
        disabled={loading}
        className="text-xs bg-red-600 text-white px-2 py-1 rounded shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1 inline-flex items-center gap-1"
      >
        {loading && <LoadingSpinner size="sm" />}
        <span>{label}</span>
      </button>
    </Component>
  );
}
