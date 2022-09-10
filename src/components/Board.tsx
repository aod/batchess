import {
  Board as TBoard,
  createPosition,
  File,
  Files,
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
export type CoordSetter = (xy: XY | null) => void;
export const CurrPieceCoordSetterContext = createContext<CoordSetter>(
  null as unknown as CoordSetter
);

export interface BoardProps {
  board?: TBoard;
  onMove?: (from: Position, to: Position) => void;
}

export default function Board(props: BoardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [currPieceStartIdx, setCurrPieceStartIdx] = useState<XY | null>(null);
  const [currPieceIdx, setCurrPieceIdx] = useState<XY | null>(null);
  const deferredCurrPieceIdx = useDeferredValue(currPieceIdx);

  const onCoordSet: CoordSetter = (xy) => {
    if (xy) {
      startTransition(() => {
        const idx = pieceXYToIdxs(xy);
        if (!currPieceStartIdx) setCurrPieceStartIdx(idx);
        if (currPieceIdx?.x !== idx.x || currPieceIdx?.y !== idx.y) {
          setCurrPieceIdx(idx);
        }
      });
    } else {
      props.onMove?.(
        xyToPosition(currPieceStartIdx!),
        xyToPosition(currPieceIdx!)
      );
      setCurrPieceStartIdx(null);
      setCurrPieceIdx(null);
    }
  };

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

  const $pieces = useMemo(
    () =>
      Ranks.slice()
        .reverse()
        .map((rank, y) => (
          <div key={y} className={styles.row}>
            {Files.map((file, x) => (
              <Square key={x} rank={rank} file={file}>
                {props.board?.[createPosition(file, rank)] && (
                  <Piece piece={props.board?.[createPosition(file, rank)]!} />
                )}
              </Square>
            ))}
          </div>
        )),
    [currPieceIdx]
  );

  return (
    <div ref={ref} className={styles.board}>
      <DragConstraintRefContext.Provider value={ref}>
        <CurrPieceCoordSetterContext.Provider value={onCoordSet}>
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

          {$pieces}
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
