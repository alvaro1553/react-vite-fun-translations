import clsx from "clsx";

export interface ButtonProps extends React.ComponentProps<'button'> {}

export function Button(props: ButtonProps) {
  const { className, ...rest } = props;
  return (
    <button
      {...rest}
      className={clsx(
        "inline-flex items-center gap-2 px-3 py-2 rounded-md border border-zinc-200 bg-white text-indigo-600 transition-colors hover:bg-indigo-50 hover:text-indigo-700 hover:cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 disabled:opacity-60 disabled:cursor-not-allowed",
        className,
      )}
    />
  );
}
