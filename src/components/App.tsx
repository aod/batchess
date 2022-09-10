import { initBoard } from "../lib";
import Board from "./Board";

export default function App() {
  return (
    <div id="app">
      <Board board={initBoard()} />
    </div>
  );
}
