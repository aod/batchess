import { PieceKind } from "../Piece";

export enum PieceMoveType {
  Pawn,
  Horizontal,
  Vertical,
  Diagonal,
  Knight,
  King,
}

export default interface PieceMover {
  moves: Set<PieceMoveType>;
}

export const PieceMovements: Readonly<Record<PieceKind, Readonly<PieceMover>>> =
  {
    [PieceKind.King]: { moves: new Set([PieceMoveType.King]) },
    [PieceKind.Queen]: {
      moves: new Set([
        PieceMoveType.Horizontal,
        PieceMoveType.Vertical,
        PieceMoveType.Diagonal,
      ]),
    },
    [PieceKind.Bishop]: { moves: new Set([PieceMoveType.Diagonal]) },
    [PieceKind.Knight]: { moves: new Set([PieceMoveType.Knight]) },
    [PieceKind.Rook]: {
      moves: new Set([PieceMoveType.Horizontal, PieceMoveType.Vertical]),
    },
    [PieceKind.Pawn]: { moves: new Set([PieceMoveType.Pawn]) },
  };
