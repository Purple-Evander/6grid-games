
'use client';

import React, {useState, useEffect} from 'react';
//import {gameExclusiveData, values, resetViolations, violations, initialBoard, gameRules, renderCellContent, boardOverlay, boardCellColor } from './tangoData'; //importing all game logic functions for tango
//import {gameExclusiveData, values, resetViolations, violations, initialBoard, gameRules, renderCellContent, boardOverlay, boardCellColor} from './sudokuData';
import games from '../gameData/gameExporter';
import { initialBoards } from '../gameData/sudokuBoards';
//import {initialBoard, constraintPairs} from './boardData';

//const values = ['_','S','M']; //states: empty(_), Sun(S), Moon(M)

const Board=()=>{
  
  
  //game switcher
  const [currentGameIndex, setCurrentGameIndex]=useState(1);
  const currentGame = games[currentGameIndex];
  const nextGame=()=>{
    setCurrentGameIndex((prevIndex)=>(prevIndex + 1)% games.length);
  };
  useEffect(()=>{
    setBoard(currentGame.initialBoard);  //updates the initialBoard data when game is switeched
    resetViolations();  //violations are cleared
    setIsWin(false);   //win state is set to false at start of game
    // Ensure that the game rules are updated each time the game changes
    if (currentGame.gameRules) {
      currentGame.gameRules(currentGame.initialBoard); // Apply new game rules
    }
  },[currentGame]);


  //board Switching
  // const boardSwitcher=()=>{
  //   setBoardIndex((prevIndex)=>(prevIndex+1)%initialBoards.length);
  // };

  //basic setter
  const initialBoard= currentGame.initialBoard;
  const values = currentGame.values;
  
  //initialize board state with given above given initial board data
  const [board, setBoard] = useState<string[][]>(currentGame.initialBoard);
  const [isWin, setIsWin] = useState(false);  // To track if the player has won

  
  const game= currentGame.gameExclusiveData.gameName; //fetch name to pick correct rules images

  // Function to handle the reset action (clear the board)
  const resetBoard = () => {
    setBoard(currentGame.initialBoard); // Reset the board state to the initialBoard
    resetViolations(); // Clear any violations
    setIsWin(false); //reset win state
  }; //check the function like resetViolations(), resetViolations(), boardOverlay(), boardCellColor()

  //to cycle through Sun(S), Moon(M), Empty(_) states from values[] upon cell click
  const handleCellClick=(rowIdx:number, colIdx:number)=>{
    //allow only state toggling for empty cells('') in initialBoard
    if(initialBoard[rowIdx][colIdx]==='_'){

      //new copy of board by mapping over current board  
      const updatedBoard = board.map((row, rIdx)=>
        row.map((cell,cIdx)=>{
          if(rIdx===rowIdx && cIdx===colIdx){
            const currentIndex=values.indexOf(cell); //gets the current state value of cell
            return values[(currentIndex +1)% values.length]; //cycles to next state values
          }
          return cell; //keep other cells unchanged
        })
      );
  
      resetViolations(); //clears previos violations

      currentGame.gameRules(updatedBoard);// gets the necessary game rules function
      // checkRowColDuplicatess(updatedBoard);
      // checkRegionDuplicatess(updatedBoard);

      //checkAdjacencyConstraints(updatedBoard,constraintPairs) // checks violation for contraint cell pairs
      //moreThanTwo(updatedBoard); //checks for violations(more than two consecutive cells)
      //checkEqualSunsAndMoons(updatedBoard); //checks the row-fill and column-fill violations
      setBoard(updatedBoard); //updating the board state
    }
    
  };


  ////////////////////// WIN CONDITION///////////// 
  // Check if the player has won (all rows and columns are filled without violations)
  const checkWinCondition = (): boolean => {
    const allFilled = board.every(row => row.every(cell => cell !== '_'));  // Check if all cells are filled
    const noViolations = violations.length === 0;  // Check if there are no violations
    return allFilled && noViolations;
  };
  // Effect to check win condition after every move
  useEffect(() => {
    if (checkWinCondition()) {
      setIsWin(true);  // Set win state to true when player wins
      setTimeout(() => {
        setIsWin(false);  // Reset win state after 25 seconds
      }, 25000);
    }
  }, [board, violations]);  // Check win condition whenever board or violations change


 

 

  return ( 
    <div className="min-h-screen bg-gray-100 flex">

      {/* Left Column: WebP Image, Rules Image, and Reset Button */}
      <div className="w-1/2 flex flex-col justify-start items-center p-4 space-y-4">       
        
        
        {/* Left Image */}
        {isWin?(
          <img
          src="/win.webp"
          alt="Celebration GIF"
          className="p-5 rounded-lg shadow-lg" 
          style={{marginLeft:'100px', width:'550px', maxWidth:'550px'}} // Adjust size as needed
        />
        ):(
          <> 
          <h1 className="text-4xl font-semibold text-center text-gray-700 mt-4 mb-4" style={{marginTop:'50px', marginBottom:'-100px', marginLeft:'50px'}}>{game} Rules</h1>
          <img
            src= {`/${game}-rules.png`}   // "/tango-rules.png" | `/${game}-rules.png`
            alt="Game Rules"
            className="p-5 rounded-lg shadow-lg"
            style={{
              marginLeft:'100px',
              marginTop: '150px',
              width: '700px',
              maxWidth: 'none',
            }}
          />
          </>
        )} 


        {/*******BUTTONS*********/}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '50px',
            marginLeft: '80px',
            width: '65%',
          }}
        >

          {/* Reset Button */}
          <button
            onClick={resetBoard}
            style={{
              padding: '10px 20px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px',
            }} 
          >
            Reset Board 
          </button>
          {/* board switch Button */}
          <button
            /*onClick={boardSwitcher}*/
            style={{
              padding: '10px 20px',
              backgroundColor: '#0892D0',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px',
            }} 
          >
            Next Board 
          </button>
          {/* Switch Game Button */}
          <button
            onClick={nextGame}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              cursor: 'pointer',
              borderRadius: '5px',
              backgroundColor: '#0b0b0b',
              color: 'white',
              border: 'none',
            }}
          >
            Next Game 
          </button>
        </div>
      </div>
  
      {/* Right Column: Game Board */}
      <div className="w-1/2 flex flex-col justify-start items-center p-8">
        <div className="relative p-8 bg-white rounded-lg shadow-lg">
          {/* Render the 6x6 board */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {board.map((row, rowIdx) => (
              <div key={rowIdx} style={{ display: 'flex' }}>
                {row.map((cell, colIdx) => {
                  const isViolation = violations.some(
                    ([vRow, vCol]) => vRow === rowIdx && vCol === colIdx
                  );

                  
                  //const cellBGColor= isViolation? '#ffcccc' : '#f9f9f9';// default color or violation color
                  const cellBGColor= '#f9f9f9';
                  const immutableCell = initialBoard[rowIdx][colIdx]!=='_'; //check if the cell is mutable or not
  
                  return (
                    <div
                      key={colIdx}
                      onClick={() => handleCellClick(rowIdx, colIdx)}
                      style={{
                        width: '90px',
                        height: '90px',
                        border: '2px solid #e0e0e0',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: immutableCell? 'not-allowed': 'pointer', // cursor set to not-allowed when clicked on immutable cells
                        backgroundColor: isViolation?'#ffcccc': currentGame.boardCellColor(rowIdx,colIdx)?.backgroundColor || cellBGColor,//currentGame.boardCellColor(rowIdx,colIdx)?.backgroundColor || cellBGColor,
                        animation: isWin?'blink-green 0.5s step-start infinite' : '', //apply blinking when won
                      }}
                      
                    >

                      {
                        currentGame.boardOverlay() // to add elements over the board
                      }

                      {currentGame.renderCellContent(cell)/* Render cell values by using a function */}
                      
                    </div>

                  ); 
                })}
              </div>
            ))}
          </div>               

          {/* Render board overlay elements */}
          
          
          
        </div>
      </div>
    </div>
  );

  
  
  
};



// blinking animation CSS
const style = document.createElement('style');
style.innerHTML = `
  @keyframes blink-green {
    60% { background-color: #8CBA80; }
  }
`;
document.head.appendChild(style);
    
export default Board;

/*

app(folder)
  board(folder)
    page.tsx
    sudokuData.ts
    tangoData.ts
  globals.css
  layout.tsx
  page.tsx

*/


///board functions
    //shared array of violating cells
    export const violations:[number,number][]=[];

    //reset the global violation array before checking violation to ensure to only highligh current issues
    export const resetViolations=()=>{
      violations.length=0; //clears the array
    }
  
    //helper to avoid duplicates
    export const addViolation=(row:number, col:number)=>{
      const exists = violations.some(([vRow,vCol])=> vRow===row && vCol===col);
      if(!exists){
        violations.push([row,col]);
      }
    };

