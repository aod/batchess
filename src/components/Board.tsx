import styles from "./Board.module.css";
import { createContext, RefObject, useEffect, useRef, useState } from "react";

import Piece from "./Piece";
import Square from "./Square";

import TBoard, { at } from "../lib/Board";
import Rank, { Ranks } from "../lib/Rank";
import File, { Files } from "../lib/File";
import {
  SquareNotation,
  flipSNotation,
  squareNotation,
  extractSNotation,
} from "../lib/AN/Square";

export const BoardDragConstraintRefContext = createContext<
  RefObject<HTMLDivElement>
>(null as unknown as RefObject<HTMLDivElement>);

export interface XY {
  x: number;
  y: number;
}
export type CoordSetter = (xy: XY) => void;
export interface IPieceMoveHandlerContext {
  onPieceMove: CoordSetter;
  play: () => void;
  reset: () => void;
}
export const PieceMoveHandlerContext = createContext<IPieceMoveHandlerContext>(
  {} as unknown as IPieceMoveHandlerContext
);

export interface BoardProps {
  board: TBoard;
  onMove?: (from: SquareNotation, to: SquareNotation) => void;
  flipped?: boolean;
  possibleMoveSquares: (square: SquareNotation) => SquareNotation[];
}

export default function Board(props: BoardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [currPieceStartIdx, setCurrPieceStartIdx] = useState<XY | null>(null);
  const [currPieceIdx, setCurrPieceIdx] = useState<XY | null>(null);
  const [possibleMoveSquares, setPossibleMoveSquares] = useState<
    SquareNotation[]
  >([]);

  useEffect(() => {
    function onBlur() {
      setCurrPieceStartIdx(null);
      setCurrPieceIdx(null);
    }
    window.addEventListener("blur", onBlur);
    () => window.removeEventListener("blur", onBlur);
  }, []);

  const onPieceMove: CoordSetter = (xy) => {
    const idx = pieceXYToIdxs(xy);

    if (!currPieceStartIdx) {
      setCurrPieceStartIdx(idx);
      const _s = xyToPosition(idx);
      const s = props.flipped ? flipSNotation(_s) : _s;
      setPossibleMoveSquares(
        props
          .possibleMoveSquares(s)
          .map((s) => (props.flipped ? flipSNotation(s) : s))
      );
    }

    if (currPieceIdx?.x !== idx.x || currPieceIdx?.y !== idx.y) {
      setCurrPieceIdx(idx);
    }
  };

  function play() {
    if (!currPieceStartIdx || !currPieceIdx) return;

    let from = xyToPosition(currPieceStartIdx!);
    let to = xyToPosition(currPieceIdx!);
    if (props.flipped) {
      from = flipSNotation(from);
      to = flipSNotation(to);
    }
    props.onMove?.(from, to);

    reset();
  }

  function reset() {
    setCurrPieceStartIdx(null);
    setCurrPieceIdx(null);
    setPossibleMoveSquares([]);
  }

  function squareSize() {
    return (ref?.current?.clientWidth ?? 0) / 8;
  }

  function pieceXYToIdxs(xy: XY) {
    const board = ref?.current;
    const sqrSize = squareSize();

    const x = clamp(
      0,
      (xy?.x ?? 0) - (board?.offsetLeft ?? 0),
      (board?.clientWidth ?? 0) - 1
    );
    const xIndex = Math.floor(x / sqrSize);

    const y = clamp(
      0,
      (xy?.y ?? 0) - (board?.offsetTop ?? 0),
      (board?.clientHeight ?? 0) - 1
    );
    const yIndex = Math.floor(y / sqrSize);

    return { x: xIndex, y: yIndex };
  }

  const ranks = props.flipped ? Ranks.slice() : Ranks.slice().reverse();
  const files = props.flipped ? Files.slice().reverse() : Files.slice();

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
            r={squareSize() / 7}
            fill="var(--circle-move-hint-color)"
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
                  {at(props.board, file, rank) && (
                    <Piece piece={at(props.board, file, rank)!} />
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

function xyToPosition({ x, y }: XY) {
  const rank = 8 - y;
  const file = String.fromCharCode(97 + x);
  return squareNotation(file as File, rank as Rank);
}

function sNotationToIdx(notation: SquareNotation): XY {
  const [file, rank] = extractSNotation(notation);
  return {
    y: 8 - rank,
    x: file.charCodeAt(0) - 97,
  };
}
