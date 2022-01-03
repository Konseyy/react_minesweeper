import React from 'react';
import logo from './logo.svg';
import './style/reset.css'
import './style/App.css';
import Minesweeper from './components/minesweeper/Minesweeper';

function App() {
  return (
    <div className="App">
      <Minesweeper tileSize={25} height={15} width={12} />
    </div>
  );
}

export default App;
