import styles from "./PreviousMoveSquares.module.css";
import { useContext } from "react";

import { PieceMoveHandlerContext } from "@/contexts/PieceMoveHandlerContext";
import { sNotationToIdx } from "@/util/XY";
import Square from "@/components/Board/Square";

export default function PreviouseMoveSquares() {
  const { previousMove } = useContext(PieceMoveHandlerContext);

  const [fromS, toS] = previousMove!;

  const from = sNotationToIdx(fromS!);
  const to = sNotationToIdx(toS!);

  return (
    <>
      <Square x={from!.x} y={from!.y}>
        <div className={styles.fromSquare} />
      </Square>
      <Square x={to!.x} y={to!.y}>
        <div className={styles.toSquare} />
      </Square>
    </>
  );
}
