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
}

export function createPiece(kind: PieceKind, isWhite: boolean): Piece {
  return { kind, isWhite };
}
