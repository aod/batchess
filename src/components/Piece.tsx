import { CSSProperties, useContext, useRef, useState } from "react";
import { Piece as TPiece, PieceKind } from "../lib";
import { motion, useDragControls } from "framer-motion";
import styles from "./Piece.module.css";
import { CurrPieceCoordSetterContext, DragConstraintRefContext } from "./Board";

export interface PieceProps {
  piece: TPiece;
}

export default function Piece(props: PieceProps) {
  const dragConstraintsRef = useContext(DragConstraintRefContext);
  const { onPieceMove, reset, play } = useContext(CurrPieceCoordSetterContext);

  const ref = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();

  const [isReset, setIsReset] = useState(false);
  const isDragging = useRef(false);

  return (
    <motion.div
      ref={ref}
      animate={{ x: isReset ? 0 : undefined, y: isReset ? 0 : undefined }}
      className={styles.piece}
      data-kind={PieceKind[props.piece.kind]}
      dragSnapToOrigin
      dragControls={dragControls}
      drag
      dragTransition={{
        bounceStiffness: 200,
        bounceDamping: 30,
      }}
      onPointerDown={(e) => {
        ref.current!.style.cursor = "grabbing";
        dragControls.start(e, { snapToCursor: true });
        onPieceMove({ x: e.clientX, y: e.clientY });
        setIsReset(false);
      }}
      onPointerUp={() => {
        ref.current!.style.cursor = "grab";
        if (!isDragging.current) reset();
        setIsReset(true);
      }}
      onDrag={(_, info) => {
        isDragging.current = true;
        onPieceMove({ x: info.point.x, y: info.point.y });
      }}
      onDragEnd={() => {
        play();
      }}
      dragConstraints={dragConstraintsRef}
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
