import clsx from "clsx";
import React from "react";

export interface MenuItemProps extends React.ComponentProps<'button'> {}

export function MenuItem(props: MenuItemProps) {
  const { className, children, ...rest } = props;
  return (
    <button
      type="button"
      {...rest}
      className={clsx(
        "w-full text-left px-3 py-2 text-sm rounded hover:bg-indigo-50 focus:outline-none focus:bg-indigo-50",
        className
      )}
    >
      {children}
    </button>
  );
}
