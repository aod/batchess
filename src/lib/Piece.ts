export enum PieceKind {
  King,
  Queen,
  Bishop,
  Knight,
  Rook,
  Pawn,
}

type Piece<T extends PieceKind = PieceKind> = T extends PieceKind.Pawn
  ? {
      kind: PieceKind.Pawn;
      isWhite: boolean;
      hasMoved: boolean;
    }
  : { kind: T; isWhite: boolean };
export default Piece;

export function createPiece(kind: PieceKind, isWhite: boolean): Piece {
  if (kind === PieceKind.Pawn) {
    return { kind, isWhite, hasMoved: false };
  }
  return { kind, isWhite };
}
