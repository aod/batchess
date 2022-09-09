import { Board as TBoard, createPosition, Files, Ranks } from "../lib";
import Square from "./Square";
import styles from "./Board.module.css";
import Piece from "./Piece";

export interface BoardProps {
  board?: TBoard;
}

export default function Board(props: BoardProps) {
  return (
    <div>
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
    </div>
  );
}
