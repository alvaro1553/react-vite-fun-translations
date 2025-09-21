import clsx from "clsx";

export interface SidePaneProps extends React.ComponentProps<'div'> {}

export function SidePane(props: SidePaneProps) {
  const { className, ...rest } = props;
  return (
    <div
      {...rest}
      className={clsx(
        "w-full md:basis-2/5 md:flex-none md:max-w-none rounded-lg border border-zinc-200 bg-white/70 backdrop-blur p-6",
        className,
      )}
    />
  );
}
