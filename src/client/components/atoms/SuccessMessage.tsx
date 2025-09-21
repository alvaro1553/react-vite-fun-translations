import clsx from "clsx";

export interface SuccessMessageProps extends React.ComponentProps<'div'>{}

export function SuccessMessage(props: SuccessMessageProps) {
  const { className, ...rest } = props;
  return <div {...rest} className={clsx(className, "text-green-500")}/>
}
