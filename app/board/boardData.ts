// app/board/boardData.ts

// // Initial 6x6 board configuration (assumes no violations at the start)
// export const initialBoard: string[][] = [
//     ['_', '_', '_', '_', '_', '_'],
//     ['_', '_', 'S', 'S', '_', 'S'], 
//     ['_', 'S', 'M', '_', 'M', 'S'],
//     ['_', '_', '_', '_', '_', '_'],
//     ['_', 'M', 'M', '_', 'S', '_'],
//     ['_', '_', '_', '_', '_', '_'],
//   ];
  

//  // List of constrained adjacent cell pairs with their relationships ('=' or '*')
// export const constraintPairs: string[][] = [
//     ['=', '=', '_', '_', '_', '_'],
//     ['_', '_', '_', '_', '_', '_'],
//     ['_', '_', '_', '_', '_', '_'],
//     ['_', '_', '_', '_', '*', '*'],
//     ['_', '_', '_', '=', '=', '_'],
//     ['_', '_', '_', '_', '_', '_'],
//   ];





  // export const constrainedPairs = [
  //   {
  //     cell1: { row: 0, col: 0 },
  //     cell2: { row: 0, col: 1 },
  //     sign: '=', // Cells at (0,0) and (0,1) must be the same state
  //   },
  //   {
  //     cell1: { row: 1, col: 0 },
  //     cell2: { row: 1, col: 1 },
  //     sign: '*', // Cells at (1,0) and (1,1) must have different states
  //   },
  //   // Add more pairs as needed
  // ];
  