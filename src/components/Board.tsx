import { Board as TBoard, createPosition, Files, Ranks } from "../lib";
import Square from "./Square";
import styles from "./Board.module.css";
import Piece from "./Piece";
import {
  createContext,
  RefObject,
  startTransition,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";

export const DragConstraintRefContext = createContext<
  RefObject<HTMLDivElement>
>(null as unknown as RefObject<HTMLDivElement>);

export interface Coord {
  x: number;
  y: number;
}
export type CoordSetter = (coord: Coord | null) => void;
export const CurrPieceCoordSetterContext = createContext<CoordSetter>(
  null as unknown as CoordSetter
);

export interface BoardProps {
  board?: TBoard;
}

export default function Board(props: BoardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [coord, setCoord] = useState<Coord | null>(null);

  const onCoordSet = useCallback<CoordSetter>((c) => {
    if (c?.x !== coord?.x || c?.y !== coord?.y) {
      startTransition(() => {
        setCoord(c);
      });
    }
  }, []);

  const squareSize = (ref?.current?.clientWidth ?? 0) / 8;

  const x = clamp(
    (coord?.x ?? 0) - (ref?.current?.offsetLeft ?? 0),
    0,
    (ref?.current?.clientWidth ?? 0) - 1
  );
  const xIndex = Math.floor(x / squareSize);

  const y = clamp(
    (coord?.y ?? 0) - (ref?.current?.offsetTop ?? 0),
    0,
    (ref?.current?.clientHeight ?? 0) - 1
  );
  const yIndex = Math.floor(y / squareSize);

  console.log({ x, y }, { xIndex, yIndex });

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
    []
  );

  return (
    <div ref={ref} className={styles.board}>
      <DragConstraintRefContext.Provider value={ref}>
        <CurrPieceCoordSetterContext.Provider value={onCoordSet}>
          {$pieces}
        </CurrPieceCoordSetterContext.Provider>
      </DragConstraintRefContext.Provider>
    </div>
  );
}

function clamp(val: number, min: number, max: number) {
  return Math.min(Math.max(val, min), max);
}
