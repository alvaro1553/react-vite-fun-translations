import clsx from "clsx";

export interface ContentProps extends React.ComponentProps<'div'>{}

export default function Content(props: ContentProps) {
  const { className, ...rest } = props;
  return (
    <div
      {...rest}
      className={clsx(className, "bg-zinc-50 max-w-xl p-6 border border-zinc-100 w-full h-full rounded-lg text-gray-800")}
    />
  );
}
