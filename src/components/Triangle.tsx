import classNames from "classnames";

interface TriangleProps {
  className?: string;
}

export const Triangle = ({ className }: TriangleProps) => {
  return (
    <div
      className={classNames(
        "transition",
        "h-0",
        "w-0",
        "border-x-4",
        "border-x-transparent",
        "border-b-[6px]",
        "border-b-black",
        className,
      )}
    />
  );
};
