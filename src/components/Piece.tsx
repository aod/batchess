import { CSSProperties } from "react";
import { Piece as TPiece, PieceKind } from "../lib";
import { motion } from "framer-motion";
import styles from "./Piece.module.css";

export interface PieceProps {
  piece: TPiece;
}

export default function Piece(props: PieceProps) {
  return (
    <motion.div
      className={styles.piece}
      data-kind={PieceKind[props.piece.kind]}
      dragSnapToOrigin
      drag
      dragTransition={{
        bounceStiffness: 200,
        bounceDamping: 30,
      }}
      style={
        {
          ["--piece-offset"]: props.piece.kind,
          ["--piece-is-black"]: props.piece.isBlack ? 1 : 0,
        } as CSSProperties
      }
    />
  );
}
