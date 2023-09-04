import classNames from "classnames";
import { Provider, useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect, useMemo, useState } from "react";

import { pagesAtom, selectedAnchorAtom, selectedPageAtom } from "../store/store";
import { AnchorId, PageId, PagesData, PagesMap } from "../types/types";

import { Group } from "./Group";
import { Placeholder } from "./Placeholder";
import { Search } from "./Search";
import { getFilteredPages } from "./utils";

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

  /**
   * A function to handle the change of the selected page in the TOC.
   * @param {AnchorId | null} anchorId - The ID of the selected page or null if no page is selected.
   */
  onAnchorSelect?: (anchorId: AnchorId | null) => void;
}

/**
 * Component to render the table of contents.
 */
export const TOCWrapper = ({
  selectedId,
  pages,
  topLevelIds,
  onPageSelect,
  onAnchorSelect,
}: TOCProps) => {
  // Get the setter for the 'pages' state.
  const setPages = useSetAtom(pagesAtom);

  // Get the selected anchor ID.
  const selectedAnchor = useAtomValue(selectedAnchorAtom);

  // Get the getter/setter for the selected page ID.
  const [selectedPage, setSelectedPage] = useAtom(selectedPageAtom);

  // Effect to trigger the onPageSelect callback whenever the selected page changes.
  useEffect(() => {
    onPageSelect?.(selectedPage);
  }, [onPageSelect, selectedPage]);

  // Effect to trigger the onAnchorSelect callback whenever the selected anchor changes.
  useEffect(() => {
    onAnchorSelect?.(selectedAnchor);
  }, [onAnchorSelect, selectedAnchor]);

  // Effect to scroll into view currently selected page
  useEffect(() => {
    if (!selectedPage) return;
    const element = document.getElementById(selectedPage);

    if (!element) return;
    const { top, bottom } = element.getBoundingClientRect();

    if (top > 0 && bottom <= (window.innerHeight || document.documentElement.clientHeight)) return;

    element.scrollIntoView();
  }, [selectedPage]);

  // Effect to update the selected page ID whenever the 'selectedId' prop changes.
  useEffect(() => {
    setSelectedPage(selectedId || null);
  }, [selectedId, setSelectedPage]);

  // Effect to set the 'pages' state whenever the 'pages' prop changes.
  useEffect(() => {
    setPages(pages);
  }, [pages, setPages]);

  return (
    <Group items={topLevelIds} />
  );
};

/**
 * Component to wrap the TOCWrapper with the Jotai Provider.
 */
export const TOC = ({
  isLoading,
  isError,
  hasSearch,
  topLevelIds,
  selectedId,
  pages,
  onAnchorSelect,
  onPageSelect,
}: TOCProps) => {
  const [query, setQuery] = useState<string>('');

  const filtered = useMemo<PagesData>(() => {
    return hasSearch && query.trim()
      ? getFilteredPages(query, topLevelIds, pages)
      : { topLevelIds, pages };
  }, [hasSearch, pages, query, topLevelIds]);

  return (
    <>
      <div className="flex flex-col h-full">
        {hasSearch && (
          <div className="pt-6">
            <Search onChange={setQuery} />
          </div>
        )}

        {isLoading && (
          <div className={classNames({ 'pt-6': !hasSearch })}>
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
          </div>
        )}

        {!isLoading && isError && (
          <div className="px-6 py-2 text-red-400 italic text-sm mt-6 leading-7">
            Unable to load table of contents
          </div>
        )}

        {!isLoading && !isError && (
          <div className={classNames(
            'overflow-auto',
            'scroll-smooth',
            'scroll-p-6',
            { 'pt-6': !hasSearch }
          )}>
            <Provider>
              <TOCWrapper
                hasSearch={hasSearch}
                isError={isError}
                isLoading={isLoading}
                pages={filtered.pages}
                selectedId={selectedId}
                topLevelIds={filtered.topLevelIds}
                onAnchorSelect={onAnchorSelect}
                onPageSelect={onPageSelect}
              />
            </Provider>
          </div>
        )}
      </div>
    </>
  );
};
