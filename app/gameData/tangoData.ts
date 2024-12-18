import React from 'react';
import {violations, addViolation } from '../board/page';
import {initialBoards, constraintPairsSet} from './tangoBoards';

export const gameName = 'Tango';

// Initial 6x6 board configuration (assumes no violations at the start)
// export const initialBoardS: string[][] = [
//     ['_', '_', '_', '_', '_', '_'],
//     ['_', '_', 'S', 'S', '_', 'S'],
//     ['_', 'S', 'M', '_', 'M', 'S'],
//     ['_', '_', '_', '_', '_', '_'],
//     ['_', 'M', 'M', '_', 'S', '_'],
//     ['_', '_', '_', '_', '_', '_'],
//   ];

// export const initialBoard: string[][] = [
//     ['S', 'S', 'M', 'M', 'S', 'M'],
//     ['M', 'M', 'S', 'S', 'M', 'S'],
//     ['M', 'S', 'M', 'S', 'M', 'S'],
//     ['S', 'M', 'S', 'M', 'S', '_'],
//     ['_', 'M', 'M', 'S', 'S', 'M'],
//     ['_', 'S', 'S', 'M', 'M', 'S'],
//   ];

export const initialBoard: string[][] = initialBoards[0];
export const constraintPairs: string[][] = constraintPairsSet[0];
  

 // List of constrained adjacent cell pairs with their relationships ('=' or '*')
// export const constraintPairs: string[][] = [
//     ['=', '=', '_', '_', '_', '_'],
//     ['_', '_', '_', '_', '_', '_'],
//     ['_', '_', '_', '_', '_', '_'],
//     ['_', '_', '_', '_', '*', '*'],
//     ['_', '_', '_', '=', '=', '_'],
//     ['_', '_', '_', '_', '_', '_'],
//   ];


  

export const values=['_','S','M']; //states: empty(_), Sun(S), Moon(M)


/////////////////////   MORE THAN TWO   /////////////////////////////////////
const moreThanTwo = (board: string[][]): void =>{
    //checking the rows for more than two sequential sun or moon
    board.forEach((row,rowIdx)=>{
        let count=1; //track the consequtive accurence count
        for(let colIdx = 1; colIdx< row.length; colIdx++){
            //checks for only sun and moon, but ignoriing empty(_)
            if(row[colIdx]===row[colIdx -1] && row[colIdx] !== '_'){
                count++;
                if(count>2){
                    addViolation(rowIdx,colIdx);
                    //violations.push([rowIdx, colIdx]); //violating cell
                    console.log(`more than 2 in row violation: (${rowIdx}, ${colIdx})`, JSON.stringify(violations));
                }
            }else{
                count=1; //reseting the count to break the sequence
            }
        }
    });
    //checking the column for more than two sequential sun or moon
    for(let colIdx=0; colIdx < board[0].length; colIdx++){
        let count=1; //track the consequtive accurence count
        for(let rowIdx = 1; rowIdx < board.length; rowIdx++){
            //checks for only sun and moon, but ignoring empty(_)
            if(board[rowIdx][colIdx]===board[rowIdx-1][colIdx] && board[rowIdx][colIdx]!== '_'){
                count++;
                if(count>2){
                    addViolation(rowIdx,colIdx);
                    //violations.push([rowIdx,colIdx]); //violationg cell
                    console.log(`more than 2 in column violation : (${rowIdx}, ${colIdx})`, JSON.stringify(violations));
                }
            }else{
                count=1; //reseting the count to break the sequence
            }
        }
    }

    //returns void
};



/////////////////////   CONSTRAINT PAIRS   /////////////////////////////////////
const checkAdjacentCells=(currentCell:string, adjacentCell:string, sign:string): boolean => {
    if(currentCell=='_' || adjacentCell=='_'){
        return false; 
    }else if(sign === '=' ){
        return currentCell !== adjacentCell; //both must be same
    }else if(sign === '*'){
        return currentCell === adjacentCell; //both must be different
    }
    return false;        
}

const checkAdjacencyConstraints =(board:string[][], constraintPairs:string[][]): void =>{
    for(let rowIdx=0; rowIdx<board.length; rowIdx++){
        for(let colIdx=0; colIdx<board[rowIdx].length; colIdx++){
            //get the state value in current cell stored in currentCell
            const currentCell = board[rowIdx][colIdx];

            //check right-neighborCell (row, col +1)
            if(colIdx < board[rowIdx].length-1){
                //get the constraint sign in right-neighborCell to c2 and currentCell constraint sign in c1
                const c1= constraintPairs[rowIdx][colIdx];
                const c2 = constraintPairs[rowIdx][colIdx +1];
                //ensure '_' is not considered as constrain sign 
                //both cell's constraint sign must be same, to call them a constraint cell pair
                //pass the parameters to checkAdjacentcells() 
                if((c1 !== '_' || c2 !=='_') && (c1===c2) && checkAdjacentCells(currentCell, board[rowIdx][colIdx+1], c2)){
                    addViolation(rowIdx,colIdx);
                    addViolation(rowIdx,colIdx +1);
                    //violations.push([rowIdx,colIdx]);
                    //violations.push([rowIdx,colIdx +1]);
                    console.log(`right adjacent constraint pair violation: (${rowIdx},${colIdx}, with ${constraintPairs[rowIdx][colIdx]}) and (${rowIdx},${colIdx+1}, with ${constraintPairs[rowIdx][colIdx+1]}) for sign "${c2}"`, JSON.stringify(violations));
                }
            }

            //check bottom-neighborCell (row +1, col)
            if(rowIdx < board.length-1){
                const c1 = constraintPairs[rowIdx][colIdx];
                const c2 = constraintPairs[rowIdx +1][colIdx];
                if((c1 !== '_' || c2 !=='_') && (c1===c2) && checkAdjacentCells(currentCell, board[rowIdx+1][colIdx], c2)){
                    addViolation(rowIdx,colIdx);
                    addViolation(rowIdx+1,colIdx);
                    console.log(`bottom adjacent constraint pair violation: (${rowIdx},${colIdx}, with ${constraintPairs[rowIdx][colIdx]}) and (${rowIdx+1},${colIdx}, with ${constraintPairs[rowIdx+1][colIdx]}) for sign "${c2}"`, JSON.stringify(violations));
                }
            }
        }
    }
};

 


