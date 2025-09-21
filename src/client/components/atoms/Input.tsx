import clsx from "clsx";

export interface InputProps extends React.ComponentProps<'input'>{}

export function Input(props: InputProps) {
  const { className, ...rest } = props;
  return (
    <input
      {...rest}
      className={clsx(className, "p-3 border border-gray-400 rounded-md")}
    />
  );
}
