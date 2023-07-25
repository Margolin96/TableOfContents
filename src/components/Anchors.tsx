import classNames from "classnames";
import { useAtomValue } from "jotai";
import { useCallback, useMemo } from "react";

import { usePageAnchors } from "../store/api";
import { pagesAtom } from "../store/store";
import { PageId } from "../types/types"

import { Placeholder } from "./Placeholder";
import { getPaddingLeftClass } from "./utils";

interface AnchorsProps {
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

  // Fetch the page anchors for the specified page ID
  const anchors = usePageAnchors(pageId);

  // Page item click handler.
  const anchorClickHandler = useCallback((event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.preventDefault();
    event.stopPropagation();

    // TODO: set selected anchor
  }, []);

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
              getPaddingLeftClass(page.level)
            )}
            href={`${page.url}${anchor.anchor}`}
            title={anchor.title}
            onClick={anchorClickHandler}
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
