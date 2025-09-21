import clsx from "clsx";
import React from "react";

export interface ListItemProps extends React.ComponentProps<'li'> {
  title?: string;
  subtitle?: string;
  right?: React.ReactNode;
}

export function ListItem(props: ListItemProps) {
  const { className, title, subtitle, right, children, ...rest } = props;
  const hasStructured = typeof title !== "undefined";
  return (
    <li {...rest} className={clsx("flex items-start justify-between gap-2", className)}>
      {hasStructured ? (
        <>
          <div className="text-sm">
            <div className="font-medium truncate max-w-[14rem]" title={title}>{title}</div>
            {typeof subtitle !== "undefined" && (
              <div className="text-zinc-500 truncate max-w-[14rem]" title={subtitle}>{subtitle}</div>
            )}
          </div>
          {right}
        </>
      ) : (
        children
      )}
    </li>
  );
}
