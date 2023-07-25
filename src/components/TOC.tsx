import classNames from "classnames";
import { Provider, useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";

import { filteredPagesAtom, pagesAtom, queryAtom, selectedPageAtom } from "../store/store";
import { PageId, PagesMap } from "../types/types";

import { Group } from "./Group";
import { PageItem } from "./PageItem";
import { Placeholder } from "./Placeholder";
import { Search } from "./Search";

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
   * Indicates whether a search functionality is available in the TOC.
   */
  hasSearch?: Boolean;

  /**
   * The ID of the selected page in the TOC.
   */
  selectedId?: PageId | null;

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
  hasSearch,
  selectedId,
  pages,
  topLevelIds,
  onPageSelect,
}: TOCProps) => {
  const filteredPages = useAtomValue(filteredPagesAtom);
  const query = useAtomValue(queryAtom);

  // Get the setter for the 'pages' state.
  const setPages = useSetAtom(pagesAtom);

  // Get the getter/setter for the selected page ID.
  const [selected, setSelected] = useAtom(selectedPageAtom);

  // Effect to trigger the onPageSelect callback whenever the selected page changes.
  useEffect(() => {
    onPageSelect?.(selected);
  }, [onPageSelect, selected]);

  // Effect to scroll into view currently selected page
  useEffect(() => {
    if (!selected) return;
    const element = document.getElementById(selected);

    if (!element) return;
    const { top, bottom } = element.getBoundingClientRect();

    if (top > 0 && bottom <= (window.innerHeight || document.documentElement.clientHeight)) return;

    element.scrollIntoView();
  }, [selected]);

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
        <div className="flex flex-col h-full">
          {hasSearch && <div className="pt-6"><Search /></div>}

          <div className={classNames(
            'overflow-auto',
            'scroll-smooth',
            'scroll-p-6',
            'pb-6',
            { 'pt-6': !hasSearch }
          )}>
            {hasSearch && query && filteredPages.map((page, index) => (
              <PageItem key={index} id={page.id} />
            ))}

            {(!hasSearch || !query) && <Group items={topLevelIds} />}
          </div>
        </div>
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
