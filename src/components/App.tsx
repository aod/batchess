import styles from "@/components/App.module.css";
import { LazyMotion } from "framer-motion";

import Board from "@/components/Board";
import Controls from "@/components/Controls";

import { SquareNotation } from "@/lib/AN/Square";
import {
  chessStore,
  selectBoard,
  selectCurrentTurn,
  selectIsFlipped,
  useChessStore,
} from "@/lib/Chess";
import { simulateMove } from "@/lib/move/simulate";
import usePromise from "@/hooks/usePromise";

export default function App() {
  const moveSfx = usePromise("move", () => fetchAudio("/Move.ogg"));

  const board = useChessStore(selectBoard);
  const isFlipped = useChessStore(selectIsFlipped);
  const currentTurn = useChessStore(selectCurrentTurn);

  const swapPieces = (s1: SquareNotation, s2: SquareNotation) => {
    if (chessStore.playMove(s1, s2)) {
      playSfx(moveSfx);
    }
  };

  const possibleMoveSquares = (s: SquareNotation) => {
    const piece = board[s];
    if (!piece) return [];
    const moves = [...simulateMove(piece, s, board, currentTurn)];
    return moves.map(({ to }) => to);
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

function playSfx(buffer: AudioBuffer) {
  const sampleSource = new AudioBufferSourceNode(audioContext, {
    buffer,
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
