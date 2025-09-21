import clsx from "clsx";

export interface ContentProps extends React.ComponentProps<'div'> {}

export function Content(props: ContentProps) {
  const { className, ...rest } = props;
  return (
    <div
      {...rest}
      className={clsx(
        "w-full h-full max-w-xl rounded-lg border border-zinc-200 bg-white/70 backdrop-blur p-6 text-zinc-800",
        className,
      )}
    />
  );
}
