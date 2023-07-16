import React from 'react';
import './App.css';
import { TreeMenu } from './components/TreeMenu';
import { useTopLevelIds } from './store/store';

function App() {
  const topLevelIds = useTopLevelIds();

  return (
    <div className="container">
      <div className="sidebar">
        {topLevelIds.isLoading && 'Loading'}
        {!topLevelIds.isLoading && !topLevelIds.data && 'Error'}
        {!topLevelIds.isLoading && topLevelIds.data && <TreeMenu pages={topLevelIds.data} />}
      </div>
      <div className="container"></div>
    </div>
  );
}

export default App;
