import { useContext } from "react";

import { PieceMoveHandlerContext } from "@/contexts/PieceMoveHandlerContext";
import useSquareSize from "@/hooks/useSquareSize";

export default function HighlightStartSquare() {
  const { pieceStartIdx } = useContext(PieceMoveHandlerContext);
  const squareSize = useSquareSize();

  return (
    <div
      style={{
        position: "absolute",
        left: pieceStartIdx!.x * squareSize,
        top: pieceStartIdx!.y * squareSize,
        width: squareSize,
        height: squareSize,
        backgroundColor: "var(--square-move-start-color)",
        opacity: 0.8,
      }}
    ></div>
  );
}
