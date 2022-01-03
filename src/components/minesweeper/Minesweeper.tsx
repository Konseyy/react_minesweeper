import React, { FC, useEffect, useMemo, useState } from "react";
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

const Minesweeper: FC<Props> = ({
  height = 5,
  width = 5,
  mines =Math.floor(height*width*0.25),
  tileSize = 20,
}) => {
  const [grid, setGrid] = useState<Array<Array<square>>>([]);
  const [timer, setTimer] = useState(0);
  const [remainingMines, setRemainingMines] = useState(mines);

  const randomInt = (max: number = 0) => {
    return Math.floor(Math.random() * (max+1));
  };
  const getImage = (tile: square) => {
    if (tile.clicked) {
      if (tile.isMine) {
        return require("./img/bomb.png");
      } else {
        switch (tile.adjacent) {
          case 0:
            return require("./img/0.png");
          case 1:
            return require("./img/1.png");
          case 2:
            return require("./img/2.png");
          case 3:
            return require("./img/3.png");
          case 4:
            return require("./img/4.png");
          case 5:
            return require("./img/5.png");
          case 6:
            return require("./img/6.png");
          case 7:
            return require("./img/7.png");
          case 8:
            return require("./img/8.png");
          default:
            return require("./img/0.png");
        }
      }
    } else {
      if (tile.isMine) {
        return require("./img/bomb.png");
      }
      if (tile.flagged) {
        return require("./img/flagged.png");
      } else {
        return require("./img/facingDown.png");
      }
    }
  };
  
  const renderGridInitial = () => {
    let totalSquares = height * width;
    let starterGrid = [];
    let availableSquares: number[] = [];
    let mineNumbers:number[]=[];
    for (let iter = 0; iter < totalSquares; iter++) {
      availableSquares.push(iter);
    }
    for(let it =0; it<mines;it++){
      console.log(it);
      let currentMine = randomInt(availableSquares.length-1);
      mineNumbers.push(currentMine);
      availableSquares.splice(currentMine,1);
    }
    mineNumbers.sort((a,b)=>b-a);
    console.log(totalSquares,mineNumbers[0]);
    if (mines > totalSquares) mines = totalSquares;
    for (let row = 0; row < height; row++) {
      starterGrid[row] = Array<square>();
      for (let column = 0; column < width; column++) {
        starterGrid[row][column] = {
          adjacent: 0,
          isMine: mineNumbers.includes(row*width+column)?true: false,
          clicked: false,
          flagged: false,
        };
      }
    }
    
    console.log(starterGrid);
    setGrid(starterGrid);
  };
  useEffect(() => {
    renderGridInitial();
  }, []);
  const gameOver = () => {
    console.warn("game over")
  };
  const TileComponent: FC<{ x: number; y: number; tileInfo: square }> = ({
    x,
    y,
    tileInfo,
  }) =>
    useMemo(() => {
      return (
        <div
          key={`${y.toString()}-${x.toString()}`}
          style={{
            height: tileSize,
            width: tileSize,
            backgroundColor: tileInfo.clicked
              ? "red"
              : tileInfo.flagged
              ? "blue"
              : "gray",
            position: "relative",
            float: "left",
          }}
          onClick={(e) => {
            if (grid[y][x].clicked) return;
            if (grid[y][x].isMine) {
              gameOver();
            } else {
              let copy = [...grid];
              copy[y][x].clicked = true;
              if (grid[y][x].flagged) {
                copy[y][x].flagged = false;
              } else {
                setRemainingMines((i) => i - 1);
              }
              setGrid(copy);
            }
          }}
          onContextMenu={(e) => {
            e.preventDefault();
            if (grid[y][x].clicked) return;
            if (grid[y][x].flagged) {
              setRemainingMines((i) => i + 1);
            } else {
              setRemainingMines((i) => i - 1);
            }
            let copy = [...grid];
            copy[y][x].flagged = !copy[y][x].flagged;
            setGrid(copy);
          }}
        >
          <div
            style={{
              height: "100%",
              width: "100%",
              position: "absolute",
              left: 0,
              top: 0,
              display: "flex",
              alignContent: "center",
              justifyContent: "center",
            }}
          >
            <div>
              <img
                style={{ height: tileSize, width: tileSize }}
                src={getImage(tileInfo)}
              />
            </div>
          </div>
        </div>
      );
    }, [x, y, tileInfo]);
  return (
    <div id="minesweeper">
      <div id="minesweeper-header" style={{ width: tileSize * width }}>
        Hello {remainingMines}
      </div>
      <div
        id="minesweeper-board"
        style={{ width: tileSize * width, height: tileSize * height }}
      >
        {grid?.map((row, rowIndex) => {
          return row.map((square, columnIndex) => {
            // console.log(rowIndex*width+columnIndex);
            return (
              <TileComponent
                key={rowIndex * columnIndex + columnIndex}
                x={columnIndex}
                y={rowIndex}
                tileInfo={square}
              />
            );
          });
        })}
      </div>
    </div>
  );
};
export default Minesweeper;
