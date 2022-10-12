import styles from "./Board.module.css";
import { forwardRef, useContext } from "react";

import HighlightMoveSquare from "@/components/Board/HighlightMoveSquare";
import PossibleMoveHints from "@/components/Board/PossibleMoveHints";
import HighlightStartSquare from "@/components/Board/HighlightStartSquare";
import Pieces from "@/components/Board/Pieces";

import { PieceMoveHandlerContext } from "@/contexts/PieceMoveHandlerContext";

const Board = forwardRef<HTMLDivElement>((_, ref) => {
  const { movingPieceIdx, pieceStartIdx } = useContext(PieceMoveHandlerContext);

  return (
    <div ref={ref} className={styles.board}>
      {pieceStartIdx && <HighlightStartSquare />}
      <PossibleMoveHints />
      {movingPieceIdx && <HighlightMoveSquare />}

      <Pieces />
    </div>
  );
});

export default Board;
