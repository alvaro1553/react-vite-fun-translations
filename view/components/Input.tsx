import clsx from "clsx";

export default function Input({
  onChange,
  className,
  ...props
}: React.HTMLProps<HTMLInputElement>) {
  return (
    <input
      {...props}
      onChange={onChange}
      className={clsx("p-3 border border-gray-400 rounded-md", className)}
    />
  );
}
