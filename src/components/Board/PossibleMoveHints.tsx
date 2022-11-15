import { useCallback, useContext, useMemo } from "react";

import { PieceMoveHandlerContext } from "@/contexts/PieceMoveHandlerContext";
import { flipSNotation, SquareNotation } from "@/lib/AN/Square";
import {
  useChessStore,
  selectBoard,
  selectIsFlipped,
  selectCurrentTurn,
} from "@/lib/Chess";
import { simulateMove } from "@/lib/move/simulate";
import XY, { sNotationToIdx, XYtoSquare } from "@/util/XY";
import Square from "@/components/Board/Square";

export default function PossibleMoveHints() {
  const { pieceStartIdx } = useContext(PieceMoveHandlerContext);

  const board = useChessStore(selectBoard);
  const isFlipped = useChessStore(selectIsFlipped);
  const currentTurn = useChessStore(selectCurrentTurn);

  const toBoardSquare = useCallback(
    (xy: XY): SquareNotation => {
      const s = XYtoSquare(xy);
      return isFlipped ? flipSNotation(s) : s;
    },
    [isFlipped]
  );

  const possibleMoveSquares = useMemo(() => {
    if (!pieceStartIdx) return [];
    const s = toBoardSquare(pieceStartIdx);
    const piece = board[s];
    if (!piece) return [];
    const moves = [...simulateMove(piece, s, board, currentTurn)];
    return moves
      .map(({ to }) => to)
      .map((s) => (isFlipped ? flipSNotation(s) : s));
  }, [pieceStartIdx, board]);

  function doesHitOpponentsPiece(sn: SquareNotation): boolean {
    if (!pieceStartIdx) return false;
    const _s = XYtoSquare(pieceStartIdx);
    const s = isFlipped ? flipSNotation(_s) : _s;
    const piece = board[s];
    if (!piece) return false;
    const target = board[isFlipped ? flipSNotation(sn) : sn];
    if (!target) return false;
    return target.isWhite !== piece.isWhite;
  }

  return (
    <>
      {possibleMoveSquares.map((square, i) => (
        <Square
          x={sNotationToIdx(square).x}
          y={sNotationToIdx(square).y}
          key={i}
        >
          <Dot isCapture={doesHitOpponentsPiece(square)} />
        </Square>
      ))}
    </>
  );
}

interface DotProps {
  isCapture?: boolean;
}

function Dot(props: DotProps) {
  return (
    <svg width="100%" height="100%">
      <circle
        cx="50%"
        cy="50%"
        r={props.isCapture ? "100%" : "15%"}
        fill={props.isCapture ? "none" : "var(--circle-move-hint-color)"}
        stroke={props.isCapture ? "var(--circle-move-hint-color)" : "none"}
        strokeWidth="95%"
      />
    </svg>
  );
}
