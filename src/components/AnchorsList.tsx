import classNames from "classnames";
import { useAtomValue } from "jotai";
import { PageId } from "../types"
import { pagesAtom } from "../store/store";
import { getPaddingLeftClass } from "./utils";
import { usePageAnchors } from "../store/api";
import { useMemo } from "react";
import { TreeMenuItemHolder } from "./TreeMenuItemHolder";

interface AnchorsListProps {
  pageId: PageId;
}

export const AnchorsList = ({ pageId }: AnchorsListProps) => {
  const pages = useAtomValue(pagesAtom);

  const page = useMemo(() => {
    return pages[pageId];
  }, [pageId, pages]);

  const anchors = usePageAnchors(pageId);

  return (
    <>
      {anchors.isLoading && page.anchors?.map((_, index) => (
        <TreeMenuItemHolder level={page.level + 1} key={index} />
      ))}

      {!anchors.isLoading && !anchors.error && anchors.data && (
        anchors.data.map((anchor) => (
          <div
            className={classNames(
              "pr-8",
              "py-2",
              "flex",
              "select-none",
              "transition",
              "cursor-pointer",
              "bg-neutral-100",
              "hover:bg-neutral-200",
              getPaddingLeftClass(anchor.level)
            )}
            onClick={() => {/* TODO */}}
            key={anchor.id}
          >
            <div className="w-4 flex flex-none"></div>
            <div className="text-ellipsis whitespace-nowrap overflow-hidden">
              {anchor.title}
              {/* TODO: get anchors by IP */}
            </div>
          </div>
        ))
      )}
    </>
  );
};
