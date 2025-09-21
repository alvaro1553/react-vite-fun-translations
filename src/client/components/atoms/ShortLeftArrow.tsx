import clsx from "clsx";
import type { SVGProps } from "react";

export interface ShortLeftArrowProps extends SVGProps<SVGSVGElement> {}

export function ShortLeftArrow({ className, ...rest }: ShortLeftArrowProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={clsx("h-5 w-5 flex-shrink-0 self-center", className)}
      {...rest}
    >
      <path
        d="M15 19l-7-7 7-7"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
