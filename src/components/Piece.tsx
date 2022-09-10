import { CSSProperties, useContext } from "react";
import { Piece as TPiece, PieceKind } from "../lib";
import { motion } from "framer-motion";
import styles from "./Piece.module.css";
import { CurrPieceCoordSetterContext, DragConstraintRefContext } from "./Board";

export interface PieceProps {
  piece: TPiece;
}

export default function Piece(props: PieceProps) {
  const ref = useContext(DragConstraintRefContext);
  const setCoord = useContext(CurrPieceCoordSetterContext);

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
      onDrag={(_, info) => {
        setCoord({ x: info.point.x, y: info.point.y });
      }}
      onDragEnd={() => setCoord(null)}
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
