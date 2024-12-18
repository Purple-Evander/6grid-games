import React from 'react';

export const gameName = 'Sudoku';


export const initialBoards: string[][] = [
    ['_', '5', '_', '_', '_', '1'],
    ['_', '_', '4', '6', '_', '_'],
    ['4', '_', '_', '_', '5', '_'],
    ['1', '_', '_', '_', '_', '4'],
    ['_', '4', '3', '_', '_', '_'],
    ['_', '6', '_', '2', '4', '_'],
];

export const initialBoard: string[][] = [
        ['6', '5', '2', '4', '3', '1'],
        ['3', '1', '4', '6', '2', '5'],
        ['4', '3', '6', '1', '5', '2'],
        ['1', '2', '5', '3', '6', '4'],
        ['_', '4', '3', '5', '1', '6'],
        ['_', '6', '1', '2', '4', '3'],
    ];

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

//shared array of violating cells
export const violations:[number,number][]=[];

//reset the global violation array before checking violation to ensure to only highligh current issues
export const resetViolations=()=>{
    violations.length=0; //clears the array
}

//helper to avoid duplicates
const addViolation=(row:number, col:number)=>{
    const exists = violations.some(([vRow,vCol])=> vRow===row && vCol===col);
    if(!exists){
        violations.push([row,col]);
    }
};


// export const checkRowColDuplicates=(board:string[][]):void=>{
//     const tempSet: Set<string> = new Set();

//     //check duplicates in current row
//     for(let i=0; i<6; i++){
//         //ignoring the current cell number
//         if(i!==colIdx){
//             tempSet.add(board[rowIdx][i]);
//         }
//     }
//     if(tempSet.has(board[rowIdx][colIdx])){ //duplicate check
//         console.log(`${board[rowIdx][colIdx]} already exists in row ${rowIdx}`);
//         addViolation(rowIdx,colIdx); //add to violations array
//     }

//     //check duplicates in current column
//     tempSet.clear(); //clears the data for column 
//     for(let i=0; i<6; i++){
//         //ignoring the current cell number
//         if(i!==rowIdx){
//             tempSet.add(board[i][colIdx]);
//         }
//     }
//     if(tempSet.has(board[rowIdx][colIdx])){ //duplicate check
//         console.log(`${board[rowIdx][colIdx]} already exists in column ${colIdx}`);
//         addViolation(rowIdx,colIdx); //add to violations array
//     }
// }




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


// export const checkRegionDuplicates=(board:string[][])=>{
//     let regionSet= findRegionSet(rowIdx,colIdx);
//     const tempSet: Set<string> = new Set();//set to store distinct numbers

//     let currentNumber = board[rowIdx][colIdx];//store the current number in a variable for comparison
//     board[rowIdx][colIdx]='_';//empty the current cell to prevent current number added to temp set

//     for(const [rowR, colR] of regionSet){
//         tempSet.add(board[rowR][colR]);
//     };
//     //console.log("Region set is : ", tempSet);

//     if(tempSet.has(currentNumber)){
//         console.log(`${currentNumber} already exists in region set: `, tempSet);
//         addViolation(rowIdx,colIdx)
//     }else{
//         console.log(`No duplicates in region set: `, tempSet);
//     }

//     board[rowIdx][colIdx]=currentNumber;//restore current number back to cell
// } 


//export const renderRegions(){};



const checkRowColDuplicatess = (board: string[][]): void => {
        for (let rowIdx = 0; rowIdx < 6; rowIdx++) {
          for (let colIdx = 0; colIdx < 6; colIdx++) {
            if (board[rowIdx][colIdx] !== '_') { // Skip empty cells
              const currentValue = board[rowIdx][colIdx];
              const tempSet: Set<string> = new Set();
              //const tempSetCol: Set<string> = new Set();
      
              // Check duplicates in the current row
              for (let i = 0; i < 6; i++) {
                if (i !== colIdx && board[rowIdx][i] !== '_') {
                  if (tempSet.has(board[rowIdx][i])) {
                    console.log(`${board[rowIdx][colIdx]} already exists in row ${rowIdx}`);
                    addViolation(rowIdx, i); // Mark violation for duplicate in the row
                  }
                  tempSet.add(board[rowIdx][i]);
                }
              }
              
              // Check duplicates in the current column
              tempSet.clear();
              for (let i = 0; i < 6; i++) {
                if (i !== rowIdx && board[i][colIdx] !== '_') {
                  if (tempSet.has(board[i][colIdx])) {
                    console.log(`${board[rowIdx][colIdx]} already exists in column ${colIdx}`);
                    addViolation(i, colIdx); // Mark violation for duplicate in the column
                  }
                  tempSet.add(board[i][colIdx]);
                }
              }
            }
          }
        }
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
  gameName, regionSet
};



const darkRegion = (rowIdx: number, colIdx: number) => {
  const isDarkRegion = L1.some(([dRow, dCol]) => dRow === rowIdx && dCol === colIdx) ||
                       R2.some(([dRow, dCol]) => dRow === rowIdx && dCol === colIdx) ||
                       L3.some(([dRow, dCol]) => dRow === rowIdx && dCol === colIdx);

  if (isDarkRegion) {
    // Return inline styles if it's a dark region
    return {
      backgroundColor: 'rgba(0, 0, 0, 0.08)', // Darker background for the dark region
    };
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