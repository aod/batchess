import Board, { findPiece } from "../Board";
import { PieceKind } from "../Piece";

export function isKingChecked(board: Board, forWhite: boolean) {
  const KsNotation = findPiece(board, {
    kind: PieceKind.King,
    isWhite: forWhite,
  })!;
  return false;
}
