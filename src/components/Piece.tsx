import { CSSProperties } from "react";
import { Piece as TPiece, PieceKind } from "../lib";
import styles from "./Piece.module.css";

export interface PieceProps {
  piece: TPiece;
}

export default function Piece(props: PieceProps) {
  return (
    <div
      className={styles.piece}
      data-kind={PieceKind[props.piece.kind]}
      style={
        {
          ["--piece-offset"]: props.piece.kind,
          ["--piece-is-black"]: props.piece.isBlack ? 1 : 0,
        } as CSSProperties
      }
    />
  );
}
