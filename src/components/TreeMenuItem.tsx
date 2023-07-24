import classNames from "classnames";
import { useCallback, useMemo } from "react";
import { AnchorId, PageId } from "../types";
import { TreeMenuGroup } from "./TreeMenuGroup";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { expandedIdsAtom, pagesAtom, selectedPageAtom, updateExpandedByIdAtom } from "../store/store";
import { Triangle } from "./Triangle";
import { AnchorsList } from "./AnchorsList";
import { getPaddingLeftClass } from "./utils";

interface TreeMenuItemProps {
  id: PageId | AnchorId;
}

export const TreeMenuItem = ({ id }: TreeMenuItemProps) => {
  const [selected, setSelected] = useAtom(selectedPageAtom);
  const setExpanded = useSetAtom(updateExpandedByIdAtom);
  const expanded = useAtomValue(expandedIdsAtom);
  const pages = useAtomValue(pagesAtom);

  const page = useMemo(() => {
    return (id in pages) ? pages[id] : null;
  }, [pages, id]);

  const isSelected = useMemo(() => {
    return page?.id === selected;
  }, [page?.id, selected]);

  const isExpanded = useMemo(() => {
    return page && expanded.has(page.id);
  }, [expanded, page]);

  const hasPages = useMemo(() => {
    return page?.pages && page.pages.length > 0;
  }, [page?.pages]);

  const hasAnchors = useMemo(() => {
    return page?.anchors && page.anchors.length > 0;
  }, [page?.anchors]);

  const pageClickHandler = useCallback(() => {
    if (page) {
      setSelected(page.id);
    }

    if (page && hasPages) {
      setExpanded(page.id, !isExpanded);
    }
  }, [page, hasPages, setSelected, setExpanded, isExpanded]);

  return page && (
    <div>
      <div
        className={classNames(
          "pr-8",
          "py-2",
          "flex",
          "transition",
          getPaddingLeftClass(page.level),
          {
            "font-semibold": isSelected,
            "cursor-pointer": hasPages || !isSelected,
            "hover:bg-neutral-100": hasPages || !isSelected,
            "bg-neutral-100": isSelected && hasAnchors,
          }
        )}
        onClick={pageClickHandler}
      >
        <div className="w-4 flex flex-none flex-col justify-center">
          {page.pages && (
            <Triangle className={isExpanded ? 'rotate-180' : 'rotate-90'} />
          )}
        </div>

        <div className="text-ellipsis whitespace-nowrap overflow-hidden">
          {page.title}
        </div>
      </div>

      {isSelected && hasAnchors && <AnchorsList pageId={page.id} />}

      {isExpanded && page.pages && <TreeMenuGroup items={page.pages} />}
    </div>
  );
};
