import React from 'react';
import Landing from './components/Landing';
import Debug from './components/Debug';
import './index.css';

const App: React.FC = () => {
  return (
    <>
      <Landing />
      <Debug />
    </>
  );
};

export default App;