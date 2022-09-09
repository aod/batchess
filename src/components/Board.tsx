import { Board as TBoard, createPosition, Files, Ranks } from "../lib";
import Square from "./Square";
import styles from "./Board.module.css";
import Piece from "./Piece";
import { createContext, RefObject, useRef } from "react";

export interface BoardProps {
  board?: TBoard;
}

export const DragConstraintRefContext = createContext<
  RefObject<HTMLDivElement>
>(null as unknown as RefObject<HTMLDivElement>);

export default function Board(props: BoardProps) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div ref={ref} className={styles.board}>
      <DragConstraintRefContext.Provider value={ref}>
        {Ranks.slice()
          .reverse()
          .map((rank, i) => (
            <div key={i} className={styles.row}>
              {Files.map((file, i) => (
                <Square key={i} rank={rank} file={file}>
                  {props.board?.[createPosition(file, rank)] && (
                    <Piece piece={props.board?.[createPosition(file, rank)]!} />
                  )}
                </Square>
              ))}
            </div>
          ))}
      </DragConstraintRefContext.Provider>
    </div>
  );
}
