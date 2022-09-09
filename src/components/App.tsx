import { initBoard } from "../lib";
import Board from "./Board";

export default function App() {
  return (
    <div>
      <Board board={initBoard()} />
    </div>
  );
}
