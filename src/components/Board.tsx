import {
  Board as TBoard,
  createPosition,
  File,
  Files,
  flipPosition,
  Position,
  Rank,
  Ranks,
} from "../lib";
import Square from "./Square";
import styles from "./Board.module.css";
import Piece from "./Piece";
import {
  createContext,
  RefObject,
  startTransition,
  useDeferredValue,
  useMemo,
  useRef,
  useState,
} from "react";

export const DragConstraintRefContext = createContext<
  RefObject<HTMLDivElement>
>(null as unknown as RefObject<HTMLDivElement>);

export interface XY {
  x: number;
  y: number;
}
export type CoordSetter = (xy: XY) => void;
export interface TCurrPieceCoordSetterContext {
  onPieceMove: CoordSetter;
  play: () => void;
  reset: () => void;
}
export const CurrPieceCoordSetterContext =
  createContext<TCurrPieceCoordSetterContext>(
    {} as unknown as TCurrPieceCoordSetterContext
  );

export interface BoardProps {
  board?: TBoard;
  onMove?: (from: Position, to: Position) => void;
  flipped?: boolean;
}

export default function Board(props: BoardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [currPieceStartIdx, setCurrPieceStartIdx] = useState<XY | null>(null);
  const [currPieceIdx, setCurrPieceIdx] = useState<XY | null>(null);
  const deferredCurrPieceIdx = useDeferredValue(currPieceIdx);

  const onPieceMove: CoordSetter = (xy) => {
    const idx = pieceXYToIdxs(xy);
    if (!currPieceStartIdx) setCurrPieceStartIdx(idx);
    if (currPieceIdx?.x !== idx.x || currPieceIdx?.y !== idx.y) {
      startTransition(() => {
        setCurrPieceIdx(idx);
      });
    }
  };

  function play() {
    if (!currPieceStartIdx || !currPieceIdx) return;

    let from = xyToPosition(currPieceStartIdx!);
    let to = xyToPosition(currPieceIdx!);
    if (props.flipped) {
      from = flipPosition(from);
      to = flipPosition(to);
    }
    props.onMove?.(from, to);

    reset();
  }

  function reset() {
    setCurrPieceStartIdx(null);
    setCurrPieceIdx(null);
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
            backgroundColor: "#e0d33e",
            opacity: 0.8,
          }}
        ></div>
      )}
      {deferredCurrPieceIdx && (
        <div
          style={{
            position: "absolute",
            left: deferredCurrPieceIdx.x * squareSize(),
            top: deferredCurrPieceIdx.y * squareSize(),
            width: squareSize(),
            height: squareSize(),
            border: "0.25rem solid #e0e0e0",
          }}
        ></div>
      )}

      <DragConstraintRefContext.Provider value={ref}>
        <CurrPieceCoordSetterContext.Provider
          value={{ onPieceMove, reset, play }}
        >
          {ranks.map((rank, y) => (
            <div key={y} className={styles.row}>
              {files.map((file, x) => (
                <Square key={x} rank={rank} file={file}>
                  {props.board?.[createPosition(file, rank)] && (
                    <Piece piece={props.board?.[createPosition(file, rank)]!} />
                  )}
                </Square>
              ))}
            </div>
          ))}
        </CurrPieceCoordSetterContext.Provider>
      </DragConstraintRefContext.Provider>
    </div>
  );
}

function clamp(min: number, val: number, max: number) {
  return Math.min(Math.max(val, min), max);
}

function xyToPosition({ x, y }: XY): Position {
  const rank = 8 - y;
  const file = 97 + x;
  return createPosition(String.fromCharCode(file) as File, rank as Rank);
}
