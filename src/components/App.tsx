import Board from "./Board";
import Controls, { useControls } from "./Controls";
import styles from "./App.module.css";

import { boardFEN } from "../lib/Board";
import { SquareNotation } from "../lib/AN/Square";
import { LazyMotion } from "framer-motion";
import { useChessStore } from "../lib/Chess";

export default function App() {
  if (!moveSfx) throw fetchMoveSfx();

  const { isFlipped } = useControls();
  const board = useChessStore((state) => state.board);

  function swapPieces(pos1: SquareNotation, pos2: SquareNotation) {
    playMoveSfx();
  }

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
