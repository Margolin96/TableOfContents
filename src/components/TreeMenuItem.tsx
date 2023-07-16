import { useCallback, useState } from "react";
import { usePage } from "../store/store";
import { PageId } from "../types";
import { TreeMenu } from "./TreeMenu";

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
        <>
          <div className="py-2" onClick={clickHandler}>
            <div className="px-8">
              {page.data.pages ? '>' : null}
            </div>

            {page.data.title}
          </div>
          {isExpanded ? <div className="">
            <TreeMenu pages={page.data.pages} />
          </div> : null}
        </>
      )}
    </>
  )
};
