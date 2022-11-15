import styles from "./HighlightMoveSquare.module.css";
import { useContext } from "react";

import { PieceMoveHandlerContext } from "@/contexts/PieceMoveHandlerContext";
import Square from "@/components/Board/Square";

export default function HighlightMoveSquare() {
  const { movingPieceIdx } = useContext(PieceMoveHandlerContext);

  return (
    <Square x={movingPieceIdx!.x} y={movingPieceIdx!.y}>
      <div className={styles.hlMoveSquare} />
    </Square>
  );
}
