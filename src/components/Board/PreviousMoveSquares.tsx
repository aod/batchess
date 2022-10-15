import { useContext } from "react";

import { PieceMoveHandlerContext } from "@/contexts/PieceMoveHandlerContext";
import useSquareSize from "@/hooks/useSquareSize";
import { sNotationToIdx } from "@/util/XY";

export default function PreviouseMoveSquares() {
  const { previousMove } = useContext(PieceMoveHandlerContext);
  const squareSize = useSquareSize();

  const [fromS, toS] = previousMove!;

  const from = sNotationToIdx(fromS!);
  const to = sNotationToIdx(toS!);

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: from!.x * squareSize,
          top: from!.y * squareSize,
          width: squareSize,
          height: squareSize,
          border: "0.2rem solid black",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: to!.x * squareSize,
          top: to!.y * squareSize,
          width: squareSize,
          height: squareSize,
          border: "0.2rem solid black",
        }}
      />
    </>
  );
}
