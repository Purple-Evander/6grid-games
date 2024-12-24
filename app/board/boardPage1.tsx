'use client';

import React, {useState, useEffect} from 'react';
import games from '../gameData/gameExporter';

const Board=()=>{

    
    //decides game
    const [currentGameIndex, setCurrentGameIndex]=useState(0);
    const currentGame = games[currentGameIndex];
    const nextGame=()=>{ setCurrentGameIndex((prevIndex)=>(prevIndex + 1)% games.length); };
    useEffect(()=>{
      setBoard(currentGame.gameExclusiveData.initialBoard);
      setGameExclusiveData(currentGame.gameExclusiveData); // Update gameExclusiveData when game changes
      resetBoard();
      resetViolations();
    },[currentGame]);

    //decides board
    const [boardIndex, setBoardIndex]=useState(0);   
    //const initialBoard= currentGame.getInitialBoard(boardIndex);
    const [board, setBoard] = useState<string[][]>(currentGame.getInitialBoard(boardIndex));
    const [startBoard, setStartBoard]= useState<string[][]>(board);

    //gameExclusiveData
    const [gameExclusiveData, setGameExclusiveData] = useState(currentGame.gameExclusiveData);
    useEffect(()=>{
        //setBoard(currentGame.getInitialBoard(boardIndex));  //updates the initialBoard data when game is switeched
        //resetViolations();  //violations are cleared
        //setIsWin(false);   //win state is set to false at start of game
        console.log('From useEffect for gameExclusiveData \n ',gameExclusiveData);
        console.log(currentGame.gameRules);
    },[gameExclusiveData]);
    
    // useEffect(() => {
    //     console.log('Board state has been updated:', board);
    // }, [board]);
    

    //cell values
    const values = currentGame.values;

    //win state
    const [isWin, setIsWin] = useState(false);  // To track if the player has won
    
    const game= currentGame.gameName; //fetch name to pick correct rules images

    //board Switching
    const handleBoardSwitch = () => {
      resetViolations();
      setIsWin(false);
      const updatedGame = currentGame.boardSwitcher(currentGame.getInitialBoard(boardIndex), currentGame.gameExclusiveData);
      setBoardIndex(updatedGame.nextIndex); 
      setBoard( currentGame.getInitialBoard(updatedGame.nextIndex) );
      setStartBoard(  currentGame.getInitialBoard(updatedGame.nextIndex) );
      setGameExclusiveData(updatedGame); //trigger useEffect for gameExclusiveData
      console.log('updatedGame from boardSwitching ',updatedGame);
    };
    useEffect(()=>{
      console.log('Start board: ', startBoard);
    },[startBoard]);


    // const handleBoardSwitch = useCallback(() => {
    //     console.log('handleBoardSwitch: currentGame.getInitialBoard(boardIndex) \n', currentGame.getInitialBoard(boardIndex));
    //     const updatedGame = currentGame.boardSwitcher(startBoard, currentGame.gameExclusiveData );        
        
    //     // Set the updated data directly from boardSwitcher
    //     setGameExclusiveData(updatedGame);  // Update the entire game data structure
    
    //     console.log('new state of board index: ',currentGame.getInitialBoard(updatedGame.nextIndex));
    //     resetViolations();  // Clear violations
    //     setIsWin(false);  // Reset win state
    //     console.log('Board before new state from handleBoardSwitch: ',updatedGame.nextBoard);
    //     setBoard(updatedGame.nextBoard);  // Set the new initial board
    //     console.log('updated nextBoard from handleboardswitch: ',updatedGame.nextBoard);
    //     setBoardIndex(updatedGame.nextIndex);
    //     setStartBoard(updatedGame.nextBoard);
    // },[gameExclusiveData]);
 
    // Function to handle the reset action (clear the board)
    const resetBoard = () => {
        //setBoard(currentGame.getInitialBoard(boardIndex)); // Reset the board state to the initialBoard
        setBoard(startBoard);
        console.log('Start Board from reset: ',startBoard);
        resetViolations(); // Clear any violations
        setIsWin(false); //reset win state
    };

    const handleCellClick=(rowIdx:number, colIdx:number)=>{
      //allow only state toggling for empty cells('') in initialBoard
      if(startBoard[rowIdx][colIdx]==='_'){
    
        //new copy of board by mapping over current board  
        const updatedBoard = board.map((row, rIdx)=>
          row.map((cell,cIdx)=>{
            if(rIdx===rowIdx && cIdx===colIdx){
              const currentIndex=currentGame.values.indexOf(cell); //gets the current state value of cell
              return currentGame.values[(currentIndex +1)% values.length]; //cycles to next state values
            }
            return cell; //keep other cells unchanged
          })
        );
      
        resetViolations(); //clears previos violations    
        currentGame.gameRules(updatedBoard);// gets the necessary game rules function 
        console.log(currentGame.gameName, currentGame.gameRules);
        console.log('updated board on cell click: ',updatedBoard);
        console.log('violations array: ',violations);
        setBoard(updatedBoard); //updating the board state
        console.log('handleClick function board',updatedBoard);
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
    }, [board, violations]);


     //deployment fix- winning blink animation
     useEffect(() => {
      // Ensure this runs only in the browser
      if (typeof document !== 'undefined') {
        const style = document.createElement('style');
        style.innerHTML = `
          @keyframes blink-green {
            60% { background-color: #8CBA80; }
          }
        `;
        document.head.appendChild(style);
    
        // Clean up the style on unmount
        return () => {
          document.head.removeChild(style);
        };
      }
    }, []);









    return (         
        <div className="min-h-screen bg-gray-100 flex">
    
          {/* Left Column: WebP Image, Rules Image, and Reset Button */}
          <div className="w-1/2 flex flex-col justify-start items-center p-4 space-y-4">       
            
            
            {/* Left Image */}
            {isWin?(
              <img
              src="./win.webp"
              alt="Celebration GIF"
              className="p-5 rounded-lg shadow-lg" 
              style={{marginLeft:'100px', width:'550px', maxWidth:'550px'}} // Adjust size as needed
            />
            ):(
              <> 
              <h1 className="text-4xl font-semibold text-center text-gray-700 mt-4 mb-4" style={{marginTop:'50px', marginBottom:'-100px', marginLeft:'50px'}}>{game} Rules</h1>
              <img
                src= {`./${game}-rules.png`}   // `/${game}-rules.png`
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
                onClick={handleBoardSwitch}  //switching board acc to game , random or iterate boards
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
                Next Challenge 
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
                      const immutableCell = startBoard[rowIdx][colIdx]!=='_'; //check if the cell is mutable or not
      
                      return (
                        <div
                          key={colIdx}
                          onClick={() => {handleCellClick(rowIdx, colIdx); console.log('Handle cell click, startBoard: \n',startBoard); console.log('handle cell click, board: ',board);}}
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
                        {currentGame.boardOverlay(boardIndex)/* to add elements over the board*/}                      
                        {currentGame.renderCellContent(cell)/* Render cell values by using a function */}
                                                  
                        </div>    
                      ); 
                    })}
                  </div>
                ))}
              </div>                   
            </div>
          </div>
        </div>        
    ); 
};


export default Board;


//board functions
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