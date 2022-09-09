import { CSSProperties, useContext } from "react";
import { Piece as TPiece, PieceKind } from "../lib";
import { motion } from "framer-motion";
import styles from "./Piece.module.css";
import { DragConstraintRefContext } from "./Board";

export interface PieceProps {
  piece: TPiece;
}

export default function Piece(props: PieceProps) {
  const ref = useContext(DragConstraintRefContext);

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
      dragConstraints={ref}
      dragElastic={0.1}
      style={
        {
          ["--piece-offset"]: props.piece.kind,
          ["--piece-is-black"]: props.piece.isBlack ? 1 : 0,
        } as CSSProperties
      }
    />
  );
}
