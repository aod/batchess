export const PiecesAmount = 6;

export enum PieceKind {
  King,
  Queen,
  Rook,
  Bishop,
  Knight,
  Pawn,
}

export interface Piece {
  kind: PieceKind;
  isBlack: boolean;
}

export type Rank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type File = "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h";
