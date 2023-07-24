import React from 'react';
import './App.css';
import { TreeMenu } from './components/TreeMenu';
import { usePages, useTopLevelIds } from './store/store';

export default function App() {
  const pages = usePages();
  const topLevelIds = useTopLevelIds();

  return (
    <div className="flex flex-col min-h-screen">
      <div className="px-8 py-6 border-b-2">
        Header
      </div>

      <div className="flex flex-1">
        <div className="border-r-2 py-6 w-[280px]">
          <TreeMenu
            isLoading={pages.isLoading || topLevelIds.isLoading}
            isError={pages.error || topLevelIds.error}
            pages={pages.data || {}}
            topLevelIds={topLevelIds.data || []}
          />
        </div>

        <div className="p-8">
          Content
        </div>
      </div>
    </div>
  );
}
