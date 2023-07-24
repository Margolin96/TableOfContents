import { PageId, PagesMap } from "../types";
import { pagesAtom, selectedPageAtom } from "../store/store";
import { TreeMenuGroup } from "./TreeMenuGroup";
import { Provider, useAtom, useSetAtom } from "jotai";
import { TreeMenuItemHolder } from "./TreeMenuItemHolder";
import { useEffect } from "react";

interface TreeMenuProps {
  isLoading: Boolean;
  isError: Boolean;
  selectedId?: PageId;
  pages: PagesMap;
  topLevelIds: PageId[];
  onPageSelect?: (pageId: PageId | null) => void;
}

export const TreeMenu = (props: TreeMenuProps) => {
  return (
    <Provider>
      {props.isLoading && <>
        <TreeMenuItemHolder level={0} />
        <TreeMenuItemHolder level={1} />
        <TreeMenuItemHolder level={1} />
        <TreeMenuItemHolder level={1} />
        <TreeMenuItemHolder level={2} />
        <TreeMenuItemHolder level={2} />
        <TreeMenuItemHolder level={2} />
        <TreeMenuItemHolder level={2} />
        <TreeMenuItemHolder level={0} />
        <TreeMenuItemHolder level={0} />
      </>}

      {!props.isLoading && props.isError && (
        <div className="px-6 py-2 text-red-400 italic text-sm">
          Unable to load table of contents
        </div>
      )}

      {!props.isLoading && !props.isError && (
        <TreeMenuWrapper {...props} />
      )}
    </Provider>
  );
};

export const TreeMenuWrapper = ({
  selectedId,
  pages,
  topLevelIds,
  onPageSelect,
}: TreeMenuProps) => {
  const setPages = useSetAtom(pagesAtom);
  const [selected, setSelected] = useAtom(selectedPageAtom);

  useEffect(() => {
    onPageSelect?.(selected);
  }, [onPageSelect, selected]);

  useEffect(() => {
    if (selectedId !== undefined) {
      setSelected(selectedId);
    }
  }, [selectedId, setSelected]);

  useEffect(() => {
    setPages(pages);
  }, [pages, setPages]);

  return (
    <>
      <TreeMenuGroup items={topLevelIds} />
    </>
  );
};
