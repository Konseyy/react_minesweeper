import React, { FC, useEffect, useMemo, useState } from 'react';
interface Props {
   height?: number;
   width?: number;
   mines?: number;
   tileSize?: number;
}
type square = {
   adjacent: number;
   isMine: boolean;
   clicked: boolean;
   flagged: boolean;
};

const Minesweeper: FC<Props> = ({ height = 5, width = 5, mines, tileSize = 20 }) => {
   useEffect(() => {
      let l1;
      l1 = document.addEventListener(
         'contextmenu',
         (e) => {
            console.log('blocking context menu');
            e.preventDefault();
         },
         false
      );
      return l1;
   });
   const SPACE_AROUND_FIRST_CLICK = 3;
   const [grid, setGrid] = useState<Array<Array<square>>>([]);
   // const [timer, setTimer] = useState(0);
   const [gameOver, setGameOver] = useState<{
      gameOver: boolean;
      playerWon: boolean;
   }>({ gameOver: false, playerWon: false });
   const [remainingMines, setRemainingMines] = useState(mines ?? Math.floor(height * width * 0.25));
   const [hasClicked, setHasClicked] = useState<{
      clicked: boolean;
      x: number;
      y: number;
   }>({ clicked: false, x: 0, y: 0 });
   const minesInTotal = Math.floor(height * width * 0.25);
   // returns random number in interval [0, max]
   const randomInt = (max: number = 0) => {
      return Math.floor(Math.random() * (max + 1));
   };
   // function that returns tile image based on tile info
   const getImage = (tile: square) => {
      if (tile.isMine && gameOver.gameOver) {
         return require('./img/bomb.png');
      }
      if (tile.clicked) {
         if (tile.isMine) {
            return require('./img/bomb.png');
         } else {
            switch (tile.adjacent) {
               case 0:
                  return require('./img/0.png');
               case 1:
                  return require('./img/1.png');
               case 2:
                  return require('./img/2.png');
               case 3:
                  return require('./img/3.png');
               case 4:
                  return require('./img/4.png');
               case 5:
                  return require('./img/5.png');
               case 6:
                  return require('./img/6.png');
               case 7:
                  return require('./img/7.png');
               case 8:
                  return require('./img/8.png');
               default:
                  return require('./img/0.png');
            }
         }
      } else {
         // if (tile.isMine) {
         //    return require('./img/bomb.png');
         // }
         if (tile.flagged) {
            return require('./img/flagged.png');
         } else {
            return require('./img/facingDown.png');
         }
      }
   };
   // function that returns all tiles and all tile coordinates within a specific distance from a given tile
   const getProximityTiles = (originX: number, originY: number, distance: number, grid: square[][]) => {
      let returnCoordinates: { x: number; y: number }[] = [];
      let returnSquares: square[] = [];
      let gridCopy = [...grid];
      let columns: number[] = [];
      for (let col = originX - distance; col <= originX + distance; col++) {
         if (gridCopy[0][col] !== undefined) columns.push(col);
      }
      let rows: number[] = [];
      for (let row = originY - distance; row <= originY + distance; row++) {
         if (gridCopy[row] !== undefined) rows.push(row);
      }
      columns.forEach((col) => {
         rows.forEach((row) => {
            returnSquares.push(grid[row][col]);
            returnCoordinates.push({ x: col, y: row });
         });
      });
      return { coordinates: returnCoordinates, squares: returnSquares };
   };
   // render the starting grid
   const renderGridInitial = () => {
      let totalSquares = height * width;
      let starterGrid: square[][] = [];
      if (minesInTotal > totalSquares) mines = totalSquares;
      for (let row = 0; row < height; row++) {
         starterGrid[row] = Array<square>();
         for (let column = 0; column < width; column++) {
            starterGrid[row][column] = {
               adjacent: 0,
               isMine: false,
               clicked: false,
               flagged: false,
            };
         }
      }
      setGrid(starterGrid);
   };
   // place mines after first click
   const renderMinesInitial = (xClicked: number, yClicked: number) => {
      const copy = [...grid];
      let totalSquares = height * width;
      let availableSquares: number[] = [];
      let mineNumbers: number[] = [];
      for (let iter = 0; iter < totalSquares; iter++) {
         // get all tile numbers
         availableSquares.push(iter);
      }
      const dontPlace = getProximityTiles(xClicked, yClicked, SPACE_AROUND_FIRST_CLICK, copy);
      let dontPlaceNumbers: number[] = [];
      dontPlace.coordinates.forEach((coord) => {
         // get all tile numbers adjacent to clicked
         dontPlaceNumbers.push(coord.y * width + coord.x);
      });
      for (let it = 0; it < minesInTotal; it++) {
         // get all tile numbers to place mines in
         let currentMine = randomInt(availableSquares.length - 1);
         if (dontPlaceNumbers.includes(currentMine)) {
            it--;
         } else {
            mineNumbers.push(currentMine);
            availableSquares.splice(currentMine, 1);
         }
      }
      mineNumbers.forEach((mine) => {
         //place mines
         copy[(mine - (mine % width)) / width][mine % width].isMine = true;
      });
      for (let row = 0; row < height; row++) {
         // set adjacent value of all tiles
         for (let col = 0; col < width; col++) {
            if (grid[row][col].isMine) continue;
            const adjacent = getProximityTiles(col, row, 1, grid);
            let minesAdjacent = 0;
            adjacent.squares.forEach((sq) => {
               if (sq.isMine) minesAdjacent += 1;
            });
            grid[row][col].adjacent = minesAdjacent;
         }
      }
      setHasClicked({ clicked: true, x: xClicked, y: yClicked });
   };
   // render the grid on component mount
   useEffect(() => {
      renderGridInitial();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);
   // execute click on the square after rendering mines after first click
   useEffect(() => {
      if (hasClicked.clicked) {
         clickSquare(hasClicked.x, hasClicked.y);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [hasClicked.clicked]);
   // if player finds all mines player won
   useEffect(() => {
      if (remainingMines === 0) {
         //TODO check if any mines are still hidden
         setGameOver({ gameOver: true, playerWon: true });
      }
   }, [remainingMines]);
   // announce player winning or losing
   useEffect(() => {
      if (!gameOver.gameOver) return;
      if (gameOver.playerWon) {
         //player won the game
         console.log('Player won');
      } else {
         //player lost the game
         console.log('Player lost');
      }
   }, [gameOver]);
   // tile gets left clicked
   const clickSquare = (x: number, y: number) => {
      if (grid[y][x].clicked || gameOver.gameOver) return;
      if (!hasClicked.clicked) {
         renderMinesInitial(x, y);
      } else {
         const copy = [...grid];
         if (copy[y][x].isMine) {
            grid[y][x].clicked = true;
            setGameOver({ gameOver: true, playerWon: false });
            return;
         } else {
            copy[y][x].clicked = true;
            if (copy[y][x].flagged) {
               copy[y][x].flagged = false;
               setRemainingMines((i) => i + 1);
            }
         }
         if (copy[y][x].adjacent === 0) {
            const adjacent = getProximityTiles(x, y, 1, copy);
            adjacent.coordinates.forEach((sq, idx) => {
               if (adjacent.squares[idx].adjacent === 0 && !adjacent.squares[idx].isMine) {
                  clickSquare(sq.x, sq.y);
               }
               if (!adjacent.squares[idx].isMine || (sq.y === y && sq.x === x)) {
                  adjacent.squares[idx].clicked = true;
               }
            });
         }
         setGrid(copy);
      }
   };
   // tile gets right clicked
   const flagSquare = (x: number, y: number) => {
      if (grid[y][x].clicked || gameOver.gameOver) return;
      const copy = [...grid];
      if (copy[y][x].flagged) {
         setRemainingMines((i) => i + 1);
      } else {
         setRemainingMines((i) => i - 1);
      }
      copy[y][x].flagged = !copy[y][x].flagged;
      setGrid(copy);
   };
   //Reset game to start state when reset button pressed
   const resetGame = () => {
      setGameOver({ gameOver: false, playerWon: false });
      setRemainingMines(mines ?? Math.floor(height * width * 0.25));
      setGrid([]);
      renderGridInitial();
      setHasClicked({ clicked: false, x: 0, y: 0 });
   };
   const TileComponent: FC<{ x: number; y: number; tileInfo: square }> = ({ x, y, tileInfo }) =>
      useMemo(() => {
         return (
            <div
               key={`${y.toString()}-${x.toString()}`}
               style={{
                  height: tileSize,
                  width: tileSize,
                  backgroundColor: tileInfo.clicked ? 'red' : 'gray',
                  position: 'relative',
                  float: 'left',
               }}
               onClick={(e) => {
                  clickSquare(x, y);
               }}
               onContextMenu={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  flagSquare(x, y);
               }}
            >
               <div
                  style={{
                     height: '100%',
                     width: '100%',
                     position: 'absolute',
                     left: 0,
                     top: 0,
                     display: 'flex',
                     alignContent: 'center',
                     justifyContent: 'center',
                  }}
               >
                  <div>
                     <img
                        style={{
                           height: tileSize,
                           width: tileSize,
                           opacity: tileInfo.isMine && tileInfo.clicked ? 0.5 : 1,
                        }}
                        src={getImage(tileInfo)}
                        alt="mine"
                     />
                  </div>
               </div>
            </div>
         );
      }, [x, y, tileInfo]);
   return (
      <div id="minesweeper" style={{ width: tileSize * width }}>
         <div id="minesweeper-header" style={{ width: tileSize * width, display: 'flex', flexDirection: 'row' }}>
            <div>Remaining: {remainingMines}</div>
            <div style={{ marginLeft: 'auto' }}>
               <button onClick={resetGame}>Reset</button>
            </div>
         </div>
         <div
            id="minesweeper-board"
            style={{ width: tileSize * width, height: tileSize * height, marginTop: 10, border: '3px solid black' }}
         >
            {grid?.map((row, rowIndex) => {
               return row.map((square, columnIndex) => {
                  return <TileComponent key={rowIndex * columnIndex + columnIndex} x={columnIndex} y={rowIndex} tileInfo={square} />;
               });
            })}
         </div>
      </div>
   );
};
export default Minesweeper;
