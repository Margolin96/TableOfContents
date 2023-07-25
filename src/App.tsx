import { useCallback, useState } from 'react';

import { TOC } from './components/TOC';
import { usePages, useTopLevelIds } from './store/api';
import { AnchorId, PageId } from './types/types';

/**
 * App component that renders the application's main view.
 */
export default function App(): JSX.Element {
  const pages = usePages();
  const topLevelIds = useTopLevelIds();

  // State for the selected page ID and search visibility.
  const [selectedPage, setSelectedPage] = useState<PageId | null>(null);
  const [selectedAnchor, setSelectedAnchor] = useState<AnchorId | null>(null);
  const [hasSearch, setHasSearch] = useState<Boolean>(false);

  // Function to toggle the search visibility.
  const toggleSearch = useCallback(() => {
    setHasSearch((v) => !v);
  }, []);

  // Function to select a random page.
  const toggleSelectedPage = useCallback(() => {
    if (!pages.data) return;
    const ids = Object.keys(pages.data);

    setSelectedPage(ids[Math.floor(Math.random() * ids.length)]);
  }, [pages.data]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-8 py-6 border-b-2 border-neutral-200">
        Header
      </div>

      <div className="flex flex-1 h-full overflow-hidden">
        {/* Table of Contents */}
        <div className="border-r-2 w-[280px] border-neutral-200">
          <TOC
            hasSearch={hasSearch}
            isError={pages.error || topLevelIds.error}
            isLoading={pages.isLoading || topLevelIds.isLoading}
            pages={pages.data || {}}
            selectedId={selectedPage}
            topLevelIds={topLevelIds.data || []}
            onAnchorSelect={setSelectedAnchor}
            onPageSelect={setSelectedPage}
          />
        </div>

        <div className="p-8 overflow-auto flex-1">
          {/* Main content */}
          <h1 className="text-xl">Table of Contents demo</h1>

          {pages.data && (
            <>
              <div className="pt-6">
                <div className="flex items-center gap-2">
                  <span className="whitespace-nowrap">Has search:</span>

                  <code className="text-sm text-ellipsis overflow-hidden">
                    {hasSearch ? 'true' : 'false'}
                  </code>
                </div>

                <button
                  className="underline underline-offset-4 text-blue-700 hover:text-blue-500"
                  onClick={toggleSearch}
                >
                  Toggle search
                </button>
              </div>

              <div className="pt-6">
                <div className="flex items-center gap-2">
                  <span className="whitespace-nowrap">Page with anchors - "Getting started &raquo; Accessibility"</span>
                </div>

                <button
                  className="underline underline-offset-4 text-blue-700 hover:text-blue-500"
                  onClick={() => setSelectedPage('Accessibility')}
                >
                  Open
                </button>
              </div>

              <div className="pt-6">
                <div className="flex items-center gap-2">
                  <span className="whitespace-nowrap">Selected page ID:</span>

                  <code className="text-sm text-ellipsis overflow-hidden">
                    {selectedPage || 'null'}
                  </code>
                </div>

                <button
                  className="underline underline-offset-4 text-blue-700 hover:text-blue-500"
                  onClick={toggleSelectedPage}
                >
                  Select random page
                </button>
              </div>

              <div className="pt-6">
                <div className="flex items-center gap-2">
                  <span className="whitespace-nowrap">Selected anchor ID:</span>

                  <code className="text-sm text-ellipsis overflow-hidden">
                    {selectedAnchor || 'null'}
                  </code>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
