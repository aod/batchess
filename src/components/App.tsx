import { CSSProperties, useMemo, useState } from "react";
import { initBoard } from "../lib";
import Board from "./Board";

export default function App() {
  const [scale, setScale] = useState(1.5);
  const board = useMemo(() => initBoard(), []);

  return (
    <div id="app" style={{ ["--scale"]: scale } as CSSProperties}>
      <input
        type="range"
        min="1"
        max="4"
        step="0.01"
        value={scale}
        onChange={(e) => setScale(e.target.value as unknown as number)}
      />
      <Board board={board} />
    </div>
  );
}
