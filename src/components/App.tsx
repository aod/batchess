import styles from "./App.module.css";
import { LazyMotion } from "framer-motion";

import Board from "./Board";
import Controls from "./Controls";

import { SquareNotation } from "../lib/AN/Square";
import {
  chessStore,
  selectBoard,
  selectCurrentTurn,
  selectIsFlipped,
  useChessStore,
} from "../lib/Chess";
import { simValidMoves } from "../lib/move/valid";

export default function App() {
  if (!moveSfx) throw fetchMoveSfx();

  const board = useChessStore(selectBoard);
  const isFlipped = useChessStore(selectIsFlipped);
  const currentTurn = useChessStore(selectCurrentTurn);

  const swapPieces = (s1: SquareNotation, s2: SquareNotation) => {
    if (chessStore.playMove(s1, s2)) {
      playMoveSfx();
    }
  };

  const possibleMoveSquares = (s: SquareNotation) => {
    const piece = board[s];
    if (!piece) return [];
    const moves = [...simValidMoves(piece, s, board, currentTurn)];
    return moves;
  };

  return (
    <div id="app" className={styles.app}>
      <div className={styles.game}>
        <LazyMotion strict features={loadMotionFeatures}>
          <Board
            board={board}
            onMove={swapPieces}
            flipped={isFlipped}
            possibleMoveSquares={possibleMoveSquares}
          />
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
