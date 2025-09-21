import React, { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { Button } from "./Button";

export interface MenuButtonProps extends React.ComponentProps<"div"> {
  buttonAriaLabel?: string;
  buttonClassName?: string;
  buttonChildren?: React.ReactNode;
}

export function MenuButton(props: MenuButtonProps) {
  const {
    className,
    buttonAriaLabel = "Open menu",
    buttonClassName,
    buttonChildren,
    children,
    ...rest
  } = props;

  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!ref.current) return;
      if (open && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  return (
    <div
      {...rest}
      ref={ref}
      className={clsx("relative inline-block text-left", className)}
    >
      <Button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={buttonAriaLabel}
        onClick={() => setOpen((o) => !o)}
        className={clsx(
          "hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-300",
          buttonClassName,
        )}
      >
        {buttonChildren ?? (
          <span className="inline-block align-middle" aria-hidden>
            ▼
          </span>
        )}
      </Button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-10 mt-2 w-44 origin-top-right rounded-md border border-zinc-200 bg-white shadow-lg focus:outline-none"
        >
          <ul className="py-1">
            {React.Children.map(children, (child) => (
              <li className="px-1" onClick={() => setOpen(false)}>
                {child}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
