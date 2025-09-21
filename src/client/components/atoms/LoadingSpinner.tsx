import clsx from "clsx";
import * as React from "react";

export type SpinnerSize = "sm" | "md" | "lg" | number; // number interpreted as pixels

export interface LoadingSpinnerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  size?: SpinnerSize;
}

export function LoadingSpinner({ size = "md", className, ...rest }: LoadingSpinnerProps) {
  const sizeClass =
    size === "sm"
      ? "h-4 w-4 border-2"
      : size === "md"
      ? "h-6 w-6 border-2"
      : size === "lg"
      ? "h-8 w-8 border-2"
      : undefined;

  const style =
    typeof size === "number"
      ? ({
          width: `${size}px`,
          height: `${size}px`,
          borderWidth: Math.max(2, Math.round(size / 12)),
        } satisfies React.CSSProperties)
      : undefined;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={clsx(
        "inline-block rounded-full border-current border-t-transparent animate-spin text-indigo-600",
        sizeClass,
        className
      )}
      style={style}
      {...rest}
    >
      <span className="sr-only">Loading…</span>
    </div>
  );
}
