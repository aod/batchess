import { PieceKind } from "@/lib/Piece";

export enum PieceMoveType {
  Pawn,
  Horizontal,
  Vertical,
  Diagonal,
  Knight,
  King,
  EnPassant,
  Fork,
}

export enum PieceMoveStrategy {
  Any,
  Trace,
}

export type PieceMovement = {
  type: PieceMoveType;
  strategy: PieceMoveStrategy;
  isPassive?: boolean;
};
export type PieceMovements = PieceMovement[];

export const PieceMovements: { [K in PieceKind]: Readonly<PieceMovements> } = {
  [PieceKind.King]: [
    { type: PieceMoveType.King, strategy: PieceMoveStrategy.Any },
  ],
  [PieceKind.Queen]: [
    { type: PieceMoveType.Horizontal, strategy: PieceMoveStrategy.Trace },
    { type: PieceMoveType.Vertical, strategy: PieceMoveStrategy.Trace },
    { type: PieceMoveType.Diagonal, strategy: PieceMoveStrategy.Trace },
  ],
  [PieceKind.Bishop]: [
    { type: PieceMoveType.Diagonal, strategy: PieceMoveStrategy.Trace },
  ],
  [PieceKind.Knight]: [
    { type: PieceMoveType.Knight, strategy: PieceMoveStrategy.Any },
  ],
  [PieceKind.Rook]: [
    { type: PieceMoveType.Horizontal, strategy: PieceMoveStrategy.Trace },
    { type: PieceMoveType.Vertical, strategy: PieceMoveStrategy.Trace },
  ],
  [PieceKind.Pawn]: [
    {
      type: PieceMoveType.Pawn,
      strategy: PieceMoveStrategy.Trace,
      isPassive: true,
    },
    { type: PieceMoveType.Fork, strategy: PieceMoveStrategy.Any },
    { type: PieceMoveType.EnPassant, strategy: PieceMoveStrategy.Any },
  ],
};
