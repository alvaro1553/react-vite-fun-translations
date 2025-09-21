import clsx from "clsx";

export interface ErrorMessageProps extends React.ComponentProps<'div'>{}

export function ErrorMessage(props: ErrorMessageProps) {
  const { className, ...rest } = props;
  return <div {...rest} className={clsx(className, "text-red-500")}/>
}
