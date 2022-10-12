import { useContext } from "react";

import { PieceMoveHandlerContext } from "@/contexts/PieceMoveHandlerContext";
import useSquareSize from "@/hooks/useSquareSize";

export default function HighlightStartSquare() {
  const { pieceStartIdx } = useContext(PieceMoveHandlerContext);
  const getSquareSize = useSquareSize();

  return (
    <div
      style={{
        position: "absolute",
        left: pieceStartIdx!.x * getSquareSize(),
        top: pieceStartIdx!.y * getSquareSize(),
        width: getSquareSize(),
        height: getSquareSize(),
        backgroundColor: "var(--square-move-start-color)",
        opacity: 0.8,
      }}
    ></div>
  );
}
