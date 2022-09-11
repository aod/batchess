import { useLayoutEffect, useRef, useState } from "react";
import { initBoard, Position } from "../lib";
import Board from "./Board";

const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();

export default function App() {
  const [board, setBoard] = useState(initBoard());
  const moveRef = useRef<HTMLAudioElement>(null);

  useLayoutEffect(() => {
    moveRef.current!.volume = 0.5;
    const track = audioContext.createMediaElementSource(moveRef.current!);
    track.connect(audioContext.destination);
    return () => {
      moveRef.current?.load();
      track.disconnect(audioContext.destination);
    };
  }, []);

  function swapPieces(pos1: Position, pos2: Position) {
    if (pos1 !== pos2) {
      moveRef.current?.play();
      setBoard(Object.assign(board, { [pos2]: board[pos1], [pos1]: null }));
    }
  }

  return (
    <div id="app">
      <audio ref={moveRef} src="/Move.ogg"></audio>
      <Board board={board} onMove={swapPieces} />
    </div>
  );
}
