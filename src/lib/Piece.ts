export enum PieceKind {
  King,
  Queen,
  Bishop,
  Knight,
  Rook,
  Pawn,
}

export default interface Piece {
  kind: PieceKind;
  isWhite: boolean;
  firstMoveAtTurn?: number;
}

export function createPiece(
  kind: PieceKind,
  isWhite: boolean,
  firstMoveAtTurn?: number
): Piece {
  return { kind, isWhite, firstMoveAtTurn };
}
