import classNames from "classnames";

import { getPaddingLeftClass, getRandomWidthClass } from "./utils";

interface PlaceholderProps {
  /**
   * The level of the placeholder, used for indentation.
   */
  level: number;
}

/**
 * Component to render a placeholder element.
 */
export const Placeholder = ({ level }: PlaceholderProps) => {
  return (
    <div className={classNames('animate-pulse', 'pr-8', getPaddingLeftClass(level))}>
      <div className={classNames('py-2', getRandomWidthClass())}>
        <div className="bg-neutral-100">&nbsp;</div>
      </div>
    </div>
  );
};
