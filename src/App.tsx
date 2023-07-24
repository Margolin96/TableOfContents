import './App.css';
import { TOC } from './components/TOC';
import { usePages, useTopLevelIds } from './store/api';

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
          <TOC
            isError={pages.error || topLevelIds.error}
            isLoading={pages.isLoading || topLevelIds.isLoading}
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
