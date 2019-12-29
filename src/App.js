import React from 'react';
import ToggleState from './components/ToggleState'
import LoadingDataState from './components/LoadingDataState'
import "./App.css"

const App = () => {
  return (
    <div>
      <ToggleState />
      <hr />
      <LoadingDataState />
    </div>
  );
}

export default App;