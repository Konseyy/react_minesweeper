import React from 'react';
import './style/reset.css';
import './style/main.css';
import useIsMobile from './hooks/useIsMobile';
import Minesweeper from './components/minesweeper/Minesweeper';
import ContentCard from './components/ContentCard';

function App() {
   const isMobile = useIsMobile();
   return (
      <div className="App">
         {/* <Minesweeper tileSize={25} height={15} width={12} /> */}
         <ContentCard
            title="GitHub"
            annotation="Here you can find the source code for this website as well as other personal projects of mine"
            header="My GitHub profile"
            imgFile={require('./img/github.png')}
            backgroundColor="linear-gradient(45deg, rgba(23, 23, 23, .95), rgba(48, 48, 48, .95))"
            fontColor="white"
            isMobile={isMobile}
            link="https://github.com/Konseyy"
         />
         <ContentCard
            title="ShiftLog"
            annotation="Mobile application made with React Native and TypeScript for tracking work shifts"
            footer="Available on Google Play Store"
            imgUrl={require('./img/shiftlog.png')}
            backgroundColor="linear-gradient(20deg, rgba(39, 26, 43 ,.95), rgba(57, 0, 74,.95))"
            fontColor="white"
            isMobile={isMobile}
            link="https://github.com/Konseyy"
         />
         <ContentCard
            title="This Website"
            header="My personal portfolio website"
            annotation="Made with React.js and Typescript"
            imgUrl={require('./img/react.png')}
            backgroundColor="linear-gradient(-65deg,rgba(4, 21, 48,.9),rgba(0, 23, 74,.9))"
            fontColor="white"
            isMobile={isMobile}
            link="https://github.com/Konseyy/portfolio_site"
         />
      </div>
   );
}

export default App;
