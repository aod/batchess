import { useContext } from "react";

import { PieceMoveHandlerContext } from "@/contexts/PieceMoveHandlerContext";
import useSquareSize from "@/hooks/useSquareSize";

export default function HighlightMoveSquare() {
  const { movingPieceIdx } = useContext(PieceMoveHandlerContext);
  const getSquareSize = useSquareSize();

  return (
    <div
      style={{
        position: "absolute",
        left: movingPieceIdx!.x * getSquareSize(),
        top: movingPieceIdx!.y * getSquareSize(),
        width: getSquareSize(),
        height: getSquareSize(),
        border: "0.25rem solid #e0e0e0",
      }}
    ></div>
  );
}
