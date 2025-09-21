import clsx from "clsx";

export interface SidePaneProps extends React.ComponentProps<'div'>{}

export function SidePane(props: SidePaneProps) {
  const { className, ...rest } = props;
  return (
    <div
      {...rest}
      className={clsx(className, "bg-zinc-50/20 p-6 w-full max-w-xs flex-none")}
    />
  );
}
