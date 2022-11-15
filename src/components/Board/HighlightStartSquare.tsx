import styles from "./HighlightStartSquare.module.css";
import { useContext } from "react";

import { PieceMoveHandlerContext } from "@/contexts/PieceMoveHandlerContext";
import Square from "@/components/Board/Square";

export default function HighlightStartSquare() {
  const { pieceStartIdx } = useContext(PieceMoveHandlerContext);

  return (
    <Square x={pieceStartIdx!.x} y={pieceStartIdx!.y}>
      <div className={styles.hlStartSquare} />
    </Square>
  );
}
