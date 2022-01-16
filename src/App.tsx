import React, { useEffect } from 'react';
import './style/reset.css';
import './style/main.css';
import Minesweeper from './components/minesweeper/Minesweeper';
import useWindowWidth from './hooks/useScreenSize';

function App() {
   const windowSize = useWindowWidth();
   useEffect(() => {
      console.log('wid', windowSize);
   }, [windowSize]);
   return (
      <div className="App">
         <Minesweeper
            tileSize={Math.floor(windowSize.height <= windowSize.width ? windowSize.height / 22 : windowSize.width / 17)}
            height={20}
            width={14}
         />
      </div>
   );
}

export default App;