/////////////////////   INVALID ROW-COLUMN FILL   /////////////////////////////////////


const checkEqualSunsAndMoons = (board:string[][]):void=>{
    //checking the rows for violations
    for(let rowIdx=0; rowIdx < board.length; rowIdx++){
        let sunCount=0, moonCount=0;

        //count suns and moons in current row
        board[rowIdx].forEach(cell=>{
            if(cell==='S') sunCount++;
            if(cell==='M') moonCount++;
        });

        if(sunCount>3 || moonCount>3){
            board[rowIdx].forEach((cell,colIdx)=>{
                //push cells that violates the row fill rule
                if(cell==='S' || cell==='M'){
                    violations.push([rowIdx,colIdx]); //adding the violating cells one by one in the row
                    console.log(`Row fill violation on row: ${rowIdx+1}`);
                }
            });
        }
    }

    //checking the columns for violations
    for(let colIdx=0; colIdx < board[0].length; colIdx++){
        let sunCount = 0, moonCount = 0;

        //count the suns and moons in current column
        for(let rowIdx=0; rowIdx < board.length; rowIdx++){
            if(board[rowIdx][colIdx]==='S') sunCount++;
            if(board[rowIdx][colIdx]==='M') moonCount++;
        }

        if(sunCount>3 || moonCount>3){
            for(let rowIdx=0; rowIdx<board.length; rowIdx++){
                //push cells that violates column fill rule
                if(board[rowIdx][colIdx]==='S' || board[rowIdx][colIdx]==='M'){
                    violations.push([rowIdx,colIdx]); //adding violating cell one by one in the column
                    console.log(`Row fill violation on column: ${colIdx+1}`);                
                }
            }
        }
    }
};



//////////////////////// RENDER CONSTRAINTS  //////////////////////////////
/*

npm install --save-dev @types/react @types/react-dom typescript

*/
// Define the type for a single row of constraints
type ConstraintRow = string[];
type ConstraintPairs = ConstraintRow[];


// Function to render constraints
export const renderConstraints = (constraintPairs: ConstraintPairs): React.ReactElement[] => {
    return constraintPairs.flatMap((row, rowIdx) =>
        row.flatMap((constraint, colIdx) => {
          if (constraint === '_') return null;
  
          const elements: React.ReactElement[] = [];
  
          // Right constraint
          if (colIdx < row.length - 1 && constraint === constraintPairs[rowIdx][colIdx + 1]) {
            elements.push(
              React.createElement(
                'div',
                {
                  key: `right-${rowIdx}-${colIdx}`,
                  style: {
                    position: 'absolute',
                    top: `${rowIdx * 90 + 62}px`,
                    left: `${colIdx * 90 + 115}px`,
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: '#4d5382',
                  },
                },
                constraint === '*' ? 'x' : '='
              )
            );
          }
  
          // Bottom constraint
          if (rowIdx < constraintPairs.length - 1 && constraint === constraintPairs[rowIdx + 1][colIdx]) {
            elements.push(
              React.createElement(
                'div',
                {
                  key: `bottom-${rowIdx}-${colIdx}`,
                  style: {
                    position: 'absolute',
                    top: `${(rowIdx + 1) * 90 + 15}px`,
                    left: `${colIdx * 90 + 70}px`,
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: '#4d5382',
                  },
                },
                constraint === '*' ? 'x' : '='
              )
            );
          }
  
          return elements;
        })
      )
      .filter((element): element is React.ReactElement => element !== null); // Filter out null values
  };



export const gameRules=(board:string[][]):void=>{
  checkAdjacencyConstraints(board,constraintPairs);
  moreThanTwo(board);
  checkEqualSunsAndMoons(board);

};


// Function to render the content of a cell based on its value
export const renderCellContent = (cell: string): React.ReactNode => {
  const elements:{[key: string]:()=>React.ReactNode} = {
    _: () => React.createElement('span', { className: 'text-gray-500 text-3xl' }, '..'),
    S: () => React.createElement('img', { src: '/sun-icon.png', alt: 'Sun', className: 'w-12 h-12' }),
    M: () => React.createElement('img', { src: '/moon-icon.png', alt: 'Moon', className: 'w-12 h-12' }),
  };

  return elements[cell]?.() || null;
};

export const gameExclusiveData={
  gameName, 
};

export const boardOverlay=()=>{
  return renderConstraints(constraintPairs);
};
export const boardCellColor=(rowIdx:number, colIdx:number)=>{
  return null;
};

