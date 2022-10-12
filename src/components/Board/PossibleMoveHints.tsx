import { useCallback, useContext, useMemo } from "react";

import { PieceMoveHandlerContext } from "@/contexts/PieceMoveHandlerContext";
import useSquareSize from "@/hooks/useSquareSize";
import { flipSNotation, SquareNotation } from "@/lib/AN/Square";
import {
  useChessStore,
  selectBoard,
  selectIsFlipped,
  selectCurrentTurn,
} from "@/lib/Chess";
import { simulateMove } from "@/lib/move/simulate";
import XY, { sNotationToIdx, XYtoSquare } from "@/util/XY";

export default function PossibleMoveHints() {
  const { pieceStartIdx } = useContext(PieceMoveHandlerContext);
  const getSquareSize = useSquareSize();

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
        <svg
          key={i}
          style={{
            position: "absolute",
            left: sNotationToIdx(square).x * getSquareSize(),
            top: sNotationToIdx(square).y * getSquareSize(),
          }}
          width={getSquareSize()}
          height={getSquareSize()}
        >
          <circle
            cx={getSquareSize() / 2}
            cy={getSquareSize() / 2}
            r={
              doesHitOpponentsPiece(square)
                ? getSquareSize()
                : getSquareSize() / 7
            }
            fill={
              doesHitOpponentsPiece(square)
                ? "none"
                : "var(--circle-move-hint-color)"
            }
            stroke={
              doesHitOpponentsPiece(square)
                ? "var(--circle-move-hint-color)"
                : "none"
            }
            strokeWidth={getSquareSize() * 0.95}
          />
        </svg>
      ))}
    </>
  );
}
