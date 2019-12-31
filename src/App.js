import React from 'react';
import ToggleState from './components/ToggleState'
import LoadingDataState from './components/LoadingDataState'
import VideoPlayer from './components/VideoPlayer'
import "./App.css"

const App = () => {
  return (
    <div>
      <ToggleState />
      <hr />
      <VideoPlayer />
      <hr />
      <LoadingDataState />
    </div>
  );
}

export default App;