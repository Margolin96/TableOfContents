import { PageId, PagesMap } from "../types";
import { TreeMenuGroup } from "./TreeMenuGroup";
import { Provider } from "jotai";
import { TreeMenuItemHolder } from "./TreeMenuItemHolder";

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
  topLevelIds,
}: TreeMenuProps) => {
  return (
    <>
      <TreeMenuGroup items={topLevelIds} />
    </>
  );
};
