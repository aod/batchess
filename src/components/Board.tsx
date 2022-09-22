import styles from "@/components/Board.module.css";
import {
  createContext,
  RefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import Piece from "@/components/Piece";
import Square from "@/components/Square";

import { at } from "@/lib/Board";
import Rank, { Ranks } from "@/lib/Rank";
import File, { Files } from "@/lib/File";
import {
  SquareNotation,
  flipSNotation,
  squareNotation,
  extractSNotation,
} from "@/lib/AN/Square";
import {
  useChessStore,
  selectBoard,
  selectIsFlipped,
  selectCurrentTurn,
  chessStore,
} from "@/lib/Chess";
import { simulateMove } from "@/lib/move/simulate";
import useAudio from "@/hooks/useAudio";
import XY from "@/util/XY";
import { nxtChr } from "@/util/string";

export const BoardDragConstraintRefContext = createContext<
  RefObject<HTMLDivElement>
>(null as unknown as RefObject<HTMLDivElement>);

export type CoordSetter = (xy: XY) => void;
export interface IPieceMoveHandlerContext {
  onPieceMove: CoordSetter;
  play: () => void;
  reset: () => void;
}
export const PieceMoveHandlerContext = createContext<IPieceMoveHandlerContext>(
  {} as unknown as IPieceMoveHandlerContext
);

export default function Board() {
  const board = useChessStore(selectBoard);
  const isFlipped = useChessStore(selectIsFlipped);
  const currentTurn = useChessStore(selectCurrentTurn);

  const playMoveSfx = useAudio("/Move.ogg");

  const ref = useRef<HTMLDivElement>(null);
  const [currPieceStartIdx, setCurrPieceStartIdx] = useState<XY | null>(null);
  const [currPieceIdx, setCurrPieceIdx] = useState<XY | null>(null);

  useEffect(() => {
    window.addEventListener("blur", reset);
    () => window.removeEventListener("blur", reset);
  }, []);

  function toBoardSquare(xy: XY): SquareNotation {
    const s = toSquare(xy);
    return isFlipped ? flipSNotation(s) : s;
  }

  const possibleMoveSquares = useMemo(() => {
    if (!currPieceStartIdx) return [];
    const s = toBoardSquare(currPieceStartIdx);
    const piece = board[s];
    if (!piece) return [];
    const moves = [...simulateMove(piece, s, board, currentTurn)];
    return moves
      .map(({ to }) => to)
      .map((s) => (isFlipped ? flipSNotation(s) : s));
  }, [currPieceStartIdx, board]);

  const onPieceMove: CoordSetter = (xy) => {
    const idx = boardXYtoIdx(xy, ref.current!, squareSize());
    if (!currPieceStartIdx) setCurrPieceStartIdx(idx);
    if (currPieceIdx?.x !== idx.x || currPieceIdx?.y !== idx.y)
      setCurrPieceIdx(idx);
  };

  function play() {
    if (!currPieceStartIdx || !currPieceIdx) return;
    let from = toBoardSquare(currPieceStartIdx!);
    let to = toBoardSquare(currPieceIdx!);
    if (chessStore.playMove(from, to)) playMoveSfx();
    reset();
  }

  function reset() {
    setCurrPieceStartIdx(null);
    setCurrPieceIdx(null);
  }

  function squareSize() {
    return (ref?.current?.clientWidth ?? 0) / 8;
  }

  function doesHitOpponentsPiece(sn: SquareNotation): boolean {
    if (!currPieceStartIdx) return false;
    const _s = toSquare(currPieceStartIdx);
    const s = isFlipped ? flipSNotation(_s) : _s;
    const piece = board[s];
    if (!piece) return false;
    const target = board[isFlipped ? flipSNotation(sn) : sn];
    if (!target) return false;
    return target.isWhite !== piece.isWhite;
  }

  const ranks = isFlipped ? Ranks.slice() : Ranks.slice().reverse();
  const files = isFlipped ? Files.slice().reverse() : Files.slice();

  return (
    <div ref={ref} className={styles.board}>
      {currPieceStartIdx && (
        <div
          style={{
            position: "absolute",
            left: currPieceStartIdx.x * squareSize(),
            top: currPieceStartIdx.y * squareSize(),
            width: squareSize(),
            height: squareSize(),
            backgroundColor: "var(--square-move-start-color)",
            opacity: 0.8,
          }}
        ></div>
      )}

      {possibleMoveSquares.map((square, i) => (
        <svg
          key={i}
          style={{
            position: "absolute",
            left: sNotationToIdx(square).x * squareSize(),
            top: sNotationToIdx(square).y * squareSize(),
          }}
          width={squareSize()}
          height={squareSize()}
        >
          <circle
            cx={squareSize() / 2}
            cy={squareSize() / 2}
            r={doesHitOpponentsPiece(square) ? squareSize() : squareSize() / 7}
            fill={
              doesHitOpponentsPiece(square)
                ? "none"
                : "var(--circle-move-hint-color)"
            }
            stroke={
              doesHitOpponentsPiece(square)
                ? "var(--circle-move-hint-color)"
                : "none"
            }
            strokeWidth={squareSize() * 0.95}
          />
        </svg>
      ))}

      {currPieceIdx && (
        <div
          style={{
            position: "absolute",
            left: currPieceIdx.x * squareSize(),
            top: currPieceIdx.y * squareSize(),
            width: squareSize(),
            height: squareSize(),
            border: "0.25rem solid #e0e0e0",
          }}
        ></div>
      )}

      <BoardDragConstraintRefContext.Provider value={ref}>
        <PieceMoveHandlerContext.Provider value={{ onPieceMove, reset, play }}>
          {ranks.map((rank, y) => (
            <div key={y} className={styles.row}>
              {files.map((file, x) => (
                <Square key={x} rank={rank} file={file}>
                  {at(board, file, rank) && (
                    <Piece piece={at(board, file, rank)!} />
                  )}
                </Square>
              ))}
            </div>
          ))}
        </PieceMoveHandlerContext.Provider>
      </BoardDragConstraintRefContext.Provider>
    </div>
  );
}

function clamp(min: number, val: number, max: number) {
  return Math.min(Math.max(val, min), max);
}

function sNotationToIdx(notation: SquareNotation): XY {
  const [file, rank] = extractSNotation(notation);
  return {
    y: 8 - rank,
    x: file.charCodeAt(0) - 97,
  };
}

function boardXYtoIdx(
  xy: XY,
  board: {
    offsetLeft: number;
    offsetTop: number;
    clientWidth: number;
    clientHeight: number;
  },
  squareSize: number
): XY {
  const { offsetLeft, offsetTop, clientWidth, clientHeight } = board;

  const x = clamp(0, xy.x - offsetLeft, clientWidth - 1);
  const y = clamp(0, xy.y - offsetTop, clientHeight - 1);

  const xIdx = Math.floor(x / squareSize);
  const yIdx = Math.floor(y / squareSize);

  return { x: xIdx, y: yIdx };
}

function toSquare({ x, y }: XY): SquareNotation {
  const rank = 8 - y;
  if (rank < 1) throw new Error(`Invalid rank notation ${rank}`);
  const file = nxtChr("a", x);
  if (file > "h") throw new Error(`Invalid file notation ${file}`);
  return squareNotation(file as File, rank as Rank);
}
