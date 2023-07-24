import classNames from "classnames";
import { getPaddingLeftClass, getRandomWidthClass } from "./utils";

interface TreeMenuItemHolderProps {
  level: number;
}

export const TreeMenuItemHolder = ({ level }: TreeMenuItemHolderProps) => {
  return (
    <div className={classNames('animate-pulse', 'pr-8', getPaddingLeftClass(level))}>
      <div className={classNames('py-2', getRandomWidthClass())}>
        <div className="bg-neutral-100">&nbsp;</div>
      </div>
    </div>
  );
};
