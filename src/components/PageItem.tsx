import classNames from "classnames";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useCallback, useMemo } from "react";

import { expandedIdsAtom, pagesAtom, selectedPageAtom, updateExpandedByIdAtom } from "../store/store";
import { PageId } from "../types";

import { AnchorsList } from "./AnchorsList";
import { Group } from "./Group";
import { Triangle } from "./Triangle";
import { getPaddingLeftClass } from "./utils";

interface PageItemProps {
  /**
   * The ID of the page to be rendered.
   */
  id: PageId;
}

/**
 * Component to render a single page item.
 */
export const PageItem = ({ id }: PageItemProps) => {
  // Get the getter/setter for the selected page ID.
  const [selected, setSelected] = useAtom(selectedPageAtom);

  // Get the setter for the expanded state.
  const setExpanded = useSetAtom(updateExpandedByIdAtom);

  // Get the current expanded state.
  const expanded = useAtomValue(expandedIdsAtom);

  // Get the current pages state.
  const pages = useAtomValue(pagesAtom);

  // Get the page data.
  const page = useMemo(() => {
    return (id in pages) ? pages[id] : null;
  }, [pages, id]);

  // Determine if the page is currently selected.
  const isSelected = useMemo(() => {
    return page?.id === selected;
  }, [page?.id, selected]);

  // Determine if the page is expanded.
  const isExpanded = useMemo(() => {
    return page && expanded.has(page.id);
  }, [expanded, page]);

  // Determine if the page has child pages.
  const hasPages = useMemo(() => {
    return page?.pages && page.pages.length > 0;
  }, [page?.pages]);

  // Determine if the page has anchors.
  const hasAnchors = useMemo(() => {
    return page?.anchors && page.anchors.length > 0;
  }, [page?.anchors]);

  // Page item click handler.
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

      {isExpanded && page.pages && <Group items={page.pages} />}
    </div>
  );
};
