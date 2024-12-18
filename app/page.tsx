import Board from "./board/page";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div>
        <h1 className="text-5xl font-semibold text-center text-gray-700 mt-4 mb-4">Board Game</h1>
        <Board/>
      </div>
    </div>
  );
}  


//functions that are common to Tango and Sudoku
//    resetBoard()
//    addViolation(row,col)