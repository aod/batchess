import { useState } from "react";
import { initBoard, Position } from "../lib";
import Board from "./Board";

export default function App() {
  const [board, setBoard] = useState(initBoard());

  function swapPieces(pos1: Position, pos2: Position) {
    if (pos1 !== pos2)
      setBoard(Object.assign(board, { [pos2]: board[pos1], [pos1]: null }));
  }

  return (
    <div id="app">
      <Board board={board} onMove={swapPieces} />
    </div>
  );
}
