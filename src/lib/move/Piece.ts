import { PieceKind } from "../Piece";

export enum PieceMoveType {
  Pawn,
  Horizontal,
  Vertical,
  Diagonal,
  Knight,
  King,
}

export default interface PieceMovement {
  type: PieceMoveType[];
}

export const PieceMovements: Readonly<
  Record<PieceKind, Readonly<PieceMovement>>
> = {
  [PieceKind.King]: { type: [PieceMoveType.King] },
  [PieceKind.Queen]: {
    type: [
      PieceMoveType.Horizontal,
      PieceMoveType.Vertical,
      PieceMoveType.Diagonal,
    ],
  },
  [PieceKind.Bishop]: { type: [PieceMoveType.Diagonal] },
  [PieceKind.Knight]: { type: [PieceMoveType.Knight] },
  [PieceKind.Rook]: {
    type: [PieceMoveType.Horizontal, PieceMoveType.Vertical],
  },
  [PieceKind.Pawn]: { type: [PieceMoveType.Pawn] },
};
