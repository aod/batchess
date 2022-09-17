import styles from "./Piece.module.css";
import { CSSProperties, useContext, useRef, useState } from "react";
import { m, useDragControls } from "framer-motion";

import {
  PieceMoveHandlerContext,
  BoardDragConstraintRefContext,
} from "./Board";

import TPiece, { PieceKind } from "../lib/Piece";

export interface PieceProps {
  piece: TPiece;
}

export default function Piece(props: PieceProps) {
  const dragConstraintsRef = useContext(BoardDragConstraintRefContext);
  const { onPieceMove, reset, play } = useContext(PieceMoveHandlerContext);

  const ref = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();

  const [isReset, setIsReset] = useState(false);
  const isDragging = useRef(false);

  return (
    <m.div
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
        isDragging.current = false;
        play();
      }}
      whileDrag={{ zIndex: 1 }}
      dragConstraints={dragConstraintsRef}
      dragElastic={0.1}
      style={
        {
          ["--piece-offset"]: props.piece.kind,
          ["--piece-is-black"]: props.piece.isWhite ? 0 : 1,
        } as CSSProperties
      }
    />
  );
}
