import { PageId } from "../types";

import { PageItem } from "./PageItem";

interface GroupProps {
  /**
   * An array of page IDs.
   */
  items: PageId[];
}

/**
 * Component to render a group of pages.
 */
export const Group = ({ items }: GroupProps) => {
  return (
    <>
      {items.map((itemId) => (
        <PageItem key={itemId} id={itemId} />
      ))}
    </>
  );
};
