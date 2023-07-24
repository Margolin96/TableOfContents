import { AnchorId, PageId } from "../types";
import { TreeMenuItem } from "./TreeMenuItem";

interface TreeMenuGroupProps {
  items: Array<PageId | AnchorId>;
}

export const TreeMenuGroup = ({ items }: TreeMenuGroupProps) => {
  return (
    <>
      {items.map((itemId) => (
        <TreeMenuItem id={itemId} key={itemId} />
      ))}
    </>
  );
}