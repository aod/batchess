import { useState } from "react";
import { initBoard, Position } from "../lib";
import Board from "./Board";

export default function App() {
  if (!moveSfx) throw fetchMoveSfx();

  const [board, setBoard] = useState(initBoard());

  function swapPieces(pos1: Position, pos2: Position) {
    if (pos1 !== pos2) {
      playMoveSfx();
      setBoard(Object.assign(board, { [pos2]: board[pos1], [pos1]: null }));
    }
  }

  return (
    <div id="app">
      <Board board={board} onMove={swapPieces} />
    </div>
  );
}

const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();

let moveSfx: AudioBuffer | null = null;
async function fetchMoveSfx() {
  const fetchMoveSfx = fetchAudio("/Move.ogg");
  const [audioBuffer] = await Promise.allSettled([fetchMoveSfx, sleep(800)]);
  moveSfx = (audioBuffer as PromiseFulfilledResult<AudioBuffer>).value;
}

function playMoveSfx() {
  const sampleSource = new AudioBufferSourceNode(audioContext, {
    buffer: moveSfx,
    playbackRate: 1,
  });
  sampleSource.connect(audioContext.destination);
  sampleSource.start();
}

async function fetchAudio(audioPath: string) {
  const response = await fetch(audioPath);
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  return audioBuffer;
}

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
