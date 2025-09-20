import clsx from "clsx";

export interface ButtonProps extends React.ComponentProps<'button'>{}

export default function Button(props: ButtonProps) {
  const { className, ...rest } = props;
  return (
    <button
      {...rest}
      className={clsx(className, "p-3 border border-amber-400 bg-amber-50  rounded-md")}
    />
  );
}
