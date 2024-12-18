import * as sudokuBoards from './sudokuBoards';
//import {gameExclusiveData, values, resetViolations, violations, initialBoard, gameRules, renderCellContent, boardOverlay, boardCellColor} from './sudokuData';

import * as tangoBoards from './tangoBoards';
// Import more games here as needed

// Add all games to an array
const boards = [tangoBoards, sudokuBoards];

export default boards;