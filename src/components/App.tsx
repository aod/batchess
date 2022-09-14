import { useEffect, useState } from "react";

import Board from "./Board";
import Controls, { useControls } from "./Controls";
import styles from "./App.module.css";

import TBoard, { boardFEN, initBoard } from "../lib/Board";
import { SquareNotation } from "../lib/AN";
import { LazyMotion } from "framer-motion";

export default function App() {
  if (!moveSfx) throw fetchMoveSfx();

  const { isFlipped } = useControls();

  const [history, setHistory] = useState<TBoard[]>([initBoard()]);
  const [pointer, setPointer] = useState(0);
  const board = history.at(pointer)!;

  function swapPieces(pos1: SquareNotation, pos2: SquareNotation) {
    if (pointer < history.length - 1) return setPointer(history.length - 1);
    if (pos1 === pos2) return;

    const newBoard = Object.assign({}, board, {
      [pos2]: board[pos1],
      [pos1]: null,
    });
    setHistory(history.concat(newBoard));
    setPointer(history.length);

    playMoveSfx();
  }

  useEffect(() => {
    function changePointer(e: KeyboardEvent) {
      let delta: number | null = null;

      if (e.key === "ArrowLeft" && pointer > 0) {
        delta = -1;
      } else if (e.key === "ArrowRight" && pointer < history.length - 1) {
        delta = 1;
      }

      if (delta !== null) {
        setPointer(pointer + delta);
        playMoveSfx();
      }
    }

    window.addEventListener("keydown", changePointer);
    return () => window.removeEventListener("keydown", changePointer);
  }, [history, setHistory, pointer, setPointer]);

  return (
    <div id="app" className={styles.app}>
      <div>
        <p className={styles.fen}>{boardFEN(board)}</p>
      </div>
      <div className={styles.game}>
        <LazyMotion strict features={loadMotionFeatures}>
          <Board board={board} onMove={swapPieces} flipped={isFlipped} />
          <Controls />
        </LazyMotion>
      </div>
    </div>
  );
}

async function loadMotionFeatures() {
  return (await import("../motion-features")).default;
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
