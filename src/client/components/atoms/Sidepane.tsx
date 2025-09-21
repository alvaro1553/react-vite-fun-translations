import clsx from "clsx";

export interface SidePaneProps extends React.ComponentProps<'div'>{}

export default function Content(props: SidePaneProps) {
  const { className, ...rest } = props;
  return (
    <div
      {...rest}
      className={clsx(className, "bg-zinc-50/20 max-w-sm p-6")}
    />
  );
}
