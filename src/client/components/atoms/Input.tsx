import clsx from "clsx";

export interface InputProps extends React.ComponentProps<'input'> {}

export function Input(props: InputProps) {
  const { className, ...rest } = props;
  return (
    <input
      {...rest}
      className={clsx(
        "w-full px-3 py-2 rounded-md border border-zinc-300 bg-white placeholder-zinc-400 text-zinc-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus:border-indigo-300",
        className,
      )}
    />
  );
}
