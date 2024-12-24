import React from 'react';

import {violations, addViolation} from '../board/boardPage1';
import {initialBoards} from './sudokuBoards';

export const gameName = 'Sudoku';



let initialBoard: string[][] = initialBoards[0];

export const getInitialBoard = (boardIndex:number):string[][] => {console.log(initialBoards[boardIndex]); return initialBoards[boardIndex]};
// export const setInitialBoard = (boardIndex: number) => {
//   initialBoard = initialBoards[boardIndex];
// };

//regions
const L1:[number,number][]=[[0,0],[0,1],[0,2], 
                            [1,0],[1,1],[1,2]];
const R1:[number,number][]=[[0,3],[0,4],[0,5], 
                            [1,3],[1,4],[1,5]];

const L2:[number,number][]=[[2,0],[2,1],[2,2], 
                            [3,0],[3,1],[3,2]];
const R2:[number,number][]=[[2,3],[2,4],[2,5],
                            [3,3],[3,4],[3,5]];

const L3:[number,number][]=[[4,0],[4,1],[4,2],
                            [5,0],[5,1],[5,2]];
const R3:[number,number][]=[[4,3],[4,4],[4,5],
                            [5,3],[5,4],[5,5]];

const regionSet = [L1,R1,L2,R2,L3,R3]; // Array<Array<Array<number>>> 

export const values=['_','1','2','3','4','5','6']; //states: empty(_) and numbers from 1 to 6



//helper to detect the play region and the cell coordinates
const findRegionSet=(rowIdx:number,colIdx:number)=>{
    if(rowIdx==0 || rowIdx==1){
        if(colIdx==0 || colIdx==1 || colIdx==2){
            return L1;
        }else{
            return R1;
        }
    }
    if(rowIdx==2 || rowIdx==3){
        if(colIdx==0 || colIdx==1 || colIdx==2){
            return L2;
        }else{
            return R2;
        }
    }
    if(rowIdx==4 || rowIdx==5){
        if(colIdx==0 || colIdx==1 || colIdx==2){
            return L3;
        }else{
            return R3;
        }
    }
}; //only 10 operations to detect from 6 regions on worst case scenario



const checkRowColDuplicatess = (board: string[][]): void => {
  console.log(violations);
  for (let rowIdx = 0; rowIdx < 6; rowIdx++) {
    for (let colIdx = 0; colIdx < 6; colIdx++) {
      if (board[rowIdx][colIdx] !== '_') { // Skip empty cells
        const currentValue = board[rowIdx][colIdx];

        // Check duplicates in the current row
        for (let i = 0; i < 6; i++) {
          if (i !== colIdx && board[rowIdx][i] !== '_') {
            if (board[rowIdx][i] === currentValue) {
              console.log(`${currentValue} already exists in row ${rowIdx}`);
              addViolation(rowIdx, colIdx); // Mark violation for duplicate in the row
            }
          }
        }

        // Check duplicates in the current column
        for (let i = 0; i < 6; i++) {
          if (i !== rowIdx && board[i][colIdx] !== '_') {
            if (board[i][colIdx] === currentValue) {
              console.log(`${currentValue} already exists in column ${colIdx}`);
              addViolation(rowIdx, colIdx); // Mark violation for duplicate in the column
            }
          }
        }
      }
    }
  }
  console.log(violations);
};




const checkRegionDuplicatess = (board: string[][]): void => {
        regionSet.forEach((region) => {
          const tempSet: Set<string> = new Set();
      
          region.forEach(([rowIdx, colIdx]) => {
            const value = board[rowIdx][colIdx];
            if (value !== '_') {
              if (tempSet.has(value)) {
                addViolation(rowIdx, colIdx); // Mark violation for duplicate in the region
              }
              tempSet.add(value);
            }
          });
        });
};
      
    
export const gameRules=(board:string[][]):void=>{    
    checkRowColDuplicatess(board);
    checkRegionDuplicatess(board);
};

export const renderCellContent = (cell: string): React.ReactNode => {
  const elements:{[key: string]:()=>React.ReactNode} = {
    _: () => React.createElement('span', { className: 'text-gray-500 text-lg' }, '..'),
    1: () => React.createElement('span', { className: 'text-gray-500 text-3xl' }, '1'),
    2: () => React.createElement('span', { className: 'text-gray-500 text-3xl' }, '2'),
    3: () => React.createElement('span', { className: 'text-gray-500 text-3xl' }, '3'),
    4: () => React.createElement('span', { className: 'text-gray-500 text-3xl' }, '4'),
    5: () => React.createElement('span', { className: 'text-gray-500 text-3xl' }, '5'),
    6: () => React.createElement('span', { className: 'text-gray-500 text-3xl' }, '6'),

  };

  return elements[cell]?.() || null;
};

//<span className="text-gray-500 text-3xl">1</span>

export const gameExclusiveData={
  initialBoard, gameName
};



type BackgroundColor = { backgroundColor: string } | null; //explicitely mention return type to avoid error type 'never'
const darkRegion = (rowIdx: number, colIdx: number):BackgroundColor => {
  const isDarkRegion = L1.some(([dRow, dCol]) => dRow === rowIdx && dCol === colIdx) ||
                       R2.some(([dRow, dCol]) => dRow === rowIdx && dCol === colIdx) ||
                       L3.some(([dRow, dCol]) => dRow === rowIdx && dCol === colIdx);

  if (isDarkRegion) {
    // Return inline styles if it's a dark region
    return { backgroundColor: 'rgba(0, 0, 0, 0.08)', };// Darker background for the dark region
  }

  // Return null if it's not a dark region, meaning no styles are applied
  return null;
};



export const boardCellColor=(rowIdx:number, colIdx:number)=>{
  return darkRegion(rowIdx, colIdx);
};

export const boardOverlay=()=>{
  return null;
};


// export const boardSwitcher=(board:string[][])=>{
//   return null;
// };



type ExclusiveCurrentBoardData={
  initialBoard:string[][],

};

export const boardSwitcher = <T extends ExclusiveCurrentBoardData>(board: string[][], boardData: T) => {
  console.log('current boardData.initialBoard:', boardData.initialBoard);
  console.log('available Boards:', initialBoards);

  const areBoardsEqual = (board1: string[][], board2: string[][]): boolean => {
    if (board1.length !== board2.length) return false;
    return board1.every((row, rowIndex) =>
      row.length === board2[rowIndex].length &&
      row.every((cell, cellIndex) => cell === board2[rowIndex][cellIndex])
    );
  };

  const currentIndex = initialBoards.findIndex((b) => {
    console.log('Comparing:');
    console.log('Board in initialBoards:', b);
    console.log('boardData.initialBoard:', boardData.initialBoard);
    return areBoardsEqual(b, board);
  });

  console.log('current board index:', currentIndex);

  const nextIndex = (currentIndex + 1) % initialBoards.length;
  console.log('next index: ',nextIndex);
  // Ensure that the next board is a 2D array of strings
  const nextBoard: string[][] = initialBoards[nextIndex];

  console.log('next Board: ',nextBoard);
  return { ...boardData, nextIndex, nextBoard};
};