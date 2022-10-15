import { useContext } from "react";

import { PieceMoveHandlerContext } from "@/contexts/PieceMoveHandlerContext";
import useSquareSize from "@/hooks/useSquareSize";

export default function HighlightMoveSquare() {
  const { movingPieceIdx } = useContext(PieceMoveHandlerContext);
  const squareSize = useSquareSize();

  return (
    <div
      style={{
        position: "absolute",
        left: movingPieceIdx!.x * squareSize,
        top: movingPieceIdx!.y * squareSize,
        width: squareSize,
        height: squareSize,
        border: "0.25rem solid #e0e0e0",
      }}
    ></div>
  );
}
