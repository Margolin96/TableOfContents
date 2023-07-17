import { useCallback, useState } from "react";
import { usePage } from "../store/store";
import { PageId } from "../types";
import { TreeMenu } from "./TreeMenu";
import classNames from "classnames";

interface TreeMenuItemProps {
  id: PageId;
}

export const TreeMenuItem = ({ id }: TreeMenuItemProps) => {
  const [isExpanded, setIsExpanded] = useState<Boolean>(false);
  const page = usePage(id);

  const clickHandler = useCallback(() => {
    if (!page.data?.pages) return;

    setIsExpanded((isExpanded) => !isExpanded)
  }, [page.data?.pages]);

  return (
    <>
      {page.isLoading && <div className="bg-blue-500">Loading</div>}

      {!page.isLoading && !page.data && 'Error'}

      {!page.isLoading && page.data && (
        <div>
          <div
            className={classNames(
              'pr-8',
              'py-2',
              'flex',
              'select-none',
              'hover:bg-slate-200',
              { 'cursor-pointer': page.data.pages },
              `pl-${Math.min(64, 8 + 4 * page.data.level)}`,
            )}
            onClick={clickHandler}
          >
            <div className="w-4 flex flex-col justify-center">
              {page.data.pages && (
                <div className={classNames(
                  'transition',
                  'h-0',
                  'w-0',
                  'border-x-4',
                  'border-x-transparent',
                  'border-b-[6px]',
                  'border-b-black',
                  {
                    'rotate-90': !isExpanded,
                    'rotate-180': isExpanded
                  }
                )} />
              )}
            </div>

            {page.data.title}
          </div>
          {isExpanded && (
            <TreeMenu pages={page.data.pages} />
          )}
        </div>
      )}
    </>
  )
};
