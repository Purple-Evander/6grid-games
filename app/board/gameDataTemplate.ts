import React from 'react';

import {violations, addViolation, resetViolations} from '../board/page';

export const gameName = 'game_name'; //used to fetch rules image and must be named as game_name-rules.png (Width 2500-2550px and Height 500-530px)

export const initialBoard:string[][] = [
    ['_', '_', '_', '_', '_', '_'],
    ['_', '_', '_', '_', '_', '_'],
    ['_', '_', '_', '_', '_', '_'],
    ['_', '_', '_', '_', '_', '_'],
    ['_', '_', '_', '_', '_', '_'],
    ['_', '_', '_', '_', '_', '_'],
];
  
//////////////////////////////////////////////////////////////////////////////////////

/*        EXCLUSIVE GAME DATA HERE  

    example from Tango:

constraintPairs: string[][] = [
    ['=', '=', '_', '_', '_', '_'],
    ['_', '_', '_', '_', '_', '_'],
    ['_', '_', '_', '_', '_', '_'],
    ['_', '_', '_', '_', '*', '*'],
    ['_', '_', '_', '=', '=', '_'],
    ['_', '_', '_', '_', '_', '_'],
];

    example from Sudoku:

const L1:[number,number][]=[[0,0],[0,1],[0,2],[1,0],[1,1],[1,2]];

*/

//////////////////////////////////////////////////////////////////////////////////////



export const values=['_','S','1'];  //states: empty(_) and others




//////////////////////////////////////////////////////////////////////////////////////

/*            EXCLUSIVE GAME RULES FUNCTIONS HERE  

example from Sudoku:

const findRegionSet=(rowIdx:number, colIdx:number)=>{......};
const checkRegionDuplicatess = (board: string[][]): void => {...findRegionSet(rowIdx,colIdx){..return L1..}...};
const checkRowColDuplicatess = (board: string[][]): void => {......};

*/

//////////////////////////////////////////////////////////////////////////////////////

export const gameRules=(board:string[][]):void=>{

  //call all the game rules functions here    eg. moreThanTwo(board); 
  
};



// Function to render the content of a cell based on its value
export const renderCellContent = (cell: string): React.ReactNode => {
  const elements:{[key: string]:()=>React.ReactNode} = {
    _: () => React.createElement('span', { className: 'text-gray-500 text-lg' }, '..'), //mandatory state
    S: () => React.createElement('img', { src: '/sun-icon.png', alt: 'Sun', className: 'w-12 h-12' }),
    1: () => React.createElement('span', { className: 'text-gray-500 text-3xl' }, '1'),
  };

  return elements[cell]?.() || null;  // optional chaining and null as default(instead of undefined)
};



export const gameExclusiveData={
    //pass all game exclusive data here for example
    gameName, //L1 from sudoku, constraintPairs from Tango
};

export const boardOverlay=()=>{
    //pass the function if game needs additional board elements
    return null;
};
export const boardCellColor=(rowIdx:number, colIdx:number)=>{
    //pass the function if game deals with board cell colours
    return null;
};