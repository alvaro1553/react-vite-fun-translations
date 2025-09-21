import clsx from "clsx";
import React from "react";

export interface ListProps extends React.ComponentProps<'ul'> {}

export function List(props: ListProps) {
  const { className, ...rest } = props;
  return (
    <ul
      {...rest}
      className={clsx("space-y-2", className)}
    />
  );
}
