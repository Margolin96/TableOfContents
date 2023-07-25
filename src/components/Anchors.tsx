import classNames from "classnames";
import { useAtomValue, useSetAtom } from "jotai";
import { useCallback, useMemo } from "react";

import { usePageAnchors } from "../store/api";
import { pagesAtom, selectedAnchorAtom } from "../store/store";
import { AnchorId, PageId } from "../types/types"

import { Placeholder } from "./Placeholder";
import { getPaddingLeftClass } from "./utils";

interface AnchorsProps {
  /**
   * The ID of the page containing anchors.
   */
  pageId: PageId;
}

/**
 * Component to render a list of anchors for a specific page.
 */
export const Anchors = ({ pageId }: AnchorsProps) => {
  const pages = useAtomValue(pagesAtom);

  const page = useMemo(() => {
    return pages[pageId];
  }, [pageId, pages]);

  const setSelectedAnchor = useSetAtom(selectedAnchorAtom);

  // Fetch the page anchors for the specified page ID
  const anchors = usePageAnchors(pageId);

  // Anchor item click handler.
  const anchorClickHandler = useCallback((
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    id: AnchorId
  ) => {
    event.preventDefault();
    event.stopPropagation();

    setSelectedAnchor(id);
  }, [setSelectedAnchor]);

  return (
    <>
      {anchors.isLoading && page.anchors?.map((_, index) => (
        <Placeholder key={index} level={page.level + 1} />
      ))}

      {!anchors.isLoading && !anchors.error && anchors.data && (
        anchors.data.map((anchor) => (
          <a
            key={anchor.id}
            className={classNames(
              "pr-8",
              "py-2",
              "flex",
              "transition",
              "cursor-pointer",
              "bg-neutral-100",
              "hover:bg-neutral-200",
              getPaddingLeftClass(anchor.level)
            )}
            href={`${page.url}${anchor.anchor}`}
            title={anchor.title}
            onClick={(event) => anchorClickHandler(event, anchor.id)}
          >
            <div className="w-4 flex flex-none"></div>
            <div className="text-ellipsis whitespace-nowrap overflow-hidden">
              {anchor.title}
            </div>
          </a>
        ))
      )}
    </>
  );
};
