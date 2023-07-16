import { PageId } from "../types";
import { TreeMenuItem } from "./TreeMenuItem";

interface TreeMenuProps {
  pages: PageId[];
}

export const TreeMenu = ({ pages }: TreeMenuProps) => {
  return (
    <div className="tree-menu">
      {pages.map((pageId) => (
        <div className="" key={pageId}>
          <TreeMenuItem id={pageId} />
        </div>
      ))}
    </div>
  );
}