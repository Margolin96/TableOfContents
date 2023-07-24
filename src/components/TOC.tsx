import { Provider, useAtom, useSetAtom } from "jotai";
import { useEffect } from "react";

import { pagesAtom, selectedPageAtom } from "../store/store";
import { PageId, PagesMap } from "../types";

import { Group } from "./Group";
import { Placeholder } from "./Placeholder";

interface TOCProps {
  /**
   * Indicates whether the TOC (table of contents) data is currently being loaded.
   */
  isLoading: Boolean;

  /**
   * Indicates whether an error occurred while loading the TOC data.
   */
  isError: Boolean;

  /**
   * The ID of the selected page in the TOC.
   */
  selectedId?: PageId;

  /**
   * A map containing the data of all pages in the TOC.
   */
  pages: PagesMap;

  /**
   * An array of top-level page IDs in the TOC.
   */
  topLevelIds: PageId[];

  /**
   * A function to handle the change of the selected page in the TOC.
   * @param {PageId | null} pageId - The ID of the selected page or null if no page is selected.
   */
  onPageSelect?: (pageId: PageId | null) => void;
}

/**
 * Component to render the table of contents.
 */
export const TOCWrapper = ({
  isLoading,
  isError,
  selectedId,
  pages,
  topLevelIds,
  onPageSelect,
}: TOCProps) => {
  // Get the setter for the 'pages' state.
  const setPages = useSetAtom(pagesAtom);

  // Get the getter/setter for the selected page ID.
  const [selected, setSelected] = useAtom(selectedPageAtom);

  // Effect to trigger the onPageSelect callback whenever the selected page changes.
  useEffect(() => {
    onPageSelect?.(selected);
  }, [onPageSelect, selected]);

  // Effect to update the selected page ID whenever the 'selectedId' prop changes.
  useEffect(() => {
    if (selectedId !== undefined) {
      setSelected(selectedId);
    }
  }, [selectedId, setSelected]);

  // Effect to set the 'pages' state whenever the 'pages' prop changes.
  useEffect(() => {
    setPages(pages);
  }, [pages, setPages]);

  return (
    <>
      {isLoading && <>
        <Placeholder level={0} />
        <Placeholder level={1} />
        <Placeholder level={1} />
        <Placeholder level={1} />
        <Placeholder level={2} />
        <Placeholder level={2} />
        <Placeholder level={2} />
        <Placeholder level={2} />
        <Placeholder level={0} />
        <Placeholder level={0} />
      </>}

      {!isLoading && isError && (
        <div className="px-6 py-2 text-red-400 italic text-sm">
          Unable to load table of contents
        </div>
      )}

      {!isLoading && !isError && (
        <Group items={topLevelIds} />
      )}
    </>
  );
};

/**
 * Component to wrap the TOCWrapper with the Jotai Provider.
 */
export const TOC = (props: TOCProps) => {
  return (
    <Provider>
      <TOCWrapper {...props} />
    </Provider>
  );
};
